import React from 'react';

// PUBLIC_INTERFACE
const LoadingSpinner = () => {
  /**
   * Loading spinner component with animated waves
   * @returns {JSX.Element} Loading spinner with surf-themed animation
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100 flex items-center justify-center">
      <div className="text-center">
        {/* Wave Animation */}
        <div className="flex space-x-2 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-8 bg-gradient-to-t from-primary to-accent rounded-full animate-wave"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
        
        {/* App Title */}
        <h1 className="text-3xl font-bold text-primary mb-2">SurfBuddy</h1>
        <p className="text-gray-600">Loading your surf experience...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
