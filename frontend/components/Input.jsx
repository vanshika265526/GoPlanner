import React, { useState } from 'react';

export const Input = ({ label, icon, className = '', showPasswordToggle = false, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = props.type === 'password';

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          className={`block w-full rounded-2xl border border-gray-200/60 dark:border-white/15 bg-white/90 dark:bg-white/5 py-4 pl-4 text-base text-gray-900 dark:text-white shadow-lg shadow-black/5 focus:border-primary focus:ring-2 focus:ring-primary/60 transition-all ${
            isPasswordField && showPasswordToggle ? 'pr-20' : icon ? 'pr-12' : 'pr-4'
          }`}
          {...props}
          type={isPasswordField && showPassword ? 'text' : props.type}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
          {isPasswordField && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none z-10"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          )}
          {icon && (
            <span className="material-symbols-outlined text-gray-400 pointer-events-none">{icon}</span>
          )}
        </div>
      </div>
    </div>
  );
};