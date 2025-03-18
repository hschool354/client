import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub, FaMicrosoft } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <motion.div 
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Logo and Title */}
        <motion.div className="flex flex-col items-center mb-6" variants={itemVariants}>
          <img src="/static/logo.png" alt="Logo" className="h-16 mb-4" />
          <h1 className="text-3xl font-bold text-white">Welcome</h1>
        </motion.div>

        {/* Tabs */}
        <motion.div className="flex mb-8 border-b border-gray-700" variants={itemVariants}>
          <button 
            className="flex-1 py-3 font-medium text-white border-b-2 border-blue-500"
          >
            Sign In
          </button>
          <button 
            className="flex-1 py-3 font-medium text-gray-400 hover:text-white transition-colors"
            onClick={() => navigate('/register')}
          >
            Sign Up
          </button>
        </motion.div>

        {/* Social Login */}
        <motion.div className="space-y-3 mb-6" variants={itemVariants}>
          <motion.button 
            className="flex items-center justify-center w-full py-3 px-4 bg-white text-gray-800 rounded-md font-medium hover:bg-gray-100 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaGoogle className="mr-3 text-red-500" />
            <span>Sign in with Google</span>
          </motion.button>

          <motion.button 
            className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaMicrosoft className="mr-3" />
            <span>Sign in with Microsoft</span>
          </motion.button>

          <motion.button 
            className="flex items-center justify-center w-full py-3 px-4 bg-gray-700 text-white rounded-md font-medium hover:bg-gray-600 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaGithub className="mr-3" />
            <span>Sign in with Github</span>
          </motion.button>
        </motion.div>

        {/* Divider */}
        <motion.div className="relative my-6" variants={itemVariants}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-gray-800 text-gray-400">or</span>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.form className="space-y-4" variants={itemVariants}>
          <motion.div variants={itemVariants}>
            <input 
              type="email" 
              placeholder="yours@example.com" 
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <input 
              type="password" 
              placeholder="your password" 
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="text-right">
            <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
              Don't remember your password?
            </a>
          </motion.div>

          <motion.button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-bold tracking-wide hover:bg-blue-500 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            SIGN IN
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;