import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';
import { AppFooter } from './AppFooter';
// Removed Firebase authService import - using backend API now

export const UserDashboard = ({ onBack, onCreateTrip, onSavedPlans }) => {
  const { user, logout, loading, isAuthenticated, refreshAuth } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Refresh auth on mount if user is missing but token exists
  useEffect(() => {
    if (!loading && !user && localStorage.getItem('goplanner_token')) {
      console.log('UserDashboard: Token exists but user is null, refreshing auth...');
      refreshAuth();
    }
  }, [loading, user, refreshAuth]);

  // Debug logging
  console.log('UserDashboard render:', { 
    loading, 
    user: user ? { id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified } : null,
    isAuthenticated,
    hasToken: !!localStorage.getItem('goplanner_token'),
    hasUserInStorage: !!localStorage.getItem('goplanner_user')
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      if (onBack) onBack();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('goplanner_token');
      const user = JSON.parse(localStorage.getItem('goplanner_user') || '{}');
      
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ email: user.email })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Verification email sent! Please check your inbox.');
      } else {
        alert('Failed to send verification email: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to send verification email: ' + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeletingAccount(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('goplanner_token');
      
      const response = await fetch(`${API_URL}/auth/account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Logout and redirect to home
        await logout();
        if (onBack) onBack();
        alert('Your account and all associated data have been deleted successfully.');
      } else {
        alert('Failed to delete account: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to delete account: ' + error.message);
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background-light text-slate-900 dark:bg-[#020617] dark:text-white transition-colors flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-slate-600 dark:text-white/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to home or show message
  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background-light text-slate-900 dark:bg-[#020617] dark:text-white transition-colors flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-yellow-600 dark:text-yellow-400">warning</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Not Authenticated</h2>
          <p className="text-slate-600 dark:text-white/70">Please sign in to access your dashboard.</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background-light text-slate-900 dark:bg-[#020617] dark:text-white transition-colors">
      <div className="backdrop-grid" aria-hidden />
      <div className="aurora-layer" aria-hidden />

      <div className="relative z-10 flex-1 flex flex-col">
        <header className="px-6 sm:px-10 pt-8 pb-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center size-10 rounded-full border border-slate-200/80 dark:border-white/20 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-slate-700 hover:text-primary dark:text-white/70 dark:hover:text-white transition-colors"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500 dark:text-white/60">
                Dashboard
              </span>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 sm:px-10 pb-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Welcome Section */}
            <section className="glass-panel rounded-[40px] p-10 space-y-6">
              <div className="flex items-center gap-4">
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
                <div>
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white">
                    Welcome back, {user.name || 'Traveler'}!
                  </h1>
                  <p className="text-slate-600 dark:text-white/70 mt-2">
                    Manage your trip plans and preferences
                  </p>
                </div>
              </div>
            </section>

            {/* Account Details */}
            <section className="glass-panel rounded-[32px] p-8 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-white/50 mb-4">
                  Account Information
                </p>
                <div className="space-y-4">
                  <div className="rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/50 mb-1">
                      Full Name
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {user.name || 'Not set'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/50 mb-1">
                      Email Address
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/50 mb-1">
                      Email Verification
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {user.emailVerified ? (
                          <>
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                              Verified
                            </p>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-yellow-500">warning</span>
                            <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                              Not Verified
                            </p>
                          </>
                        )}
                      </div>
                      {!user.emailVerified && (
                        <button
                          onClick={handleResendVerification}
                          className="text-xs uppercase tracking-[0.3em] text-primary hover:text-primary-dark"
                        >
                          Resend
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="glass-panel rounded-[32px] p-8 space-y-6">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-white/50">
                Quick Actions
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={onCreateTrip || onBack}
                  className="rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-6 text-left hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-2xl text-primary">add_circle</span>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      Create New Trip
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-white/70">
                    Start planning your next adventure
                  </p>
                </button>
                <button
                  onClick={() => {
                    console.log('UserDashboard: Saved Plans button clicked');
                    onSavedPlans?.();
                  }}
                  className="rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-6 text-left hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-2xl text-primary">bookmark</span>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      Saved Plans
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-white/70">
                    View your saved trip plans
                  </p>
                </button>
              </div>
            </section>

            {/* Account Actions Section */}
            <section className="glass-panel rounded-[32px] p-6">
              {showDeleteConfirm ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400 text-center mb-4">
                      Are you sure you want to delete your account? This action cannot be undone and will delete all your saved plans as well.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="secondary"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeletingAccount}
                        className="h-10 px-6"
                      >
                        Cancel
                      </Button>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                        className="h-10 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isDeletingAccount ? (
                          <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : (
                          <>
                            <span className="material-symbols-outlined">delete_forever</span>
                            <span>Delete Account</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 justify-between items-center">
                  <Button
                    variant="secondary"
                    onClick={handleLogout}
                    isLoading={isLoggingOut}
                    disabled={isLoggingOut || isDeletingAccount}
                    className="h-14 px-8 flex-1"
                    icon="logout"
                  >
                    Sign Out
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={handleDeleteAccount}
                    disabled={isLoggingOut || isDeletingAccount}
                    className="h-14 px-8 flex-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                    icon="delete_forever"
                  >
                    Delete Account
                  </Button>
                </div>
              )}
            </section>
          </div>
        </main>

        <AppFooter />
      </div>
    </div>
  );
};

