import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  icon,
  isLoading,
  className = '',
  ...props
}) => {
  const baseStyles = "relative flex items-center justify-center overflow-hidden rounded-full px-8 h-14 text-base font-bold leading-normal tracking-[0.015em] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30",
    secondary: "bg-white/90 text-slate-900 hover:bg-slate-50 hover:shadow-lg shadow-md shadow-slate-300/60 border border-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:border-white/20",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5"
  };

  const widthClass = fullWidth ? "w-full" : "min-w-[84px] max-w-[480px]";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin material-symbols-outlined text-xl">progress_activity</span>
      ) : (
        <>
          {icon && <span className="material-symbols-outlined mr-2 text-xl">{icon}</span>}
          <span className="truncate">{children}</span>
        </>
      )}
    </button>
  );
};