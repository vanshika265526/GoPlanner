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
    enum: ['Low', 'Mid', 'High'],
    default: 'Mid'
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

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;

