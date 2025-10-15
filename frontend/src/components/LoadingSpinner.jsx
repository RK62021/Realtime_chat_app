import React from 'react';

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary', 
  text = 'Loading...',
  showText = true,
  className = ''
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  const variantClasses = {
    primary: 'from-indigo-500 to-fuchsia-500',
    success: 'from-emerald-500 to-green-500',
    error: 'from-rose-500 to-red-500',
    warning: 'from-yellow-500 to-orange-500'
  };

  const iconColors = {
    primary: 'text-white',
    success: 'text-emerald-400',
    error: 'text-rose-400',
    warning: 'text-yellow-400'
  };

  const ringColors = {
    primary: 'border-t-indigo-400',
    success: 'border-t-emerald-400',
    error: 'border-t-rose-400',
    warning: 'border-t-yellow-400'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative mb-4">
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${variantClasses[variant]} p-0.5`}>
          <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
            <svg className={`${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-8 w-8' : 'h-12 w-12'} ${iconColors[variant]} animate-pulse`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
        {/* Spinning ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-transparent ${ringColors[variant]} animate-spin`}></div>
      </div>
      
      {showText && (
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-2">{text}</p>
          {/* Loading dots animation */}
          <div className="flex justify-center space-x-1">
            <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
