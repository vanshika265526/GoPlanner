import React, { useEffect, useState } from 'react';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem('goplanner-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  window.localStorage.setItem('goplanner-theme', theme);
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center h-9 w-16 rounded-full bg-white/80 border border-sky-400/70 dark:bg-white/10 dark:border-white/20 backdrop-blur-md text-xs font-medium text-slate-700 dark:text-white/80 hover:bg-white hover:border-sky-500 dark:hover:bg-white/15 transition-colors"
      aria-label="Toggle dark and light mode"
    >
      <span
        className={`absolute h-7 w-7 rounded-full bg-primary/90 shadow-lg shadow-primary/40 transform transition-transform ${
          isDark ? 'translate-x-3.5' : '-translate-x-3.5'
        }`}
      />
      <span className="relative flex w-full items-center justify-between px-2">
        <span className={`transition-opacity ${isDark ? 'opacity-40' : 'opacity-100'}`}>☀️</span>
        <span className={`transition-opacity ${isDark ? 'opacity-100' : 'opacity-40'}`}>🌙</span>
      </span>
    </button>
  );
};
