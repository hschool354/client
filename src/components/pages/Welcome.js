import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useScroll, AnimatePresence } from 'framer-motion';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from 'react-responsive';

const Welcome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { scrollYProgress } = useScroll();
  
  // Utiliser IntersectionObserver pour déclencher les animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [partnersRef, partnersInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [demoRef, demoInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [getStartedRef, getStartedInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Variants d'animation améliorés
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
    }
  };
  
  const slideInFromRight = {
    hidden: { x: 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900">
      <motion.div
        className="fixed inset-0 top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main className="w-full overflow-hidden">
        {/* Hero Section - Modernisé */}
        <motion.section 
          ref={heroRef}
          className="py-20 md:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden relative"
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <div className="absolute inset-0 z-0">
            <motion.div 
              className="absolute top-20 right-40 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply opacity-10"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div 
              className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply opacity-10"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -5, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            />
          </div>

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 mb-10 md:mb-0">
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight"
                  variants={fadeInUp}
                  custom={1}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Streamline</span> Workflows with AI Automation
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-600 mb-8 max-w-2xl"
                  variants={fadeInUp}
                  custom={2}
                >
                  Simplify your data management with a visual database connecting 6,000+ apps via Zapier, Make, and more.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-4"
                  variants={fadeInUp}
                  custom={3}
                >
                  <motion.button 
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Get Started. It's FREE
                  </motion.button>
                  <motion.button 
                    className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg shadow-lg border border-blue-100 hover:bg-gray-50 transition-all"
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Watch Demo
                  </motion.button>
                </motion.div>
              </div>
              <motion.div 
                className="w-full md:w-1/2"
                variants={slideInFromRight}
              >
                <motion.div 
                  className="relative max-w-md mx-auto"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="bg-white shadow-2xl rounded-xl p-6 border-2 border-gray-100"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold">AI</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                          <div className="h-2 bg-gray-200 rounded-full w-3/4 mt-2"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">DB</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-blue-200 rounded-full w-full"></div>
                          <div className="h-2 bg-blue-200 rounded-full w-1/2 mt-2"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-3 bg-indigo-50 rounded-lg">
                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">API</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-indigo-200 rounded-full w-full"></div>
                          <div className="h-2 bg-indigo-200 rounded-full w-2/3 mt-2"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <div className="absolute -z-10 inset-0 blur-xl bg-gradient-to-r from-blue-400 to-indigo-400 opacity-30 rounded-2xl transform translate-y-6 scale-95"></div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>
        
        {/* Partners Section - Amélioré */}
        <motion.section 
          ref={partnersRef}
          className="py-16 bg-white"
          initial="hidden"
          animate={partnersInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div 
              className="text-center mb-10"
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Trusted Partners</h2>
              <p className="text-gray-600">Collaborating with industry leaders to deliver exceptional solutions</p>
            </motion.div>
            <motion.div 
              className="overflow-hidden"
              variants={fadeInUp}
            >
              <div className="flex justify-center flex-wrap gap-6">
                {['BlockEden.xyz', 'Insta360', 'TME', 'miHoYo', 'Share Creators', 'Allied Logistics'].map((partner, index) => (
                  <motion.div 
                    key={partner} 
                    className="px-6 py-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <span className="text-lg font-medium text-gray-700">{partner}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Features Section - Amélioré */}
        <motion.section 
          ref={featuresRef}
          className="py-24 bg-gradient-to-b from-white to-gray-50"
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <span className="text-blue-600 font-semibold uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-4xl font-bold text-gray-800 mt-2">Trusted by Thousands</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {[
                { 
                  title: "10,000+", 
                  description: "GitHub stars showcasing developer endorsement",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )
                },
                { 
                  title: "10,000+", 
                  description: "Customers trust us to streamline their workflows",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                },
                { 
                  title: "$10M+", 
                  description: "Raised to enhance product stability and reliability",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                  variants={scaleIn}
                  whileHover={{ 
                    y: -8, 
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" 
                  }}
                >
                  <div className="text-blue-600 mb-4">{feature.icon}</div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <div className="mt-6 w-16 h-1 bg-blue-100"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
        
        {/* Demo Video Section - Amélioré */}
        <motion.section 
          ref={demoRef}
          className="py-24 bg-white relative overflow-hidden"
          initial="hidden"
          animate={demoInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute -right-40 top-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply opacity-50"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 45, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div 
              className="absolute -left-20 bottom-10 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply opacity-50"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, -45, 0]
              }}
              transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
            />
          </div>
          
          <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
            <motion.div className="mb-16" variants={fadeInUp}>
              <span className="text-blue-600 font-semibold uppercase tracking-wider">Demo Video</span>
              <h2 className="text-4xl font-bold text-gray-800 mt-2">See 
                <motion.span 
                  className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                >How AITable Works</motion.span>
              </h2>
              <motion.p 
                className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                Become a powerful AI engineer today with our intuitive and powerful platform
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-6 mb-12"
              variants={fadeInUp}
            >
              <motion.button 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started. It's FREE
              </motion.button>
              <motion.button 
                className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg shadow-lg border border-blue-100 hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)" }}
                whileTap={{ scale: 0.97 }}
              >
                Contact Sales
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="w-full max-w-4xl mx-auto"
              variants={scaleIn}
            >
              <motion.div 
                className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30"></div>
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <motion.div 
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ 
                      boxShadow: ["0 0 0 0 rgba(255,255,255,0.7)", "0 0 0 20px rgba(255,255,255,0)"],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <motion.div 
                      className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-blue-600 border-b-8 border-b-transparent ml-1"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    ></motion.div>
                  </motion.div>
                </motion.div>

                {/* Video thumbnail overlay */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/30 backdrop-blur-sm rounded-lg text-white text-left">
                  <h3 className="font-medium">Discover AITable</h3>
                  <p className="text-sm text-gray-200">Watch our 2-minute demo to see how AITable works</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Get Started Section - Modernisé */}
        <motion.section 
          ref={getStartedRef}
          className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
          initial="hidden"
          animate={getStartedInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <div className="absolute inset-0 z-0">
            <motion.div 
              className="absolute -left-20 bottom-0 w-96 h-96 bg-blue-100 rounded-full opacity-50"
              animate={{ 
                y: [0, -20, 0],
                x: [0, 20, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div 
              className="absolute right-0 top-0 w-80 h-80 bg-indigo-100 rounded-full opacity-50"
              animate={{ 
                y: [0, 20, 0],
                x: [0, -20, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
            />
          </div>
          
          <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
            <motion.div className="mb-12" variants={fadeInUp}>
              <span className="text-blue-600 font-semibold uppercase tracking-wider">GET STARTED</span>
              <h2 className="text-4xl font-bold text-gray-800 mt-2">
                <motion.span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                >
                  Codeless, Effortless, Smart
                </motion.span>
              </h2>
            </motion.div>
            
            <motion.div 
              className="mb-12"
              variants={scaleIn}
            >
              <h1 className="text-6xl md:text-7xl font-extrabold text-blue-600 mb-6">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  It's Free!
                </motion.span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
                We're in private beta now. Join us and be the first to adopt AITable for free.
              </p>
              <motion.button 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.97 }}
                animate={{ 
                  boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.4)", "0 0 0 15px rgba(59, 130, 246, 0)"],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Start Free
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="relative mx-auto mt-20 max-w-lg"
              variants={scaleIn}
            >
              <motion.div 
                className="bg-white p-8 rounded-2xl shadow-xl relative z-10"
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Easy to Integrate</h3>
                <p className="text-gray-600 mb-4">Connect with your favorite tools and platforms in minutes, not days.</p>
                <div className="flex justify-center space-x-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="w-3 h-3 bg-blue-100 rounded-full"></div>
                  ))}
                </div>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl"
                  animate={{ 
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                ></motion.div>
              </motion.div>
              
              {/* Animated background elements */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200 rounded-full opacity-50"></div>
                <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-purple-200 rounded-full opacity-40"></div>
                <motion.div 
                  className="absolute inset-0 rounded-2xl"
                  animate={{ 
                    boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.3)", "0 0 0 40px rgba(59, 130, 246, 0)"],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Testimonials Section - Amélioré */}
        <motion.section 
          ref={testimonialsRef}
          className="py-24 bg-white"
          initial="hidden"
          animate={testimonialsInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <span className="text-blue-600 font-semibold uppercase tracking-wider">Testimonials</span>
              <h2 className="text-4xl font-bold text-gray-800 mt-2">What Our Users Say</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {[
                {
                  name: "Sarah Johnson",
                  position: "Product Manager at TechCorp",
                  quote: "AITable has transformed how our team manages data. The automation features have saved us countless hours of manual work.",
                  image: "/api/placeholder/64/64",
                  rating: 5
                },
                {
                  name: "Michael Chen",
                  position: "CTO at StartupX",
                  quote: "The integration capabilities are incredible. We've connected all our tools seamlessly and our workflow efficiency has improved by 70%.",
                  image: "/api/placeholder/64/64",
                  rating: 5
                },
                {
                  name: "Jessica Williams",
                  position: "Operations Director at GrowthCo",
                  quote: "I was skeptical at first, but AITable delivered beyond our expectations. The AI suggestions are surprisingly accurate and helpful.",
                  image: "/api/placeholder/64/64",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
                  variants={scaleIn}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="mb-6 text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={i < testimonial.rating ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={i < testimonial.rating ? "0" : "1.5"}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-8 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center mt-auto">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-100">
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.position}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
        
        {/* CTA Section - Amélioré */}
        <motion.section 
          ref={ctaRef}
          className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              variants={fadeInUp}
            >
              Ready to Transform Your Workflow?
            </motion.h2>
            <motion.p 
              className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Join thousands of teams already using AITable to automate their processes and boost productivity.
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center gap-6"
              variants={fadeInUp}
            >
              <motion.button 
                className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.97 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button 
                className="px-8 py-4 bg-transparent text-white font-medium rounded-lg border-2 border-white hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Schedule a Demo
              </motion.button>
            </motion.div>
            
            {/* Background decorations */}
            <div className="relative mt-16">
              <motion.div 
                className="absolute top-0 left-1/4 w-8 h-8 bg-white rounded-full opacity-20"
                animate={{ 
                  y: [0, -40, 0],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.div 
                className="absolute top-10 right-1/4 w-6 h-6 bg-white rounded-full opacity-20"
                animate={{ 
                  y: [0, -30, 0],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.div 
                className="absolute top-20 left-1/3 w-4 h-4 bg-white rounded-full opacity-20"
                animate={{ 
                  y: [0, -20, 0],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
              />
            </div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Welcome;