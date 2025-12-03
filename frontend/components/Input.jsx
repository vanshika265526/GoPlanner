import React from 'react';

export const Input = ({ label, icon, className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          className="block w-full rounded-2xl border border-gray-200/60 dark:border-white/15 bg-white/90 dark:bg-white/5 py-4 pl-4 pr-12 text-base text-gray-900 dark:text-white shadow-lg shadow-black/5 focus:border-primary focus:ring-2 focus:ring-primary/60 transition-all"
          {...props}
        />
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="material-symbols-outlined text-gray-400">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
};