import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Moon,
  Sun,
  Save,
  Star,
} from "lucide-react";
import userProfileService from "../../services/userProfileService";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";

const Settings = ({ user }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    avatar_base64: "",
  });
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("userSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          darkMode: false,
          language: "en",
          notifications_enabled: true,
        };
  });
  const [showAvatarForm, setShowAvatarForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    applySettings();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const profileData = await userProfileService.getUserProfile();
      setProfile({
        full_name: profileData.full_name || "",
        email: profileData.email || "",
        avatar_base64: profileData.avatar_base64 || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      showNotification(
        `Failed to load profile: ${error.message || "Unknown error"}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const applySettings = () => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const updatedProfile = await userProfileService.updateUserProfile({
        full_name: profile.full_name,
        email: profile.email,
      });
      setProfile(updatedProfile.profile);
      showNotification("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification(
        `Failed to update profile: ${error.message || "Unknown error"}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAvatar = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      await userProfileService.updateUserAvatar(selectedFile);
      const updatedProfile = await userProfileService.getUserProfile();
      setProfile((prev) => ({
        ...prev,
        avatar_base64: updatedProfile.avatar_base64,
      }));
      showNotification("Avatar updated successfully");
      setShowAvatarForm(false); // Ẩn form sau khi upload thành công
      setSelectedFile(null); // Reset file đã chọn
    } catch (error) {
      console.error("Error updating avatar:", error);
      showNotification(
        `Failed to update avatar: ${error.message || "Unknown error"}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    }
  };

  const handleUpdateSettings = () => {
    setIsLoading(true);
    try {
      localStorage.setItem("userSettings", JSON.stringify(settings));
      showNotification("Settings updated successfully");
      applySettings();
    } catch (error) {
      console.error("Error updating settings:", error);
      showNotification(
        `Failed to update settings: ${error.message || "Unknown error"}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-amber-500";
      default:
        return "bg-indigo-500";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, ease: "easeInOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 30 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div
      className={`flex-1 min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 ${
        settings.darkMode ? "dark text-white" : ""
      }`}
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Star className="text-indigo-400 w-8 h-8" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-2xl shadow-lg ${getNotificationStyle(
              notification.type
            )} text-white flex items-center`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={notificationVariants}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div
          className="mb-8 md:mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center mb-4">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <SettingsIcon className="mr-3 text-indigo-400" size={30} />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 font-sans">
              Settings
            </h1>
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-300 font-sans">
            Customize your profile and app preferences
          </p>
        </motion.div>

        {/* Nội dung cài đặt */}
        <motion.div
          className="grid grid-cols-1 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Profile Section */}
          <motion.div
            className="p-8 bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
            variants={cardVariants}
          >
            <div className="flex items-center mb-6">
              <User className="text-indigo-400 mr-3" size={22} />
              <h2 className="text-2xl font-medium text-gray-900 dark:text-white font-sans">
                Profile
              </h2>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="space-y-6">
                {/* Avatar - Sửa để hiển thị tròn hoàn toàn */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 ring-2 ring-indigo-200 dark:ring-indigo-700 transition-all">
                    {profile.avatar_base64 ? (
                      <img
                        src={`data:image/jpeg;base64,${profile.avatar_base64}`}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-semibold text-gray-500">
                          {profile.full_name
                            ? profile.full_name[0].toUpperCase()
                            : "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUpdateAvatar}
                    />
                    <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowAvatarForm(true)}
                    className="bg-indigo-50 text-indigo-500 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 rounded-2xl px-4 py-2 font-sans"
                  >
                    Change Avatar
                  </motion.button>

                    {/* Form kéo thả avatar */}
                    <AnimatePresence>
                      {showAvatarForm && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute top-0 left-0 w-full h-full bg-gray-900/80 rounded-2xl flex items-center justify-center z-10"
                        >
                          <div
                            className="w-64 p-4 bg-white dark:bg-gray-800 rounded-xl"
                            onDrop={handleFileDrop}
                            onDragOver={(e) => e.preventDefault()}
                          >
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-400 rounded-xl cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                              />
                              <p className="text-sm text-gray-500 dark:text-gray-300">
                                {selectedFile
                                  ? selectedFile.name
                                  : "Drag & drop or click to select"}
                              </p>
                            </label>
                            <div className="flex gap-2 mt-4">
                              <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={handleUpdateAvatar}
                                className="flex-1 bg-indigo-500 text-white rounded-xl py-2"
                                disabled={!selectedFile || isLoading}
                              >
                                Accept
                              </motion.button>
                              <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => {
                                  setShowAvatarForm(false);
                                  setSelectedFile(null);
                                }}
                                className="flex-1 bg-gray-300 text-gray-900 rounded-xl py-2"
                              >
                                Cancel
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </label>
                </div>
                {/* Full Name */}
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-300 font-sans">
                    Full Name
                  </label>
                  <Input
                    value={profile.full_name}
                    onChange={(e) =>
                      setProfile({ ...profile, full_name: e.target.value })
                    }
                    className="mt-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-400 rounded-2xl py-3 px-4 font-sans"
                    placeholder="Enter your name"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-300 font-sans">
                    Email
                  </label>
                  <Input
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="mt-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-400 rounded-2xl py-3 px-4 font-sans"
                    placeholder="Enter your email"
                  />
                </div>
                <motion.button
                  variants={{
                    hover: { scale: 1.03 },
                    tap: { scale: 0.97 },
                  }}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleUpdateProfile}
                  className="w-full bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white rounded-2xl py-3 font-sans flex items-center justify-center gap-2" // Thêm flex và gap
                  disabled={isLoading}
                >
                  <Save className="w-5 h-5" />{" "}
                  {/* Điều chỉnh kích thước icon */}
                  <span>{isLoading ? "Saving..." : "Save Profile"}</span>
                </motion.button>
              </div>
            </ScrollArea>
          </motion.div>

          {/* Application Settings Section */}
          <motion.div
            className="p-8 bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
            variants={cardVariants}
          >
            <div className="flex items-center mb-6">
              <SettingsIcon className="text-indigo-400 mr-3" size={22} />
              <h2 className="text-2xl font-medium text-gray-900 dark:text-white font-sans">
                Application Settings
              </h2>
            </div>
            <ScrollArea className="h-[340px]">
              <div className="space-y-8">
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {settings.darkMode ? (
                      <Moon className="text-indigo-400" size={20} />
                    ) : (
                      <Sun className="text-indigo-400" size={20} />
                    )}
                    <span className="text-gray-900 dark:text-white font-sans">
                      Dark Mode
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={() =>
                        setSettings({
                          ...settings,
                          darkMode: !settings.darkMode,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-12 h-7 bg-gray-200 rounded-full peer peer-checked:bg-indigo-500 transition-all duration-300"></div>
                    <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                  </label>
                </div>
                {/* Language */}
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-300 font-sans">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) =>
                      setSettings({ ...settings, language: e.target.value })
                    }
                    className="mt-2 w-full py-3 px-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none font-sans"
                  >
                    <option value="en">English</option>
                    <option value="vi">Vietnamese</option>
                  </select>
                </div>
                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white font-sans">
                    Enable Notifications
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications_enabled}
                      onChange={() =>
                        setSettings({
                          ...settings,
                          notifications_enabled:
                            !settings.notifications_enabled,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-12 h-7 bg-gray-200 rounded-full peer peer-checked:bg-indigo-500 transition-all duration-300"></div>
                    <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                  </label>
                </div>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleUpdateSettings}
                  className="w-full bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white rounded-2xl py-3 font-sans"
                  disabled={isLoading}
                >
                  <Save className="mr-2" size={18} />
                  {isLoading ? "Saving..." : "Save Settings"}
                </motion.button>
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
