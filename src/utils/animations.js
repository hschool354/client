// src/utils/animations.js

/**
 * Animation variants for Framer Motion
 * These provide reusable animation configurations for components throughout the application
 */

// Fade animation variants
export const fadeVariants = {
    hidden: { 
      opacity: 0 
    },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      } 
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.2,
        ease: "easeOut" 
      } 
    }
  };
  
  // Container animation variants
  export const containerVariants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      } 
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.3,
        ease: "easeIn",
        staggerChildren: 0.05,
        staggerDirection: -1
      } 
    }
  };
  
  // Item animation variants (for use with containerVariants)
  export const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 10 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut" 
      } 
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.2 
      } 
    }
  };
  
  // Scale animation variants
  export const scaleVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9 
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: [0.175, 0.885, 0.32, 1.275] // Custom cubic bezier for bounce effect
      } 
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: { 
        duration: 0.2,
        ease: "easeIn" 
      } 
    }
  };
  
  // Slide animation variants
  export const slideVariants = {
    hidden: { 
      x: "-100%" 
    },
    visible: { 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30 
      } 
    },
    exit: { 
      x: "100%",
      transition: { 
        duration: 0.3,
        ease: "easeIn" 
      } 
    }
  };
  
  // Modal animation variants
  export const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8 
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut" 
      } 
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: { 
        duration: 0.2,
        ease: "easeIn" 
      } 
    }
  };
  
  // Backdrop animation variants (for modals)
  export const backdropVariants = {
    hidden: { 
      opacity: 0 
    },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.2 
      } 
    },
    exit: { 
      opacity: 0,
      transition: { 
        delay: 0.1,
        duration: 0.2 
      } 
    }
  };