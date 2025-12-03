import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { ThemeToggle } from './ThemeToggle';
import { PageHeader } from './PageHeader';

export const AuthScreen = ({ onBack, onLogin, onSignup, onGoogleSignIn, isLoading, error, onDashboard }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    
    // Validation
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (!isLogin && formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (isLogin) {
      onLogin?.(formData);
    } else {
      onSignup?.(formData);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  return (
    <div className="relative min-h-screen bg-background-light text-slate-900 dark:bg-[#020617] dark:text-white px-6 py-12 overflow-hidden transition-colors">
      <div className="backdrop-grid" aria-hidden />
      <div className="aurora-layer" aria-hidden />

      <PageHeader
        onBack={onBack}
        onDashboard={onDashboard}
        title={isLogin ? 'Sign In' : 'Sign Up'}
        subtitle="Account"
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">

        <div className="glass-panel rounded-[40px] p-10 space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center rounded-3xl bg-primary/10 text-primary p-4 pulse-ring shadow-lg shadow-primary/20 dark:shadow-primary/30">
                <svg
                  viewBox="0 0 32 32"
                  className="w-12 h-12 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="16" cy="16" r="10" />
                  <circle cx="16" cy="16" r="4.2" />
                  <path d="M16 4.5v2.2M16 25.3v-2.2" />
                  <path d="M12.2 19.8l2.2-6.2 6.2-2.2-2.2 6.2-6.2 2.2z" />
                  <path d="M8.5 10.5a7.5 7.5 0 019-3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white">
                {isLogin ? 'Welcome back' : 'Start planning'}
              </h1>
              <p className="text-slate-600 dark:text-white/70 mt-2">
                {isLogin
                  ? 'Sign in to access your saved trip plans'
                  : 'Create an account to save and sync your itineraries'}
              </p>
            </div>
          </div>

          {(error || localError) && (
            <div className={`rounded-2xl p-4 text-sm space-y-2 ${
              (error && error.includes('Verification email sent')) 
                ? 'bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400'
            }`}>
              <p>{error || localError}</p>
              {!isLogin && (error?.includes('Verification email sent') || error?.includes('verification')) && (
                <p className="text-xs opacity-80">
                  Please check your inbox and click the verification link. You'll be redirected to the home page shortly.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <Input
                label="Full name"
                placeholder="Enter your name"
                icon="person"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required={!isLogin}
              />
            )}

            <Input
              label="Email"
              placeholder="your.email@example.com"
              icon="mail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              icon="lock"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            {!isLogin && (
              <Input
                label="Confirm password"
                placeholder="Re-enter your password"
                icon="lock"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required={!isLogin}
              />
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 dark:text-white/70 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 dark:border-white/20 text-primary focus:ring-primary" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const email = formData.email;
                    if (!email) {
                      setLocalError('Please enter your email first');
                      return;
                    }
                    // Handle password reset - you can add this functionality
                    alert('Password reset feature - to be implemented');
                  }}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" fullWidth className="h-16 text-lg" icon={isLogin ? 'login' : 'person_add'} isLoading={isLoading} disabled={isLoading}>
              {isLogin ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/80 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 dark:bg-[#020617]/60 text-slate-500 dark:text-white/60">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                if (onGoogleSignIn) {
                  try {
                    await onGoogleSignIn();
                  } catch (err) {
                    console.error('Google sign-in error:', err);
                  }
                } else {
                  console.error('onGoogleSignIn handler not provided');
                }
              }}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 dark:border-white/20 bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 py-3 px-4 text-sm font-medium text-slate-700 dark:text-white/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
            
          </div>

          <div className="text-center text-sm text-slate-600 dark:text-white/70">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:text-primary-dark font-semibold"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:text-primary-dark font-semibold"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

