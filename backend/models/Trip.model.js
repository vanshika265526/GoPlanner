import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['sightseeing', 'dining', 'accommodation', 'adventure', 'transport'],
    default: 'sightseeing'
  },
  location: {
    type: String
  },
  notes: {
    type: String
  },
  coordinates: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  rating: {
    type: String
  },
  order: {
    type: Number,
    default: 1
  }
}, { _id: false });

const daySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  activities: [activitySchema],
  weather: {
    type: mongoose.Schema.Types.Mixed
  }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  budget: {
    type: String,
    enum: ['Under $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000 - $10,000', 'Above $10,000', 'Low', 'Mid', 'High'], // Keep old values for backward compatibility
    default: '$1,000 - $2,500'
  },
  interests: [{
    type: String
  }],
  itinerary: [daySchema],
  coordinates: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  status: {
    type: String,
    enum: ['draft', 'planned', 'completed', 'cancelled'],
    default: 'draft'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
tripSchema.index({ user: 1, createdAt: -1 });
tripSchema.index({ destination: 'text' });
tripSchema.index({ status: 1 });

// Middleware to ensure user field is always set (safety check)
tripSchema.pre('save', function(next) {
  if (!this.user) {
    return next(new Error('Trip must be associated with a user'));
  }
  
  // Normalize budget value to ensure it matches enum
  if (this.budget) {
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
    
    const normalizedBudget = this.budget.trim();
    
    if (!validBudgetValues.includes(normalizedBudget)) {
      // Map old values or use default
      if (normalizedBudget.toLowerCase() === 'low') {
        this.budget = 'Under $500';
      } else if (normalizedBudget.toLowerCase() === 'mid') {
        this.budget = '$1,000 - $2,500';
      } else if (normalizedBudget.toLowerCase() === 'high') {
        this.budget = '$5,000 - $10,000';
      } else {
        this.budget = '$1,000 - $2,500'; // Default
      }
    } else {
      this.budget = normalizedBudget;
    }
  }
  
  next();
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;

