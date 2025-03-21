import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader } from "../ui/card";
import { LucideGithub, LucideLogIn, Mail, LockKeyhole } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useToast } from "../ui/use-toast";
import { ToastProvider } from "../ui/toast";
import authService from "../../services/authService"; 

// Social login button component with softer appearance
const SocialLoginButton = ({
  icon,
  label,
  bgColor,
  textColor,
  hoverColor,
  onClick,
}) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant="outline"
        className={`w-full py-5 flex items-center justify-center gap-3 ${bgColor} ${textColor} hover:${hoverColor} transition-all duration-300 font-medium text-sm rounded-full shadow-sm`}
        onClick={onClick}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </motion.div>
  );
};

// Enhanced LoginForm component with authentication
const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!credentials.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async () => {
    if (!credentials.email) {
      setErrors({ email: "Please enter your email first" });
      return;
    }

    try {
      setIsLoading(true);
      await authService.forgotPassword(credentials.email);
      toast({
        title: "Reset link sent",
        description:
          "If an account exists with that email, you'll receive password reset instructions",
        variant: "success",
      });
    } catch (error) {
      // Don't reveal if the email exists or not for security
      toast({
        title: "Reset link sent",
        description:
          "If an account exists with that email, you'll receive password reset instructions",
        variant: "success",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const { user } = await authService.login(credentials);

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.fullName || user.email}!`,
        variant: "success",
      });

      // Redirect to dashboard or home page
      navigate("/home");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Check your credentials and try again",
        variant: "destructive",
      });

      // Set form errors if applicable
      if (error.message?.toLowerCase().includes("password")) {
        setErrors({ password: "Invalid password" });
      } else if (error.message?.toLowerCase().includes("email")) {
        setErrors({ email: "Email not found" });
      } else {
        setErrors({ general: error.message || "Authentication failed" });
      }
    } finally {
      setIsLoading(false);
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
            value={credentials.email}
            onChange={handleChange}
            placeholder="Email address"
            className={`pl-12 py-5 bg-slate-800/30 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-full ${
              errors.email
                ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                : ""
            }`}
            required
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-xs ml-4">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="relative">
          <LockKeyhole className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <Input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            className={`pl-12 py-5 bg-slate-800/30 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-full ${
              errors.password
                ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                : ""
            }`}
            required
          />
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs ml-4">{errors.password}</p>
        )}
      </div>

      <div className="flex justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="link"
                className="text-sm text-blue-300 hover:text-blue-200 p-0"
                type="button"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800/90 text-slate-200 border-slate-700/50 rounded-lg">
              <p>Click to reset your password</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {errors.general && (
        <div className="bg-red-500/10 border border-red-400/20 text-red-300 px-4 py-2 rounded-lg text-sm">
          {errors.general}
        </div>
      )}

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-5 rounded-full font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-blue-500/10"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              SIGNING IN...
            </span>
          ) : (
            <>
              <LucideLogIn className="mr-2 h-4 w-4" /> SIGN IN
            </>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
};

// Main component with improved functionality
const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");

  // Smoother animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Check if already logged in and redirect
  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/home");
    }
  }, [navigate]);

  // Handle social logins
  const handleGoogleLogin = () => {
    // This would typically redirect to Google OAuth
    window.location.href = "/api/auth/google";
  };

  const handleMicrosoftLogin = () => {
    // This would typically redirect to Microsoft OAuth
    window.location.href = "/api/auth/microsoft";
  };

  const handleGithubLogin = () => {
    // This would typically redirect to Github OAuth
    window.location.href = "/api/auth/github";
  };

  const GoogleIcon = () => (
    <svg
      className="h-5 w-5 text-red-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
    </svg>
  );

  const MicrosoftIcon = () => (
    <svg
      className="h-5 w-5 text-blue-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 23 23"
      fill="currentColor"
    >
      <path fill="#f3f3f3" d="M0 0h23v23H0z" />
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H12z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  );

  return (
    <ToastProvider>
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
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2,
                }}
                className="w-16 h-16 mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
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
                Welcome Back
              </motion.h1>
              <motion.p
                className="text-slate-400 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Sign in to continue to your account
              </motion.p>
            </CardHeader>

            <CardContent className="pt-4 pb-8 px-8">
              <Tabs
                defaultValue="signin"
                value={activeTab}
                onValueChange={(value) => {
                  if (value === "signup") {
                    navigate("/register");
                  } else {
                    setActiveTab(value);
                  }
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-slate-700/30 mb-8 rounded-full p-1">
                  <TabsTrigger
                    value="signin"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-full"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="text-slate-400 hover:text-white transition-colors rounded-full"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-0">
                  <motion.div
                    className="space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-3">
                      <SocialLoginButton
                        icon={<GoogleIcon />}
                        label="Sign in with Google"
                        bgColor="bg-white/90"
                        textColor="text-slate-700"
                        hoverColor="bg-gray-100"
                        onClick={handleGoogleLogin}
                      />

                      <SocialLoginButton
                        icon={<MicrosoftIcon />}
                        label="Sign in with Microsoft"
                        bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
                        textColor="text-white"
                        hoverColor="from-blue-600 to-blue-700"
                        onClick={handleMicrosoftLogin}
                      />

                      <SocialLoginButton
                        icon={<LucideGithub className="h-5 w-5" />}
                        label="Sign in with Github"
                        bgColor="bg-slate-700/80"
                        textColor="text-white"
                        hoverColor="bg-slate-600/90"
                        onClick={handleGithubLogin}
                      />
                    </div>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700/40"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-slate-800 text-slate-400">
                          or continue with
                        </span>
                      </div>
                    </div>

                    <LoginForm />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ToastProvider>
  );
};

export default Login;
