    import React from 'react';
    import { motion } from 'framer-motion';

    const Header = () => {
    return (
        <motion.header 
        className="bg-white shadow-sm py-4 px-6 fixed w-full z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        >
        <div className="container mx-auto flex items-center justify-between">
            <motion.div 
            className="text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            >
            IdeaHive
            <motion.span 
                animate={{ 
                color: ["#4A90E2", "#3BD16F", "#F5A623", "#4A90E2"],
                }}
                transition={{ duration: 8, repeat: Infinity }}
            >.ai</motion.span>
            </motion.div>
            
            <motion.nav 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            >
            {['Solution', 'Learn', 'Template', 'Pricing', 'Help Center'].map((item, index) => (
                <motion.a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className={`text-gray-700 font-medium hover:text-blue-600 ${item === 'Pricing' ? 'px-3 py-1 bg-blue-50 rounded-full' : ''}`}
                whileHover={{ y: -3, color: "#4A90E2" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                {item}
                </motion.a>
            ))}
            </motion.nav>
            
            <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            >
            <motion.button 
                className="hidden md:inline-block px-4 py-2 border border-blue-200 text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Contact Sales
            </motion.button>
            <motion.button 
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                boxShadow: ["0 0 0 rgba(74,144,226,0.4)", "0 0 10px rgba(74,144,226,0.5)", "0 0 0 rgba(74,144,226,0.4)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Login
            </motion.button>
            
            {/* Mobile menu button - visible on small screens */}
            <button className="md:hidden text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            </motion.div>
        </div>
        </motion.header>
    );
    };

    export default Header;