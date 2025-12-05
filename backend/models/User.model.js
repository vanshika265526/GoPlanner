import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpire: {
    type: Date,
    select: false
  },
  otp: {
    type: String,
    select: false
  },
  otpExpire: {
    type: Date,
    select: false
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpire: {
    type: Date,
    select: false
  },
  profilePicture: {
    type: String,
    default: null
  },
  preferences: {
    currency: {
      type: String,
      default: 'USD'
    },
    language: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Cascade delete: Delete all trips when user is deleted
// Note: This is a safety measure. The deleteAccount controller explicitly deletes trips first.
userSchema.pre('findOneAndDelete', async function(next) {
  try {
    const user = await this.model.findOne(this.getQuery());
    if (user) {
      // Use require for dynamic import in middleware
      const TripModule = await import('./Trip.model.js');
      const Trip = TripModule.default;
      await Trip.deleteMany({ user: user._id });
    }
    next();
  } catch (error) {
    // If Trip model is not available, continue (trips will be deleted explicitly in controller)
    next();
  }
});

userSchema.pre('findByIdAndDelete', async function(next) {
  try {
    const userId = this.getQuery()._id;
    if (userId) {
      const TripModule = await import('./Trip.model.js');
      const Trip = TripModule.default;
      await Trip.deleteMany({ user: userId });
    }
    next();
  } catch (error) {
    // If Trip model is not available, continue (trips will be deleted explicitly in controller)
    next();
  }
});

const User = mongoose.model('User', userSchema);

export default User;

