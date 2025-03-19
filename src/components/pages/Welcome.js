import React, { useState, useEffect } from "react";
import {
  motion,
  useAnimation,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";
import {
  Star,
  Users,
  DollarSign,
  Play,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import EA from "../components/Ea";
import { MainPage } from "../components/MainPage";

const Welcome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { scrollYProgress } = useScroll();

  // Animation setup
  const [modelRef, modelInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [partnersRef, partnersInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [demoRef, demoInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [getStartedRef, getStartedInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [testimonialsRef, testimonialsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const slideInFromRight = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="font-sans antialiased text-gray-900">
      <motion.div
        className="fixed inset-0 top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main className="w-full overflow-hidden">
        {/* New 3D Model Section - Đã chỉnh sửa */}
        <motion.section
          ref={modelRef}
          className="py-16 md:py-24 mt-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden"
          initial="hidden"
          animate={modelInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <div className="container mx-auto px-8 max-w-6xl relative z-10">
            <motion.div className="text-center mb-8" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Experience Our 3D Innovation
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Interact with our cutting-edge 3D model showcasing advanced
                technology
              </p>
            </motion.div>
            <motion.div
              className="w-full h-[500px] md:h-[600px]"
              variants={scaleIn}
            >
              <MainPage />
            </motion.div>
          </div>
          {/* Background effects */}
          <div className="absolute inset-0 z-0">
            <motion.div
              className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply opacity-10"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply opacity-10"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -10, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        </motion.section>

        {/* Hero Section - Modernized with ShadCN */}
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
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply opacity-10"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          <div className="container mx-auto px-8 max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 mb-10 md:mb-0">
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight"
                  variants={fadeInUp}
                  custom={1}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Streamline
                  </span>{" "}
                  Workflows with AI Automation
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-600 mb-8 max-w-2xl"
                  variants={fadeInUp}
                  custom={2}
                >
                  Simplify your data management with a visual database
                  connecting 6,000+ apps via Zapier, Make, and more.
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-4"
                  variants={fadeInUp}
                  custom={3}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 shadow-lg hover:shadow-blue-500/25"
                    >
                      Get Started. It's FREE
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white text-blue-600 border-blue-100 hover:bg-gray-50 px-8 py-6 shadow-lg"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Watch Demo
                    </Button>
                  </motion.div>
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
                  <Card className="shadow-2xl border-2 border-gray-100">
                    <CardContent className="p-6">
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
                    </CardContent>
                  </Card>
                  <div className="absolute -z-10 inset-0 blur-xl bg-gradient-to-r from-blue-400 to-indigo-400 opacity-30 rounded-2xl transform translate-y-6 scale-95"></div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Partners Section - Enhanced with ShadCN */}
        <motion.section
          ref={partnersRef}
          className="py-16 bg-white"
          initial="hidden"
          animate={partnersInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <div className="container mx-auto px-8 max-w-6xl">
            <motion.div className="text-center mb-10" variants={fadeInUp}>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Our Trusted Partners
              </h2>
              <p className="text-gray-600">
                Collaborating with industry leaders to deliver exceptional
                solutions
              </p>
            </motion.div>
            <motion.div className="overflow-hidden" variants={fadeInUp}>
              <div className="flex justify-center flex-wrap gap-6">
                {[
                  "BlockEden.xyz",
                  "Insta360",
                  "TME",
                  "miHoYo",
                  "Share Creators",
                  "Allied Logistics",
                ].map((partner, index) => (
                  <motion.div
                    key={partner}
                    className="px-6 py-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <span className="text-lg font-medium text-gray-700">
                      {partner}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section - Enhanced with Lucide Icons and ShadCN */}
        <motion.section
          ref={featuresRef}
          className="py-24 bg-gradient-to-b from-white to-gray-50"
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <div className="container mx-auto px-8 max-w-6xl">
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <span className="text-blue-600 font-semibold uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="text-4xl font-bold text-gray-800 mt-2">
                Trusted by Thousands
              </h2>
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
                  icon: <Star className="h-10 w-10" />,
                },
                {
                  title: "10,000+",
                  description:
                    "Customers trust us to streamline their workflows",
                  icon: <Users className="h-10 w-10" />,
                },
                {
                  title: "$10M+",
                  description:
                    "Raised to enhance product stability and reliability",
                  icon: <DollarSign className="h-10 w-10" />,
                },
              ].map((feature, index) => (
                <motion.div key={index}>
                  <Card
                    className="h-full transition-all duration-300"
                    variants={scaleIn}
                  >
                    <CardContent className="pt-8">
                      <motion.div whileHover={{ y: -8 }} className="p-8">
                        <div className="text-blue-600 mb-4">{feature.icon}</div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                        <div className="mt-6 w-16 h-1 bg-blue-100"></div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Demo Video Section - Enhanced with ShadCN Tooltip */}
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
                rotate: [0, 45, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -left-20 bottom-10 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply opacity-50"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -45, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          <div className="container mx-auto px-8 max-w-6xl text-center relative z-10">
            <motion.div className="mb-16" variants={fadeInUp}>
              <span className="text-blue-600 font-semibold uppercase tracking-wider">
                Demo Video
              </span>
              <h2 className="text-4xl font-bold text-gray-800 mt-2">
                See
                <motion.span
                  className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  How AITable Works
                </motion.span>
              </h2>
              <motion.p
                className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                Become a powerful AI engineer today with our intuitive and
                powerful platform
              </motion.p>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-6 mb-12"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 shadow-lg hover:shadow-blue-500/25"
                >
                  Get Started. It's FREE
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-blue-600 border-blue-100 hover:bg-gray-50 px-8 py-6 shadow-lg"
                >
                  Contact Sales
                </Button>
              </motion.div>
            </motion.div>

            <motion.div className="w-full max-w-4xl mx-auto" variants={scaleIn}>
              <motion.div
                className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30"></div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                        <motion.div
                          className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(255,255,255,0.7)",
                              "0 0 0 20px rgba(255,255,255,0)",
                            ],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Play className="h-8 w-8 text-blue-600 ml-1" />
                        </motion.div>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Watch our 2-minute demo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Video thumbnail overlay */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/30 backdrop-blur-sm rounded-lg text-white text-left">
                  <h3 className="font-medium">Discover AITable</h3>
                  <p className="text-sm text-gray-200">
                    Watch our 2-minute demo to see how AITable works
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Get Started Section - Modernized */}
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
                x: [0, 20, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute right-0 top-0 w-80 h-80 bg-indigo-100 rounded-full opacity-50"
              animate={{
                y: [0, 20, 0],
                x: [0, -20, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          <div className="container mx-auto px-8 max-w-6xl text-center relative z-10">
            <motion.div className="mb-12" variants={fadeInUp}>
              <span className="text-blue-600 font-semibold uppercase tracking-wider">
                GET STARTED
              </span>
              <h2 className="text-4xl font-bold text-gray-800 mt-2">
                <motion.span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  Codeless, Effortless, Smart
                </motion.span>
              </h2>
            </motion.div>

            <motion.div className="mb-12" variants={scaleIn}>
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
                We're in private beta now. Join us and be the first to adopt
                AITable for free.
              </p>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-blue-500/25"
                >
                  Start Free
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative mx-auto mt-20 max-w-lg"
              variants={scaleIn}
            >
              <Card className="bg-white p-8 rounded-2xl shadow-xl relative z-10">
                <CardContent className="p-0">
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Easy to Integrate
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Connect with your favorite tools and platforms in minutes,
                      not days.
                    </p>
                    <div className="flex justify-center space-x-4">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="w-3 h-3 bg-blue-100 rounded-full"
                        ></div>
                      ))}
                    </div>
                  </motion.div>
                </CardContent>
              </Card>

              <motion.div
                className="absolute inset-0 -z-10 rounded-2xl"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(59, 130, 246, 0.3)",
                    "0 0 0 40px rgba(59, 130, 246, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonials Section - Enhanced with ShadCN Cards */}
        <motion.section
          ref={testimonialsRef}
          className="py-24 bg-white"
          initial="hidden"
          animate={testimonialsInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <div className="container mx-auto px-8 max-w-6xl">
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <span className="text-blue-600 font-semibold uppercase tracking-wider">
                Testimonials
              </span>
              <h2 className="text-4xl font-bold text-gray-800 mt-2">
                What Our Users Say
              </h2>
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
                  quote:
                    "AITable has transformed how our team manages data. The automation features have saved us countless hours of manual work.",
                  image: "/api/placeholder/64/64",
                  rating: 5,
                },
                {
                  name: "Michael Chen",
                  position: "CTO at StartupX",
                  quote:
                    "The integration capabilities are incredible. We've connected all our tools seamlessly and our workflow efficiency has improved by 70%.",
                  image: "/api/placeholder/64/64",
                  rating: 5,
                },
                {
                  name: "Jessica Williams",
                  position: "Operations Director at GrowthCo",
                  quote:
                    "I was skeptical at first, but AITable delivered beyond our expectations. The AI suggestions are surprisingly accurate and helpful.",
                  image: "/api/placeholder/64/64",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -8 }}
                >
                  <Card className="h-full border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex mb-6 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating ? "fill-current" : ""
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 italic mb-8 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-100">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {testimonial.position}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section - Enhanced with ShadCN Buttons */}
        <motion.section
          ref={ctaRef}
          className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <div className="container mx-auto px-8 max-w-4xl text-center">
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
              Join thousands of teams already using AITable to automate their
              processes and boost productivity.
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-6"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  Start Free Trial
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent text-white border-2 border-white hover:bg-white/10 px-8 py-6 shadow-lg transition-all"
                >
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Schedule a Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Background decorations */}
            <div className="relative mt-16">
              <motion.div
                className="absolute top-0 left-1/4 w-8 h-8 bg-white rounded-full opacity-20"
                animate={{
                  y: [0, -40, 0],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="absolute top-10 right-1/4 w-6 h-6 bg-white rounded-full opacity-20"
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
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
