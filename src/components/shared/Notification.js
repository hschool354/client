import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { XIcon, CheckCircleIcon, ExclamationIcon, InformationCircleIcon } from '@heroicons/react/solid';

const NotificationIcons = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />,
  error: <ExclamationIcon className="h-6 w-6 text-red-400" aria-hidden="true" />,
  info: <InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />,
  warning: <ExclamationIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
};

const Notification = ({ type = 'info', message, onClose, duration = 4000 }) => {
  // Auto-dismiss notification after duration
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  // Get background color based on notification type
  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/30';
      case 'error': return 'bg-red-50 dark:bg-red-900/30';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/30';
      case 'info':
      default: return 'bg-blue-50 dark:bg-blue-900/30';
    }
  };

  // Get border color based on notification type
  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'border-green-400 dark:border-green-500';
      case 'error': return 'border-red-400 dark:border-red-500';
      case 'warning': return 'border-yellow-400 dark:border-yellow-500';
      case 'info':
      default: return 'border-blue-400 dark:border-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed z-50 top-4 right-4 max-w-sm"
    >
      <div className={`rounded-md shadow-md border-l-4 ${getBorderColor()} ${getBgColor()} p-4`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {NotificationIcons[type]}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Notification;