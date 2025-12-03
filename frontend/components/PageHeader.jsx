import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export const PageHeader = ({ onBack, onDashboard, showBack = true, title, subtitle }) => {
  const { user, isAuthenticated } = useAuth();
  
  const userName = user?.name || user?.displayName || (user?.email ? user.email.split('@')[0] : 'Guest');

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Back Button */}
          <div className="flex items-center gap-4">
            {showBack && onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center justify-center size-10 rounded-full border border-slate-200/80 dark:border-white/20 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-slate-700 hover:text-primary dark:text-white/70 dark:hover:text-white transition-colors"
                aria-label="Back"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
            )}
            {title && (
              <div>
                {subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{subtitle}</p>
                )}
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
              </div>
            )}
          </div>

          {/* Right: Welcome/Dashboard Button & Theme Toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated && onDashboard && (
              <button
                onClick={onDashboard}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/80 dark:border-white/20 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-slate-700 hover:text-primary dark:text-white/70 dark:hover:text-white transition-colors text-sm font-medium"
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                <span>Welcome, {userName}</span>
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

