import Trip from '../models/Trip.model.js';

// Create new trip
export const createTrip = async (req, res) => {
  try {
    // Ensure user is always set from authenticated user (prevent user field manipulation)
    const { user, budget, ...restBody } = req.body;
    
    // Validate and normalize budget value
    const validBudgetValues = [
      'Under $500', 
      '$500 - $1,000', 
      '$1,000 - $2,500', 
      '$2,500 - $5,000', 
      '$5,000 - $10,000', 
      'Above $10,000',
      'Low', 
      'Mid', 
      'High'
    ];
    
    // Normalize budget - trim and check if valid
    let normalizedBudget = budget ? budget.trim() : '$1,000 - $2,500';
    
    // Debug: Log the received budget value
    console.log('Received budget:', JSON.stringify(budget));
    console.log('Normalized budget:', JSON.stringify(normalizedBudget));
    console.log('Is valid?', validBudgetValues.includes(normalizedBudget));
    
    // If budget doesn't match exactly, try to find closest match or use default
    if (!validBudgetValues.includes(normalizedBudget)) {
      // Try to map old values or use default
      if (normalizedBudget.toLowerCase() === 'low') {
        normalizedBudget = 'Under $500';
      } else if (normalizedBudget.toLowerCase() === 'mid') {
        normalizedBudget = '$1,000 - $2,500';
      } else if (normalizedBudget.toLowerCase() === 'high') {
        normalizedBudget = '$5,000 - $10,000';
      } else {
        // Use default if no match found
        normalizedBudget = '$1,000 - $2,500';
      }
    }
    
    const tripData = {
      ...restBody,
      budget: normalizedBudget,
      user: req.user._id // Always use authenticated user's ID, ignore any user field from request
    };

    const trip = await Trip.create(tripData);

    res.status(201).json({
      status: 'success',
      message: 'Trip created successfully',
      data: { trip }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create trip'
    });
  }
};

// Get all trips for user
export const getMyTrips = async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const trips = await Trip.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Trip.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: trips.length,
      total,
      data: { trips }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get trips'
    });
  }
};

// Get single trip
export const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!trip) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { trip }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get trip'
    });
  }
};

// Update trip
export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!trip) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Trip updated successfully',
      data: { trip }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update trip'
    });
  }
};

// Delete trip
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!trip) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to delete trip'
    });
  }
};

// Get public trips
export const getPublicTrips = async (req, res) => {
  try {
    const { destination, limit = 20, page = 1 } = req.query;
    const query = { isPublic: true };
    
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const trips = await Trip.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Trip.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: trips.length,
      total,
      data: { trips }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get public trips'
    });
  }
};

