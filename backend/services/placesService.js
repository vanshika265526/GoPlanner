// Free APIs service for fetching real places, cafes, and attractions
// Uses OpenStreetMap APIs - Completely FREE, no API keys needed!
// This service runs on the backend to keep API logic server-side

// OpenStreetMap Overpass API - Completely free, no API key needed
// Documentation: https://wiki.openstreetmap.org/wiki/Overpass_API

// Nominatim Geocoding API - Free, no API key needed
// Documentation: https://nominatim.org/

// Wikipedia API - Completely free, no API key needed
// Used for place descriptions

/**
 * Get coordinates for a destination using Nominatim (OpenStreetMap)
 * Completely free, no API key needed!
 */
export const getCoordinates = async (destination) => {
  try {
    const cityName = destination.split(',')[0].trim();
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'GoPlanner Travel App' // Required by Nominatim
        }
      }
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        country: data[0].display_name?.split(',').pop()?.trim() || '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

/**
 * Get tourist attractions using OpenStreetMap Overpass API
 * Completely free, no API key needed!
 */
export const getTouristAttractions = async (lat, lng, destination) => {
  try {
    // Overpass API query to get tourist attractions, monuments, museums, etc.
    const radius = 5000; // 5km radius
    const query = `
      [out:json][timeout:25];
      (
        node["tourism"~"^(attraction|museum|gallery|zoo|theme_park|viewpoint|monument)$"](around:${radius},${lat},${lng});
        way["tourism"~"^(attraction|museum|gallery|zoo|theme_park|viewpoint|monument)$"](around:${radius},${lat},${lng});
        relation["tourism"~"^(attraction|museum|gallery|zoo|theme_park|viewpoint|monument)$"](around:${radius},${lat},${lng});
        node["historic"](around:${radius},${lat},${lng});
        way["historic"](around:${radius},${lat},${lng});
        relation["historic"](around:${radius},${lat},${lng});
      );
      out center meta;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`
    });

    if (!response.ok) {
      throw new Error('Overpass API request failed');
    }

    const data = await response.json();
    
    if (data.elements && data.elements.length > 0) {
      const places = data.elements
        .filter(el => el.tags && el.tags.name) // Only places with names
        .slice(0, 15) // Limit to 15 places
        .map(el => {
          const coords = el.center || (el.lat && el.lon ? { lat: el.lat, lon: el.lon } : null);
          return {
            name: el.tags.name || 'Unknown Place',
            description: el.tags.description || el.tags.wikipedia || el.tags['description:en'] || '',
            rating: 'N/A', // OSM doesn't have ratings
            coordinates: coords ? { lat: parseFloat(coords.lat), lng: parseFloat(coords.lon) } : { lat, lng },
            address: el.tags['addr:full'] || el.tags['addr:street'] || destination,
            categories: [el.tags.tourism || el.tags.historic || 'attraction'],
            type: el.tags.tourism || el.tags.historic || 'attraction',
          };
        });

      // Get Wikipedia descriptions for top places
      const placesWithDescriptions = await Promise.all(
        places.slice(0, 10).map(async (place) => {
          try {
            const wikiDesc = await getPlaceDescription(place.name);
            if (wikiDesc) {
              place.description = wikiDesc.description.substring(0, 200);
            }
          } catch (err) {
            // Continue without description
          }
          return place;
        })
      );

      return placesWithDescriptions.length > 0 ? placesWithDescriptions : places;
    }

    // If no results, try getting places by city name from Nominatim
    return await getPlacesByCityName(destination, lat, lng);
  } catch (error) {
    console.error('Error fetching attractions from Overpass:', error);
    // Try alternative method
    return await getPlacesByCityName(destination, lat, lng);
  }
};

/**
 * Get cafes and restaurants using OpenStreetMap Overpass API
 * Completely free, no API key needed!
 */
export const getCafesAndRestaurants = async (lat, lng, destination) => {
  try {
    // Overpass API query to get restaurants, cafes, fast_food, etc.
    const radius = 3000; // 3km radius
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"^(restaurant|cafe|fast_food|bar|pub|food_court|ice_cream)$"](around:${radius},${lat},${lng});
        way["amenity"~"^(restaurant|cafe|fast_food|bar|pub|food_court|ice_cream)$"](around:${radius},${lat},${lng});
        relation["amenity"~"^(restaurant|cafe|fast_food|bar|pub|food_court|ice_cream)$"](around:${radius},${lat},${lng});
      );
      out center meta;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`
    });

    if (!response.ok) {
      throw new Error('Overpass API request failed');
    }

    const data = await response.json();
    
    if (data.elements && data.elements.length > 0) {
      const restaurants = data.elements
        .filter(el => el.tags && el.tags.name) // Only places with names
        .slice(0, 12) // Limit to 12 places
        .map(el => {
          const coords = el.center || (el.lat && el.lon ? { lat: el.lat, lon: el.lon } : null);
          const amenity = el.tags.amenity || 'restaurant';
          return {
            name: el.tags.name || 'Local Restaurant',
            type: amenity === 'cafe' || amenity === 'ice_cream' ? 'Cafe' : 'Restaurant',
            rating: 'N/A', // OSM doesn't have ratings
            address: el.tags['addr:full'] || el.tags['addr:street'] || el.tags['addr:housenumber'] 
              ? `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street'] || ''}`.trim() || destination
              : destination,
            coordinates: coords ? { lat: parseFloat(coords.lat), lng: parseFloat(coords.lon) } : { lat, lng },
            cuisine: el.tags.cuisine || '',
          };
        });

      return restaurants.length > 0 ? restaurants : await getRestaurantsByCityName(destination, lat, lng);
    }

    // If no results, try searching by city name
    return await getRestaurantsByCityName(destination, lat, lng);
  } catch (error) {
    console.error('Error fetching restaurants from Overpass:', error);
    // Try alternative method
    return await getRestaurantsByCityName(destination, lat, lng);
  }
};

/**
 * Get restaurants by searching city name in Nominatim
 */
const getRestaurantsByCityName = async (destination, lat, lng) => {
  try {
    const cityName = destination.split(',')[0].trim();
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName + ' restaurants cafes')}&format=json&limit=8`,
      {
        headers: {
          'User-Agent': 'GoPlanner Travel App'
        }
      }
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return data
        .filter(item => item.display_name && item.type && (item.type.includes('restaurant') || item.type.includes('cafe')))
        .map(item => ({
          name: item.display_name.split(',')[0] || 'Local Restaurant',
          type: item.type?.includes('cafe') ? 'Cafe' : 'Restaurant',
          rating: 'N/A',
          address: item.display_name,
          coordinates: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
          cuisine: '',
        }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching restaurants by city name:', error);
    return [];
  }
};

/**
 * Get hotels and accommodations using OpenStreetMap Overpass API
 * Filters by budget level
 */
export const getHotels = async (lat, lng, destination, budget) => {
  try {
    // Overpass API query to get hotels, hostels, guesthouses, etc.
    const radius = 5000; // 5km radius
    const query = `
      [out:json][timeout:25];
      (
        node["tourism"~"^(hotel|hostel|guest_house|apartment|resort|motel)$"](around:${radius},${lat},${lng});
        way["tourism"~"^(hotel|hostel|guest_house|apartment|resort|motel)$"](around:${radius},${lat},${lng});
        relation["tourism"~"^(hotel|hostel|guest_house|apartment|resort|motel)$"](around:${radius},${lat},${lng});
      );
      out center meta;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`
    });

    if (!response.ok) {
      throw new Error('Overpass API request failed');
    }

    const data = await response.json();
    
    if (data.elements && data.elements.length > 0) {
      let hotels = data.elements
        .filter(el => el.tags && el.tags.name) // Only hotels with names
        .map(el => {
          const coords = el.center || (el.lat && el.lon ? { lat: el.lat, lon: el.lon } : null);
          const tourismType = el.tags.tourism || 'hotel';
          
          // Determine budget category based on hotel type and stars
          let hotelBudget = 'Mid';
          if (tourismType === 'hostel' || tourismType === 'guest_house' || tourismType === 'motel') {
            hotelBudget = 'Low';
          } else if (tourismType === 'resort' || el.tags['stars'] >= '4') {
            hotelBudget = 'High';
          } else if (el.tags['stars'] === '3' || el.tags['stars'] === '2') {
            hotelBudget = 'Mid';
          } else if (el.tags['stars'] === '1' || !el.tags['stars']) {
            hotelBudget = 'Low';
          }
          
          return {
            name: el.tags.name || 'Local Hotel',
            type: tourismType,
            budget: hotelBudget,
            stars: el.tags['stars'] || '',
            address: el.tags['addr:full'] || el.tags['addr:street'] || destination,
            coordinates: coords ? { lat: parseFloat(coords.lat), lng: parseFloat(coords.lon) } : { lat, lng },
            website: el.tags.website || '',
            phone: el.tags.phone || '',
          };
        });

      // Filter by budget
      if (budget === 'Low') {
        hotels = hotels.filter(h => h.budget === 'Low').slice(0, 5);
      } else if (budget === 'High') {
        hotels = hotels.filter(h => h.budget === 'High').slice(0, 5);
      } else {
        // Mid budget - include Mid and some Low/High
        hotels = hotels.filter(h => h.budget === 'Mid' || h.budget === 'Low').slice(0, 5);
      }

      // If no hotels match budget, return all hotels
      if (hotels.length === 0) {
        hotels = data.elements
          .filter(el => el.tags && el.tags.name)
          .slice(0, 5)
          .map(el => {
            const coords = el.center || (el.lat && el.lon ? { lat: el.lat, lon: el.lon } : null);
            return {
              name: el.tags.name || 'Local Hotel',
              type: el.tags.tourism || 'hotel',
              budget: 'Mid',
              stars: el.tags['stars'] || '',
              address: el.tags['addr:full'] || el.tags['addr:street'] || destination,
              coordinates: coords ? { lat: parseFloat(coords.lat), lng: parseFloat(coords.lon) } : { lat, lng },
              website: el.tags.website || '',
              phone: el.tags.phone || '',
            };
          });
      }

      return hotels.length > 0 ? hotels : await getHotelsByCityName(destination, lat, lng, budget);
    }

    // If no results, try searching by city name
    return await getHotelsByCityName(destination, lat, lng, budget);
  } catch (error) {
    console.error('Error fetching hotels from Overpass:', error);
    // Try alternative method
    return await getHotelsByCityName(destination, lat, lng, budget);
  }
};

/**
 * Get hotels by searching city name in Nominatim
 */
const getHotelsByCityName = async (destination, lat, lng, budget) => {
  try {
    const cityName = destination.split(',')[0].trim();
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName + ' hotels accommodations')}&format=json&limit=8`,
      {
        headers: {
          'User-Agent': 'GoPlanner Travel App'
        }
      }
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return data
        .filter(item => item.display_name && (item.type?.includes('hotel') || item.type?.includes('accommodation')))
        .slice(0, 5)
        .map(item => ({
          name: item.display_name.split(',')[0] || 'Local Hotel',
          type: 'hotel',
          budget: budget || 'Mid',
          stars: '',
          address: item.display_name,
          coordinates: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
          website: '',
          phone: '',
        }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching hotels by city name:', error);
    return [];
  }
};

/**
 * Get places by city name (fallback for attractions)
 */
const getPlacesByCityName = async (destination, lat, lng) => {
  try {
    const cityName = destination.split(',')[0].trim();
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName + ' tourist attractions')}&format=json&limit=10`,
      {
        headers: {
          'User-Agent': 'GoPlanner Travel App'
        }
      }
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return data
        .filter(item => item.display_name)
        .map(item => ({
          name: item.display_name.split(',')[0] || 'Tourist Attraction',
          description: '',
          rating: 'N/A',
          coordinates: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
          address: item.display_name,
          categories: ['attraction'],
          type: 'attraction',
        }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching places by city name:', error);
    return [];
  }
};

/**
 * Get weather information (optional - requires OpenWeatherMap API key)
 */
export const getWeatherInfo = async (destination) => {
  try {
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';
    
    if (!OPENWEATHER_API_KEY) {
      return null; // Weather is optional
    }

    const cityName = destination.split(',')[0].trim();
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();

    if (data.cod === 200) {
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind?.speed || 0,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

/**
 * Get Wikipedia description for a place
 */
export const getPlaceDescription = async (placeName) => {
  try {
    const searchTerm = placeName.split(',')[0].trim();
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`
    );
    const data = await response.json();

    if (data.extract) {
      return {
        description: data.extract,
        thumbnail: data.thumbnail?.source || '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching Wikipedia:', error);
    return null;
  }
};

/**
 * Generate real itinerary with actual places
 */
export const generateRealItinerary = async (formData) => {
  const { destination, startDate, endDate, interests } = formData;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Get coordinates for destination
  const coords = await getCoordinates(destination);
  if (!coords) {
    console.warn('Could not get coordinates for destination');
    return null; // Return null to trigger fallback
  }

  // Fetch real data - use Promise.allSettled to continue even if some APIs fail
  const results = await Promise.allSettled([
    getTouristAttractions(coords.lat, coords.lng, destination),
    getCafesAndRestaurants(coords.lat, coords.lng, destination),
    getHotels(coords.lat, coords.lng, destination, formData.budget),
    getWeatherInfo(destination),
  ]);

  const attractions = results[0].status === 'fulfilled' ? results[0].value : [];
  const restaurants = results[1].status === 'fulfilled' ? results[1].value : [];
  const hotels = results[2].status === 'fulfilled' ? results[2].value : [];
  const weather = results[3].status === 'fulfilled' ? results[3].value : null;

  // Log what we got for debugging
  console.log('Fetched data:', { 
    attractions: attractions?.length || 0, 
    restaurants: restaurants?.length || 0, 
    hotels: hotels?.length || 0 
  });

  const itinerary = [];

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const dayNumber = i + 1;
    const dayActivities = [];

    if (i === 0) {
      // Day 1: Check-in + First attraction
      if (hotels.length > 0) {
        const selectedHotel = hotels[0];
        dayActivities.push({
          id: `${dayNumber}-1`,
          time: '12:00 PM',
          activity: `Check-in at ${selectedHotel.name}`,
          location: selectedHotel.address || destination,
          type: 'accommodation',
          hotelType: selectedHotel.type,
          stars: selectedHotel.stars,
          coordinates: selectedHotel.coordinates || coords, // Fallback to destination coords
          notes: `Complete check-in at ${selectedHotel.name}${selectedHotel.stars ? ` (${selectedHotel.stars} stars)` : ''}. ${selectedHotel.address ? `Address: ${selectedHotel.address}` : ''}`,
          order: 1,
        });
      } else {
        dayActivities.push({
          id: `${dayNumber}-1`,
          time: '12:00 PM',
          activity: 'Check-in at hotel',
          location: destination,
          type: 'accommodation',
          coordinates: coords, // Add coordinates even if no hotel found
          notes: 'Complete check-in and freshen up',
          order: 1,
        });
      }

      if (attractions.length > 0) {
        const firstAttraction = attractions[0];
        dayActivities.push({
          id: `${dayNumber}-2`,
          time: '2:00 PM',
          activity: firstAttraction.name,
          location: firstAttraction.address || destination,
          type: 'sightseeing',
          description: firstAttraction.description || '',
          rating: firstAttraction.rating,
          coordinates: firstAttraction.coordinates || coords, // Fallback to destination coords
          notes: `Visit ${firstAttraction.name}. ${firstAttraction.description ? firstAttraction.description.substring(0, 100) + '...' : ''}`,
          order: 2,
        });
      }

      if (restaurants.length > 0) {
        const dinnerPlace = restaurants[0];
        dayActivities.push({
          id: `${dayNumber}-3`,
          time: '7:00 PM',
          activity: `Dinner at ${dinnerPlace.name}`,
          location: dinnerPlace.address || destination,
          type: 'dining',
          restaurantType: dinnerPlace.type,
          rating: dinnerPlace.rating,
          coordinates: dinnerPlace.coordinates || coords, // Fallback to destination coords
          notes: `Enjoy ${dinnerPlace.type.toLowerCase()} cuisine at ${dinnerPlace.name}`,
          order: 3,
        });
      } else {
        dayActivities.push({
          id: `${dayNumber}-3`,
          time: '7:00 PM',
          activity: 'Dinner recommendation',
          location: destination,
          type: 'dining',
          coordinates: coords, // Add coordinates for fallback activities
          notes: 'Try local cuisine',
          order: 3,
        });
      }
    } else if (i === days - 1) {
      // Last day: Breakfast + Shopping/Last activity + Checkout
      if (restaurants.length > 1) {
        const breakfastPlace = restaurants[1] || restaurants[0];
        dayActivities.push({
          id: `${dayNumber}-1`,
          time: '9:00 AM',
          activity: `Breakfast at ${breakfastPlace.name}`,
          location: breakfastPlace.address || destination,
          type: 'dining',
          restaurantType: breakfastPlace.type,
          rating: breakfastPlace.rating,
          coordinates: breakfastPlace.coordinates,
          notes: `Start your day with breakfast at ${breakfastPlace.name}`,
          order: 1,
        });
      } else {
        dayActivities.push({
          id: `${dayNumber}-1`,
          time: '9:00 AM',
          activity: 'Breakfast',
          location: destination,
          type: 'dining',
          notes: '',
          order: 1,
        });
      }

      if (interests.includes('Shopping')) {
        dayActivities.push({
          id: `${dayNumber}-2`,
          time: '10:00 AM',
          activity: 'Shopping and souvenir hunting',
          location: destination,
          type: 'shopping',
          coordinates: coords, // Add coordinates
          notes: 'Buy souvenirs and local products',
          order: 2,
        });
      } else if (attractions.length > 1) {
        const lastAttraction = attractions[attractions.length - 1];
        dayActivities.push({
          id: `${dayNumber}-2`,
          time: '10:00 AM',
          activity: `Visit ${lastAttraction.name}`,
          location: lastAttraction.address || destination,
          type: 'sightseeing',
          description: lastAttraction.description || '',
          rating: lastAttraction.rating,
          coordinates: lastAttraction.coordinates || coords, // Fallback to destination coords
          notes: lastAttraction.description ? lastAttraction.description.substring(0, 100) + '...' : '',
          order: 2,
        });
      }

      // Checkout from hotel
      if (hotels.length > 0) {
        const selectedHotel = hotels[0];
        dayActivities.push({
          id: `${dayNumber}-3`,
          time: '12:00 PM',
          activity: `Checkout from ${selectedHotel.name}`,
          location: selectedHotel.address || destination,
          type: 'accommodation',
          hotelType: selectedHotel.type,
          coordinates: selectedHotel.coordinates || coords, // Fallback to destination coords
          notes: `Complete checkout from ${selectedHotel.name}`,
          order: 3,
        });
      } else {
        dayActivities.push({
          id: `${dayNumber}-3`,
          time: '12:00 PM',
          activity: 'Checkout',
          location: destination,
          type: 'accommodation',
          coordinates: coords, // Add coordinates
          notes: '',
          order: 3,
        });
      }
    } else {
      // Middle days: Full day activities
      if (restaurants.length > 0) {
        const breakfastIndex = Math.min(i, restaurants.length - 1);
        const breakfastPlace = restaurants[breakfastIndex] || restaurants[0];
        dayActivities.push({
          id: `${dayNumber}-1`,
          time: '9:00 AM',
          activity: `Breakfast at ${breakfastPlace.name}`,
          location: breakfastPlace.address || destination,
          type: 'dining',
          restaurantType: breakfastPlace.type,
          rating: breakfastPlace.rating,
          coordinates: breakfastPlace.coordinates,
          notes: `Morning meal at ${breakfastPlace.name}`,
          order: 1,
        });
      } else {
        dayActivities.push({
          id: `${dayNumber}-1`,
          time: '9:00 AM',
          activity: 'Breakfast',
          location: destination,
          type: 'dining',
          notes: '',
          order: 1,
        });
      }

      // Add attractions based on interests
      const attractionIndex = Math.min(i, attractions.length - 1);
      if (attractions[attractionIndex]) {
        const attraction = attractions[attractionIndex];
        dayActivities.push({
          id: `${dayNumber}-2`,
          time: '10:00 AM',
          activity: attraction.name,
          location: attraction.address || destination,
          type: 'sightseeing',
          description: attraction.description || '',
          rating: attraction.rating,
          coordinates: attraction.coordinates || coords, // Fallback to destination coords
          notes: attraction.description ? attraction.description.substring(0, 150) + '...' : '',
          order: 2,
        });
      }

      dayActivities.push({
        id: `${dayNumber}-3`,
        time: '2:00 PM',
        activity: 'Lunch break',
        location: destination,
        type: 'dining',
        coordinates: coords, // Add coordinates
        notes: 'Take a break and enjoy local food',
        order: 3,
      });

      // Afternoon activity
      if (interests.includes('Adventure')) {
        dayActivities.push({
          id: `${dayNumber}-4`,
          time: '4:00 PM',
          activity: 'Adventure activity',
          location: destination,
          type: 'adventure',
          coordinates: coords, // Add coordinates
          notes: 'Explore adventure activities in the area',
          order: 4,
        });
      } else if (attractions.length > attractionIndex + 1) {
        const afternoonAttraction = attractions[attractionIndex + 1];
        dayActivities.push({
          id: `${dayNumber}-4`,
          time: '4:00 PM',
          activity: afternoonAttraction.name,
          location: afternoonAttraction.address || destination,
          type: 'sightseeing',
          description: afternoonAttraction.description || '',
          rating: afternoonAttraction.rating,
          coordinates: afternoonAttraction.coordinates || coords, // Fallback to destination coords
          notes: afternoonAttraction.description ? afternoonAttraction.description.substring(0, 100) + '...' : '',
          order: 4,
        });
      }

      dayActivities.push({
        id: `${dayNumber}-5`,
        time: '6:00 PM',
        activity: 'Sunset point / Evening exploration',
        location: destination,
        type: 'sightseeing',
        coordinates: coords, // Add coordinates
        notes: 'Enjoy the sunset and evening views',
        order: 5,
      });
    }

    itinerary.push({
      dayNumber,
      date: currentDate.toISOString().split('T')[0],
      activities: dayActivities,
      weather: i === 0 ? weather : null, // Add weather for first day
    });
  }

  return {
    itinerary,
    destination,
    coordinates: coords,
    weather,
    totalDays: days,
  };
};

