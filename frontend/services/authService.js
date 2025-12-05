// Backend API Authentication Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STORAGE_KEY = 'goplanner_token';
const USER_KEY = 'goplanner_user';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem(STORAGE_KEY);
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const authService = {
  // Sign up new user with email/password - sends OTP
  async signup(email, password, name) {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });

      if (response.status === 'success') {
        // Don't store token or user - account not created yet
        // User needs to verify OTP first
        return {
          success: true,
          message: response.message || 'OTP sent to your email. Please check your inbox.',
          email: response.data?.email
        };
      }

      throw new Error(response.message || 'Signup failed');
    } catch (error) {
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.message.includes('already exists')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.message.includes('password')) {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Verify OTP - account is created here and user is logged in
  async verifyOTP(email, otp) {
    try {
      const response = await apiRequest('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });

      if (response.status === 'success' && response.data) {
        // Account is now created - store token and user data
        localStorage.setItem(STORAGE_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        
        return { 
          success: true, 
          message: response.message || 'Email verified successfully! Your account has been created.',
          user: response.data.user,
          token: response.data.token
        };
      }

      throw new Error(response.message || 'OTP verification failed.');
    } catch (error) {
      throw new Error(error.message || 'OTP verification failed.');
    }
  },

  // Verify email with token - account is created here and user is logged in
  async verifyEmail(token) {
    try {
      const response = await apiRequest(`/auth/verify-email/${token}`, {
        method: 'GET',
      });

      if (response.status === 'success' && response.data) {
        // Account is now created - store token and user data
        localStorage.setItem(STORAGE_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        
        return { 
          success: true, 
          message: response.message || 'Email verified successfully! Your account has been created.',
          user: response.data.user,
          token: response.data.token
        };
      }

      throw new Error(response.message || 'Email verification failed.');
    } catch (error) {
      throw new Error(error.message || 'Email verification failed.');
    }
  },

  // Resend OTP (alias for resendVerification)
  async resendVerification(email) {
    return this.resendOTP(email);
  },

  // Sign in existing user
  async login(email, password) {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 'success' && response.data) {
        // Store token and user data
        localStorage.setItem(STORAGE_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        
        return {
          user: response.data.user,
          token: response.data.token
        };
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message.includes('Invalid email or password')) {
        errorMessage = 'Invalid email or password. Please check and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Sign out
  async logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(USER_KEY);
      return true;
    } catch (error) {
      throw new Error(error.message || 'Logout failed');
    }
  },


  // Resend OTP
  async resendOTP(email) {
    try {
      const response = await apiRequest('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (response.status === 'success') {
        return {
          success: true,
          message: response.message || 'OTP sent to your email. Please check your inbox.'
        };
      }

      throw new Error(response.message || 'Failed to resend OTP.');
    } catch (error) {
      throw new Error(error.message || 'Failed to resend OTP.');
    }
  },

  // Get current user
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Get auth token
  getToken() {
    return localStorage.getItem(STORAGE_KEY);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken() && !!this.getCurrentUser();
  },

  // Verify current token with backend
  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      const response = await apiRequest('/auth/me');
      if (response.status === 'success' && response.data) {
        // Update stored user data
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        return response.data.user;
      }
      return null;
    } catch {
      // Token invalid, clear storage
      this.logout();
      return null;
    }
  },
};

