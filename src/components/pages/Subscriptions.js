import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, DollarSign, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

const Subscriptions = () => {
  // Dữ liệu giả định cho các gói đăng ký
  const plans = [
    {
      name: 'FREE',
      price: '$0/month',
      features: [
        'Basic access to features',
        'Limited support',
        'Community updates',
      ],
      buttonText: 'Get Started',
      gradient: 'from-gray-500 to-gray-600',
    },
    {
      name: 'PREMIUM',
      price: '$9.99/month',
      features: [
        'Unlimited feature access',
        'Priority support',
        'Exclusive content',
        'Early updates',
      ],
      buttonText: 'Choose PREMIUM',
      gradient: 'from-indigo-600 to-purple-600',
    },
  ];

  // Hiệu ứng động
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } },
  };

  const glowVariants = {
    animate: { scale: [1, 1.03, 1], opacity: [0.7, 1, 0.7] },
    transition: { duration: 2, repeat: Infinity },
  };

  const featureVariants = {
    hover: { x: 5, transition: { type: 'spring', stiffness: 300 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-100 text-gray-900 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="inline-flex items-center justify-center mb-4"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <DollarSign className="text-indigo-600 w-12 h-12 mr-3" />
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Explore Our Plans
            </h1>
          </motion.div>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Choose the perfect plan to unlock amazing features and elevate your experience.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="relative bg-white rounded-3xl shadow-xl p-8 overflow-hidden"
              variants={cardVariants}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Glow effect cho PREMIUM */}
              {plan.name === 'PREMIUM' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-purple-200 opacity-20"
                  variants={glowVariants}
                  animate="animate"
                />
              )}

              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{plan.name}</h2>
                <p className="text-2xl font-semibold text-gray-600 mb-6">{plan.price}</p>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center text-gray-700"
                      variants={featureVariants}
                      whileHover="hover"
                    >
                      <Check className="w-5 h-5 text-indigo-500 mr-3" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  className={`w-full bg-gradient-to-r ${plan.gradient} hover:${plan.gradient.replace(
                    '600',
                    '700'
                  )} text-white py-3 rounded-xl flex items-center justify-center`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="flex items-center"
                  >
                    {plan.name === 'PREMIUM' ? (
                      <Star className="mr-2" size={20} />
                    ) : (
                      <Sparkles className="mr-2" size={20} />
                    )}
                    {plan.buttonText}
                  </motion.div>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Subscriptions;