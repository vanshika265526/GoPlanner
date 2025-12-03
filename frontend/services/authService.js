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
  // Sign up new user with email/password
  async signup(email, password, name) {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });

      if (response.status === 'success' && response.data) {
        // Store token and user data
        localStorage.setItem(STORAGE_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        
        return {
          user: response.data.user,
          token: response.data.token,
          emailVerificationToken: response.data.emailVerificationToken
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

  // Sign in with Google
  async signInWithGoogle() {
    try {
      // Load Google Identity Services
      return new Promise((resolve, reject) => {
        // Check if Google script is loaded
        if (typeof google === 'undefined') {
          // Load Google Identity Services script
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = () => {
            initializeGoogleSignIn(resolve, reject);
          };
          script.onerror = () => {
            reject(new Error('Failed to load Google Sign-In script'));
          };
          document.head.appendChild(script);
        } else {
          initializeGoogleSignIn(resolve, reject);
        }
      });
    } catch (error) {
      throw new Error(error.message || 'Google sign-in failed');
    }
  },

  // Verify email with token
  async verifyEmail(token) {
    try {
      const response = await apiRequest(`/auth/verify-email/${token}`, {
        method: 'GET',
      });

      if (response.status === 'success') {
        // Update user's emailVerified status
        const user = this.getCurrentUser();
        if (user) {
          user.emailVerified = true;
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
        return { success: true, message: 'Email verified successfully!' };
      }

      throw new Error(response.message || 'Email verification failed.');
    } catch (error) {
      throw new Error(error.message || 'Email verification failed.');
    }
  },

  // Resend email verification
  async resendVerificationEmail() {
    try {
      const user = this.getCurrentUser();
      if (!user || !user.email) {
        throw new Error('No user is currently signed in.');
      }

      const response = await apiRequest('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email: user.email }),
      });

      if (response.status === 'success') {
        return { success: true, message: 'Verification email sent. Please check your inbox.' };
      }

      throw new Error(response.message || 'Failed to send verification email.');
    } catch (error) {
      throw new Error(error.message || 'Failed to send verification email.');
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

// Initialize Google Sign-In
function initializeGoogleSignIn(clientId, resolve, reject) {
  google.accounts.id.initialize({
    client_id: clientId,
    callback: async (response) => {
      try {
        // Decode the credential JWT
        const credential = response.credential;
        
        // Decode JWT token (simple decode, not verification - backend will verify)
        const payload = JSON.parse(atob(credential.split('.')[1]));
        
        // Send to backend
        const apiResponse = await apiRequest('/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            googleId: payload.sub,
            photoURL: payload.picture
          }),
        });

        if (apiResponse.status === 'success' && apiResponse.data) {
          // Store token and user data
          localStorage.setItem(STORAGE_KEY, apiResponse.data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(apiResponse.data.user));
          
          resolve({
            user: apiResponse.data.user,
            token: apiResponse.data.token
          });
        } else {
          reject(new Error(apiResponse.message || 'Google authentication failed'));
        }
      } catch (error) {
        reject(new Error(error.message || 'Google sign-in failed'));
      }
    },
  });

  // Use One Tap flow - if not shown, user can click button
  google.accounts.id.prompt((notification) => {
    // One Tap may not always show, that's okay - button will work
    if (notification.isNotDisplayed() || notification.isSkippedMoment() || notification.isDismissedMoment()) {
      // One Tap not shown - this is fine, the button will handle it
      console.log('One Tap not displayed, button will be used');
    }
  });
}

// Alternative: Sign in with Google button
export const renderGoogleSignInButton = (elementId) => {
  if (typeof google === 'undefined') {
    console.error('Google Identity Services not loaded');
    return;
  }

  google.accounts.id.renderButton(
    document.getElementById(elementId),
    {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      width: '100%'
    }
  );
};
