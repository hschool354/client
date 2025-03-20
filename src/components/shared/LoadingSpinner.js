import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', fullPage = true }) => {
  // Size variants
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };
  
  // Spinner animation variants
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };
  
  return (
    <div className={`flex items-center justify-center ${fullPage ? 'min-h-screen bg-gray-50 dark:bg-gray-900' : ''}`}>
      <div className="flex flex-col items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={spinTransition}
          className={`border-4 border-t-indigo-600 border-r-indigo-300 border-b-indigo-600 border-l-indigo-300 rounded-full ${sizeClasses[size]}`}
        />
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;