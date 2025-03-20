import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

/**
 * Tooltip component that displays a floating tip when hovering over children elements
 * @param {React.ReactNode} children - Element that triggers the tooltip
 * @param {string} content - Text content to display in the tooltip
 * @param {string} position - Position of tooltip (top, right, bottom, left)
 * @param {string} delay - Delay before showing tooltip in ms
 * @param {boolean} dark - Force dark mode regardless of theme
 */
export const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = '300',
  dark = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const childRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);
  const { theme } = useTheme();

  const isDarkMode = dark || theme === 'dark';

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, parseInt(delay));
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    // Clean up timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && childRef.current && tooltipRef.current) {
      const childRect = childRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let x = 0;
      let y = 0;
      
      // Calculate position based on the selected position prop
      switch (position) {
        case 'top':
          x = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2);
          y = childRect.top - tooltipRect.height - 8;
          break;
        case 'right':
          x = childRect.right + 8;
          y = childRect.top + (childRect.height / 2) - (tooltipRect.height / 2);
          break;
        case 'bottom':
          x = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2);
          y = childRect.bottom + 8;
          break;
        case 'left':
          x = childRect.left - tooltipRect.width - 8;
          y = childRect.top + (childRect.height / 2) - (tooltipRect.height / 2);
          break;
        default:
          x = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2);
          y = childRect.top - tooltipRect.height - 8;
      }
      
      // Make sure tooltip stays within viewport
      x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
      y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));
      
      setCoords({ x, y });
    }
  }, [isVisible, position]);

  // Get arrow position class
  const getArrowClass = () => {
    switch (position) {
      case 'top': return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-gray-800 dark:border-t-gray-200 border-x-transparent border-b-transparent';
      case 'right': return 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-gray-800 dark:border-r-gray-200 border-y-transparent border-l-transparent';
      case 'bottom': return 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-gray-800 dark:border-b-gray-200 border-x-transparent border-t-transparent';
      case 'left': return 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-gray-800 dark:border-l-gray-200 border-y-transparent border-r-transparent';
      default: return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-gray-800 dark:border-t-gray-200 border-x-transparent border-b-transparent';
    }
  };

  // Animation variants based on position
  const getAnimationVariant = () => {
    const distance = 8;
    let initial = {};
    
    switch (position) {
      case 'top': initial = { y: -distance }; break;
      case 'right': initial = { x: distance }; break;
      case 'bottom': initial = { y: distance }; break;
      case 'left': initial = { x: -distance }; break;
      default: initial = { y: -distance };
    }
    
    return {
      hidden: { 
        opacity: 0,
        ...initial
      },
      visible: { 
        opacity: 1,
        x: 0,
        y: 0,
        transition: { 
          duration: 0.2,
          ease: "easeOut" 
        }
      },
      exit: { 
        opacity: 0,
        ...initial,
        transition: { 
          duration: 0.1,
          ease: "easeIn" 
        }
      }
    };
  };

  return (
    <>
      {/* Wrap children in a span to attach events and ref */}
      <span
        ref={childRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </span>
      
      {/* Portal for tooltip to avoid container clipping */}
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            ref={tooltipRef}
            className={`fixed z-50 pointer-events-none ${className}`}
            style={{ 
              left: coords.x,
              top: coords.y
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={getAnimationVariant()}
          >
            <div className={`relative px-2 py-1 text-xs font-medium rounded shadow-md ${isDarkMode ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-white'}`}>
              {content}
              <div className={`absolute w-0 h-0 border-4 ${getArrowClass()}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Tooltip;