import User from '../models/User.model.js';
import { generateToken } from '../config/jwt.js';
import crypto from 'crypto';
import { sendVerificationEmail } from '../services/emailService.js';

// Register new user - account will only be created after email verification
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists (verified or unverified)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.emailVerified) {
        return res.status(400).json({
          status: 'error',
          message: 'User with this email already exists'
        });
      } else {
        // User exists but not verified - update verification token and resend email
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        existingUser.emailVerificationToken = emailVerificationToken;
        existingUser.name = name; // Update name in case it changed
        existingUser.password = password; // Update password (will be hashed by pre-save hook)
        await existingUser.save();

        // Send verification email
        try {
          await sendVerificationEmail(existingUser.email, existingUser.name, emailVerificationToken);
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
        }

        return res.status(200).json({
          status: 'success',
          message: 'Verification email sent. Please check your email to verify your account.',
          data: {
            email: existingUser.email
          }
        });
      }
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create unverified user (account not fully created until verification)
    const user = await User.create({
      name,
      email,
      password,
      emailVerificationToken,
      emailVerified: false
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, emailVerificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Delete the unverified user if email fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send verification email. Please try again.'
      });
    }

    // Don't send token - user must verify email first
    res.status(201).json({
      status: 'success',
      message: 'Please check your email to verify your account. Your account will be created after verification.',
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
        message: 'Please verify your email before logging in. Check your inbox for the verification link.'
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

// Google OAuth - Create or login user
export const googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, photoURL } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        status: 'error',
        message: 'Google authentication data is required'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        if (photoURL) user.profilePicture = photoURL;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        emailVerified: true, // Google emails are verified
        profilePicture: photoURL || null,
        password: crypto.randomBytes(32).toString('hex') // Random password for Google users
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Google authentication successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          profilePicture: user.profilePicture
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Google authentication failed'
    });
  }
};

// Verify email - account is fully created and activated here
export const verifyEmail = async (req, res) => {
  try {
    const { token: verificationToken } = req.params;

    const user = await User.findOne({ emailVerificationToken: verificationToken }).select('+emailVerificationToken');
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification token'
      });
    }

    // Activate the account by marking email as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
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
      message: error.message || 'Email verification failed'
    });
  }
};

// Resend verification email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already verified'
      });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = emailVerificationToken;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, emailVerificationToken);
      res.status(200).json({
        status: 'success',
        message: 'Verification email sent. Please check your inbox.'
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send verification email. Please try again later.'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to resend verification email'
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
