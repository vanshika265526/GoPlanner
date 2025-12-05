/**
 * OpenRouteService API integration for place autocomplete
 */

const API_BASE_URL = 'https://api.openrouteservice.org/geocode/autocomplete';

/**
 * Search for places using OpenRouteService Geocoding API
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results (default: 8)
 * @returns {Promise<Array>} Array of place suggestions
 */
export const searchPlaces = async (query, limit = 8) => {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenRouteService API key not found. Using fallback suggestions.');
      return [];
    }

    if (!query || query.trim().length < 2) {
      return [];
    }

    // OpenRouteService Geocoding Autocomplete API
    const params = new URLSearchParams({
      api_key: apiKey,
      text: query,
      size: limit.toString(),
      layers: 'locality,venue,address',
      'boundary.country': 'IN,US,GB,FR,IT,ES,DE,JP,TH,AU,SG,AE,GR,TR,EG,MA,PT,CZ,AT,NO,IS,IE',
      sources: 'geonames,openstreetmap,whosonfirst'
    });

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`OpenRouteService API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return [];
    }

    // Format the response for dropdown
    const suggestions = data.features.map((feature) => {
      const properties = feature.properties;
      const geometry = feature.geometry;
      
      // Build display name from OpenRouteService response
      // Format: "Name, Locality, Country" or "Name, Country"
      const parts = [];
      
      if (properties.name) {
        parts.push(properties.name);
      }
      
      // Add locality if different from name
      if (properties.locality && properties.locality !== properties.name) {
        parts.push(properties.locality);
      }
      
      // Add region/state if available
      if (properties.region && properties.region !== properties.locality && properties.region !== properties.name) {
        parts.push(properties.region);
      }
      
      // Add country
      if (properties.country) {
        parts.push(properties.country);
      }
      
      const displayName = parts.join(', ') || properties.name || 'Unknown location';

      return {
        id: feature.id || `${Date.now()}-${Math.random()}`,
        name: properties.name || displayName,
        fullName: displayName,
        coordinates: {
          lat: geometry.coordinates[1],
          lng: geometry.coordinates[0]
        },
        country: properties.country || '',
        locality: properties.locality || '',
        region: properties.region || properties.county || '',
        type: properties.layer || 'place'
      };
    });

    return suggestions;
  } catch (error) {
    console.error('Error fetching places from OpenRouteService:', error);
    // Return empty array on error - fallback to local suggestions
    return [];
  }
};

/**
 * Get place details by coordinates (reverse geocoding)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object|null>} Place details
 */
export const getPlaceByCoordinates = async (lat, lng) => {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;
    
    if (!apiKey) {
      return null;
    }

    const response = await fetch(
      `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lat=${lat}&point.lon=${lng}&size=1`
    );

    if (!response.ok) {
      throw new Error(`OpenRouteService API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return null;
    }

    const feature = data.features[0];
    const properties = feature.properties;

    return {
      name: properties.name || '',
      country: properties.country || '',
      locality: properties.locality || '',
      coordinates: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      }
    };
  } catch (error) {
    console.error('Error fetching place by coordinates:', error);
    return null;
  }
};

