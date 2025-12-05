import User from '../models/User.model.js';
import { generateToken } from '../config/jwt.js';
import crypto from 'crypto';
import { sendOTPEmail } from '../services/emailService.js';

// Register new user - send OTP for verification
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email }).select('+otp +otpExpire');
    if (existingUser && existingUser.emailVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser && !existingUser.emailVerified) {
      // User exists but not verified - update OTP and resend
      existingUser.otp = otp;
      existingUser.otpExpire = otpExpire;
      existingUser.name = name;
      existingUser.password = password; // Update password (will be hashed by pre-save hook)
      await existingUser.save();

      // Send OTP email
      try {
        await sendOTPEmail(existingUser.email, existingUser.name, otp);
      } catch (emailError) {
        console.error('Failed to send OTP email:', emailError);
        return res.status(500).json({
          status: 'error',
          message: 'Failed to send OTP email. Please try again.'
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'OTP sent to your email. Please check your inbox.',
        data: {
          email: existingUser.email
        }
      });
    }

    // Create unverified user (account not fully created until OTP verification)
    const user = await User.create({
      name,
      email,
      password,
      otp: otp,
      otpExpire: otpExpire,
      emailVerified: false
    });

    // Send OTP email
    try {
      await sendOTPEmail(user.email, user.name, otp);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Delete the unverified user if email fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    // Don't send token - user must verify OTP first
    res.status(201).json({
      status: 'success',
      message: 'OTP sent to your email. Please check your inbox.',
      data: {
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Registration failed'
    });
  }
};

// Verify OTP and create account - user is logged in
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and OTP are required'
      });
    }

    // Find user with email and OTP
    const user = await User.findOne({ email }).select('+otp +otpExpire');
    
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email or OTP'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already verified. Please login.'
      });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid OTP'
      });
    }

    // Check if OTP is expired
    if (user.otpExpire && user.otpExpire < new Date()) {
      return res.status(400).json({
        status: 'error',
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    // Verify the account
    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    // Generate JWT token for automatic login after verification
    const jwtToken = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully. Your account has been created.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: true
        },
        token: jwtToken
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'OTP verification failed'
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        status: 'error',
        message: 'Please verify your email before logging in. Check your inbox for the OTP code.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Login failed'
    });
  }
};


// Resend OTP
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email }).select('+otp +otpExpire');
    
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'User not found. Please sign up again.'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already verified. Please login.'
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(user.email, user.name, otp);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'OTP sent to your email. Please check your inbox.'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to resend OTP'
    });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          preferences: user.preferences,
          profilePicture: user.profilePicture
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get user'
    });
  }
};

// Delete user account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all trips associated with this user
    const Trip = (await import('../models/Trip.model.js')).default;
    await Trip.deleteMany({ user: userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      status: 'success',
      message: 'Account and all associated data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to delete account'
    });
  }
};
