import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { ThemeToggle } from './ThemeToggle';
import { PageHeader } from './PageHeader';

export const AuthScreen = ({ onBack, onLogin, onSignup, onVerifyOTP, isLoading, error, onDashboard }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [otp, setOtp] = useState('');
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
      onSignup?.(formData, () => {
        // After successful signup, show OTP screen
        setSignupEmail(formData.email);
        setShowOTP(true);
        setLocalError('');
      });
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!otp || otp.length !== 6) {
      setLocalError('Please enter a valid 6-digit OTP');
      return;
    }

    if (onVerifyOTP) {
      await onVerifyOTP(signupEmail, otp, () => {
        // On success, OTP screen will be hidden by parent
        setShowOTP(false);
        setOtp('');
        setSignupEmail('');
      }, (errorMsg) => {
        // On error, show error and stay on OTP screen
        setLocalError(errorMsg);
      });
    }
  };

  const handleResendOTP = async () => {
    setLocalError('');
    if (onSignup && signupEmail) {
      // Resend OTP by calling signup again
      try {
        await onSignup({ email: signupEmail, password: formData.password, name: formData.name }, () => {
          setLocalError('');
        });
      } catch (err) {
        setLocalError(err.message || 'Failed to resend OTP');
      }
    }
  };

  const handleBackToSignup = () => {
    setShowOTP(false);
    setOtp('');
    setSignupEmail('');
    setLocalError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowOTP(false);
    setOtp('');
    setSignupEmail('');
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  return (
    <div className="relative min-h-screen bg-background-light text-slate-900 dark:bg-slate-900 dark:text-white px-6 py-12 overflow-hidden transition-colors">
      <div className="backdrop-grid" aria-hidden />
      <div className="aurora-layer" aria-hidden />

      <PageHeader
        onBack={showOTP ? handleBackToSignup : onBack}
        onDashboard={onDashboard}
        title={showOTP ? 'Verify Email' : (isLogin ? 'Sign In' : 'Sign Up')}
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
              (error && (error.includes('OTP sent') || error.includes('sent to your email'))) 
                ? 'bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400'
            }`}>
              <p>{error || localError}</p>
            </div>
          )}

          {showOTP ? (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-slate-600 dark:text-white/70">
                  We've sent a 6-digit OTP to <span className="font-semibold text-slate-900 dark:text-white">{signupEmail}</span>
                </p>
                <p className="text-sm text-slate-500 dark:text-white/50">
                  Please enter the OTP to verify your email and create your account.
                </p>
              </div>

              <Input
                label="Enter OTP"
                placeholder="000000"
                icon="vpn_key"
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                }}
                maxLength={6}
                required
                className="text-center text-2xl tracking-widest font-bold"
              />

              <Button type="submit" fullWidth className="h-16 text-lg" icon="check_circle" isLoading={isLoading} disabled={isLoading}>
                Verify OTP
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm text-primary hover:text-primary-dark font-medium disabled:opacity-50"
                >
                  Didn't receive OTP? Resend
                </button>
              </div>
            </form>
          ) : (
            <>
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
              showPasswordToggle={true}
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
                showPasswordToggle={true}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

