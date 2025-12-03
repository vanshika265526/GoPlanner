import { generateRealItinerary } from '../services/placesService.js';

// Generate itinerary based on form data
export const generateItinerary = async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, interests } = req.body;

    // Validate required fields
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Destination, start date, and end date are required'
      });
    }

    const formData = {
      destination,
      startDate,
      endDate,
      budget: budget || 'Mid',
      interests: interests || []
    };

    // Generate itinerary using backend service
    console.log('Generating itinerary for:', formData);
    const itineraryData = await generateRealItinerary(formData);
    console.log('Generated itinerary data:', itineraryData ? 'Success' : 'Failed');

    if (!itineraryData || !itineraryData.itinerary || itineraryData.itinerary.length === 0) {
      console.error('Itinerary generation failed or returned empty');
      return res.status(500).json({
        status: 'error',
        message: 'Failed to generate itinerary. Please try again.'
      });
    }

    // Log some stats for debugging
    const totalActivities = itineraryData.itinerary.reduce((sum, day) => sum + day.activities.length, 0);
    const activitiesWithCoords = itineraryData.itinerary.reduce((sum, day) => 
      sum + day.activities.filter(a => a.coordinates && a.coordinates.lat && a.coordinates.lng).length, 0
    );
    console.log(`Itinerary stats: ${itineraryData.itinerary.length} days, ${totalActivities} activities, ${activitiesWithCoords} with coordinates`);

    res.status(200).json({
      status: 'success',
      message: 'Itinerary generated successfully',
      data: itineraryData
    });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate itinerary'
    });
  }
};

