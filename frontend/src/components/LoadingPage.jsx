import React from 'react';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function LoadingPage({ 
  title = 'Loading...', 
  subtitle = 'Please wait while we process your request.',
  variant = 'primary',
  showProgress = false,
  progressSteps = [],
  currentStep = 0,
  error = null
}) {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1000px_600px_at_-10%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(800px_500px_at_110%_110%,rgba(147,51,234,0.25),transparent)] bg-slate-950 flex items-center justify-center p-6">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        {/* Decorative blur elements */}
        <div className="absolute -top-6 -right-6 h-24 w-24 bg-indigo-500/20 blur-2xl rounded-full" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 bg-fuchsia-500/20 blur-2xl rounded-full" />
        
        <div className="relative p-8 text-center">
          <LoadingSpinner 
            variant={error ? 'error' : variant} 
            text=""
            showText={false}
            className="mb-6"
          />
          
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
            {error ? 'Something went wrong' : title}
          </h1>
          <p className={`text-sm mb-6 ${error ? 'text-rose-300' : 'text-gray-300'}`}>
            {error || subtitle}
          </p>
          
          {/* Progress steps */}
          {showProgress && progressSteps.length > 0 && (
            <div className="space-y-3 text-left">
              {progressSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`h-2 w-2 rounded-full ${
                    currentStep > index 
                      ? 'bg-emerald-400 animate-pulse' 
                      : currentStep === index 
                        ? 'bg-indigo-400 animate-pulse' 
                        : 'bg-gray-400'
                  }`} style={{ animationDelay: `${index * 500}ms` }}></div>
                  <span className={`text-sm ${
                    currentStep >= index ? 'text-gray-300' : 'text-gray-400'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
