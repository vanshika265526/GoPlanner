import React from 'react';

export const AppFooter = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#020617]/60 backdrop-blur-xl text-sm text-slate-600 dark:text-white/60 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col items-center justify-center gap-2 text-center">
        <p className="text-xs">
          © {new Date().getFullYear()} GoPlanner • All rights reserved.
        </p>
      </div>
    </footer>
  );
};
