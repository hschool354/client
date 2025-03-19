import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader } from "../ui/card";
import { LucideGithub, LucideLogIn, Mail, LockKeyhole, User, CheckSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

// Social signup button component with softer appearance
const SocialSignUpButton = ({ icon, label, bgColor, textColor, hoverColor }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button 
        variant="outline" 
        className={`w-full py-5 flex items-center justify-center gap-3 ${bgColor} ${textColor} hover:${hoverColor} transition-all duration-300 font-medium text-sm rounded-full shadow-sm`}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </motion.div>
  );
};

// Softer register form component
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the data to your API
      console.log('Form submitted successfully', formData);
      // For demonstration purposes only:
      alert('Registration successful! You can now sign in.');
      // navigate to login page would be here
    }
  };

  return (
    <motion.form 
      className="space-y-5 mt-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <Input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            className={`pl-12 py-5 bg-slate-800/30 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-full ${errors.email ? 'border-red-400' : ''}`}
            required
          />
          {errors.email && <p className="mt-1 text-xs text-red-400 ml-4">{errors.email}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="relative">
          <User className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <Input 
            type="text" 
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className={`pl-12 py-5 bg-slate-800/30 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-full ${errors.fullName ? 'border-red-400' : ''}`}
            required
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-400 ml-4">{errors.fullName}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="relative">
          <LockKeyhole className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <Input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={`pl-12 py-5 bg-slate-800/30 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-full ${errors.password ? 'border-red-400' : ''}`}
            required
          />
          {errors.password && <p className="mt-1 text-xs text-red-400 ml-4">{errors.password}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="relative">
          <LockKeyhole className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <Input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={`pl-12 py-5 bg-slate-800/30 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-full ${errors.confirmPassword ? 'border-red-400' : ''}`}
            required
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-400 ml-4">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox id="terms" className="border-slate-700/50 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
        <Label htmlFor="terms" className="text-sm text-slate-400 leading-tight">
          I agree to the <Button variant="link" className="text-blue-300 hover:text-blue-200 p-0 h-auto">terms of service</Button> and <Button variant="link" className="text-blue-300 hover:text-blue-200 p-0 h-auto">privacy policy</Button>
        </Label>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-5 rounded-full font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-blue-500/10"
        >
          <CheckSquare className="mr-2 h-4 w-4" /> SIGN UP
        </Button>
      </motion.div>
    </motion.form>
  );
};

// Main component with softer styling
const Register = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signup");

  // Smoother animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const GoogleIcon = () => (
    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
    </svg>
  );

  const MicrosoftIcon = () => (
    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" fill="currentColor">
      <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
      <path fill="#f35325" d="M1 1h10v10H1z"/>
      <path fill="#81bc06" d="M12 1h10v10H12z"/>
      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
      <path fill="#ffba08" d="M12 12h10v10H12z"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="bg-slate-800/60 backdrop-blur-lg border-slate-700/40 shadow-xl shadow-black/10 rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-col items-center pt-8 pb-2">
            <motion.div 
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              className="w-16 h-16 mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Create Account
            </motion.h1>
            <motion.p 
              className="text-slate-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Sign up to get started
            </motion.p>
          </CardHeader>

          <CardContent className="pt-4 pb-8 px-8">
            <Tabs 
              defaultValue="signup" 
              value={activeTab}
              onValueChange={(value) => {
                if (value === "signin") {
                  navigate('/login');
                } else {
                  setActiveTab(value);
                }
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/30 mb-8 rounded-full p-1">
                <TabsTrigger value="signin" className="text-slate-400 hover:text-white transition-colors rounded-full">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-full">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signup" className="mt-0">
                <motion.div 
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-3">
                    <SocialSignUpButton 
                      icon={<GoogleIcon />}
                      label="Sign up with Google"
                      bgColor="bg-white/90"
                      textColor="text-slate-700"
                      hoverColor="bg-gray-100"
                    />
                    
                    <SocialSignUpButton 
                      icon={<MicrosoftIcon />}
                      label="Sign up with Microsoft"
                      bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
                      textColor="text-white"
                      hoverColor="from-blue-600 to-blue-700"
                    />
                    
                    <SocialSignUpButton 
                      icon={<LucideGithub className="h-5 w-5" />}
                      label="Sign up with Github"
                      bgColor="bg-slate-700/80"
                      textColor="text-white"
                      hoverColor="bg-slate-600/90"
                    />
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700/40"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-800 text-slate-400">or continue with</span>
                    </div>
                  </div>

                  <RegisterForm />
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;