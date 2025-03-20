// ui/toast.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Create toast context
const ToastContext = createContext(null);

// Toast variants
const variants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 }
};

// Toast component
const Toast = ({ id, title, description, variant = 'default', onClose }) => {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  // Determine background color based on variant
  const getBgColor = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500/15 border-green-500/30 text-green-200';
      case 'error':
      case 'destructive':
        return 'bg-red-500/15 border-red-500/30 text-red-200';
      case 'warning':
        return 'bg-yellow-500/15 border-yellow-500/30 text-yellow-200';
      case 'info':
        return 'bg-blue-500/15 border-blue-500/30 text-blue-200';
      default:
        return 'bg-slate-800/80 border-slate-700/50 text-slate-200';
    }
  };

  return (
    <motion.div
      layout
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm ${getBgColor()}`}
    >
      <div className="flex-1">
        {title && <h4 className="font-medium mb-1">{title}</h4>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-current opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
};

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ title, description, variant }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              title={toast.title}
              description={toast.description}
              variant={toast.variant}
              onClose={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};