import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Computer,
  Users,
  Globe,
  Settings,
  ChevronLeft,
  Plus,
  File,
  Folder,
  FolderPlus,
  Edit,
  Trash2,
  Eye,
  Moon,
  Sun,
  Search,
} from "lucide-react";

const Sidebar = ({ user, workspaces, onNavClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("computer");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [activePages, setActivePages] = useState([]);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showWorkspaceSelector, setShowWorkspaceSelector] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [showComputerSidebar, setShowComputerSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize selected workspace
  useEffect(() => {
    if (workspaces && workspaces.length > 0) {
      setSelectedWorkspace(workspaces[0]);
      setActivePages(workspaces[0].pages || []);
    }
  }, [workspaces]);

  // Update active pages when selected workspace changes
  useEffect(() => {
    if (selectedWorkspace) {
      setActivePages(selectedWorkspace.pages || []);
    }
  }, [selectedWorkspace]);

  // Filter pages based on search term
  const filteredPages = activePages.filter((page) =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      // This would typically be an API call
      console.log("Creating workspace:", newWorkspaceName);
      setNewWorkspaceName("");
      setShowWorkspaceModal(false);
    }
  };

  const handleSelectWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    setShowWorkspaceSelector(false);
  };

  // Trong file Sidebar.jsx
  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Chỉ mở computer sidebar khi bấm vào icon computer
    if (tab === "computer") {
      setShowComputerSidebar(!showComputerSidebar);
    } else {
      // Đóng computer sidebar khi bấm vào các tab khác
      setShowComputerSidebar(false);
    }

    // GỌI onNavClick với tham số chính xác
    if (onNavClick) {
      console.log("Calling onNavClick with:", tab);
      onNavClick(tab);
    }
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you'd apply the theme to the document here
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex h-full ${darkMode ? "dark" : ""}`}>
      {/* Main Sidebar */}
      <motion.div
        className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-lg border-r border-gray-800 dark:border-opacity-40 relative"
        initial={{ width: "72px" }}
        animate={{ width: "72px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Glass overlay for main sidebar */}
        <div className="absolute inset-0 bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm border-r border-white border-opacity-5"></div>

        {/* Logo Area */}
        <div className="flex items-center justify-center h-16 border-b border-gray-700 border-opacity-50 relative z-10">
          <motion.div
            className="flex items-center"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-sm font-bold">ND</span>
            </div>
          </motion.div>
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col items-center py-6 space-y-2 relative z-10">
          <NavIcon
            icon={<Computer size={20} />}
            isActive={activeTab === "computer"}
            onClick={() => handleTabClick("computer")}
            tooltip="Computer"
          />
          <NavIcon
            icon={<Users size={20} />}
            isActive={activeTab === "people"}
            onClick={() => handleTabClick("people")}
            tooltip="People"
          />
          <NavIcon
            icon={<Globe size={20} />}
            isActive={activeTab === "planet"}
            onClick={() => handleTabClick("planet")}
            tooltip="Planet"
          />
          <NavIcon
            icon={<Settings size={20} />}
            isActive={activeTab === "settings"}
            onClick={() => handleTabClick("settings")}
            tooltip="Settings"
          />

          {/* Dark mode toggle */}
          <NavIcon
            icon={darkMode ? <Sun size={20} /> : <Moon size={20} />}
            isActive={false}
            onClick={toggleDarkMode}
            tooltip={darkMode ? "Light Mode" : "Dark Mode"}
          />
        </div>

        {/* User Avatar (Bottom) */}
        <div className="mt-auto p-4 border-t border-gray-700 border-opacity-50 relative z-10">
          <motion.button
            className="flex items-center justify-center"
            onClick={() => setShowWorkspaceSelector(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-2 ring-white ring-opacity-10"
              whileHover={{ boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)" }}
            >
              <span className="text-sm font-bold">
                {user ? getInitials(user.full_name) : "U"}
              </span>
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* Computer Sidebar - Only shows pages */}
      <AnimatePresence>
        {showComputerSidebar && (
          <motion.div
            className="h-screen bg-gray-800 text-white flex flex-col border-r border-gray-700 dark:border-opacity-40 relative"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Glass overlay for secondary sidebar */}
            <div className="absolute inset-0 bg-white bg-opacity-3 backdrop-filter backdrop-blur-sm"></div>

            {/* Toggle Button */}
            <motion.button
              className="absolute top-4 -right-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-full p-1.5 shadow-lg shadow-purple-500/20 z-10"
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowComputerSidebar(false)}
            >
              <ChevronLeft size={14} />
            </motion.button>

            {/* Current Workspace Title */}
            <div className="p-4 border-b border-gray-700 border-opacity-50 relative z-10">
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Folder size={16} className="text-purple-400 mr-2" />
                <span className="text-sm font-medium text-white">
                  {selectedWorkspace?.name || "No Workspace"}
                </span>
              </motion.div>
            </div>

            {/* Search Box */}
            <div className="px-4 pt-4 relative z-10">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 border-opacity-50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Pages List */}
            <div className="flex-1 overflow-y-auto p-4 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400 tracking-wider">
                  PAGES
                </span>
                <motion.button
                  className="p-1 rounded-md hover:bg-gray-700 hover:bg-opacity-50 text-gray-400 hover:text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={14} />
                </motion.button>
              </div>

              <ul className="space-y-1">
                {filteredPages.length > 0 ? (
                  filteredPages.map((page) => (
                    <motion.li
                      key={page.id}
                      className="group"
                      whileHover={{ x: 2 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="flex items-center w-full px-2 py-2 rounded-lg hover:bg-gray-700 hover:bg-opacity-50 text-left">
                        <File
                          size={16}
                          className="text-gray-400 group-hover:text-purple-400 transition-colors min-w-4"
                        />
                        <span className="ml-2 text-sm truncate text-gray-300 group-hover:text-white transition-colors flex-1">
                          {page.title}
                        </span>

                        {/* Action buttons - only show on hover */}
                        <div className="hidden group-hover:flex space-x-1">
                          <motion.button
                            className="p-1 rounded-md hover:bg-gray-600 text-gray-400 hover:text-white"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Eye size={14} />
                          </motion.button>
                          <motion.button
                            className="p-1 rounded-md hover:bg-gray-600 text-gray-400 hover:text-white"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit size={14} />
                          </motion.button>
                          <motion.button
                            className="p-1 rounded-md hover:bg-gray-600 text-gray-400 hover:text-white"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.li>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-gray-500 mb-2">
                      <File size={24} />
                    </div>
                    <p className="text-xs text-gray-500">
                      {searchTerm ? "No matching pages" : "No pages yet"}
                    </p>
                    <motion.button
                      className="mt-3 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-lg shadow-md text-xs text-white flex items-center"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={12} />
                      <span className="ml-1">Add a page</span>
                    </motion.button>
                  </div>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace Selector Modal */}
      <AnimatePresence>
        {showWorkspaceSelector && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWorkspaceSelector(false)}
          >
            <motion.div
              className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 w-80 border border-gray-700 border-opacity-60 shadow-2xl backdrop-filter backdrop-blur-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Select Workspace
                </h2>
              </div>

              <div className="space-y-1 mt-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {workspaces &&
                  workspaces.map((workspace) => (
                    <motion.button
                      key={workspace.id}
                      className={`flex items-center w-full px-3 py-2.5 rounded-xl text-left transition-all ${
                        selectedWorkspace?.id === workspace.id
                          ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/20"
                          : "hover:bg-gray-700 hover:bg-opacity-50 text-gray-300"
                      }`}
                      whileHover={{ x: 2 }}
                      onClick={() => handleSelectWorkspace(workspace)}
                    >
                      <Folder
                        size={16}
                        className={
                          selectedWorkspace?.id === workspace.id
                            ? "text-white"
                            : "text-gray-400"
                        }
                      />
                      <span className="ml-2 text-sm">{workspace.name}</span>
                    </motion.button>
                  ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-700 border-opacity-50">
                <motion.button
                  className="flex items-center text-sm bg-gray-700 bg-opacity-40 hover:bg-opacity-70 text-gray-200 w-full px-3 py-2.5 rounded-xl hover:shadow-md transition-all"
                  whileHover={{
                    x: 2,
                    backgroundColor: "rgba(75, 85, 99, 0.7)",
                  }}
                  onClick={() => {
                    setShowWorkspaceSelector(false);
                    setShowWorkspaceModal(true);
                  }}
                >
                  <Plus size={16} className="text-purple-400" />
                  <span className="ml-2">Create New Workspace</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Workspace Modal */}
      <AnimatePresence>
        {showWorkspaceModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWorkspaceModal(false)}
          >
            <motion.div
              className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 w-80 border border-gray-700 border-opacity-60 shadow-2xl backdrop-filter backdrop-blur-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-5">
                <div className="mr-3 p-2.5 bg-gradient-to-br from-purple-500 to-blue-500 bg-opacity-20 rounded-xl shadow-lg shadow-purple-500/10">
                  <FolderPlus size={20} className="text-purple-300" />
                </div>
                <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Create Workspace
                </h2>
              </div>
              <input
                type="text"
                className="w-full bg-gray-700 bg-opacity-60 rounded-xl px-4 py-3 mb-5 text-white outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 border-opacity-50 placeholder-gray-400"
                placeholder="Workspace Name"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <motion.button
                  className="px-4 py-2.5 rounded-xl bg-gray-700 bg-opacity-60 hover:bg-opacity-80 transition-colors text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowWorkspaceModal(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className={`px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all text-sm font-medium shadow-md shadow-purple-500/20 ${
                    !newWorkspaceName.trim()
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  whileHover={
                    newWorkspaceName.trim()
                      ? {
                          scale: 1.02,
                          boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
                        }
                      : {}
                  }
                  whileTap={newWorkspaceName.trim() ? { scale: 0.98 } : {}}
                  onClick={handleCreateWorkspace}
                  disabled={!newWorkspaceName.trim()}
                >
                  Create
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Navigation Icon component with tooltip
const NavIcon = ({ icon, isActive, onClick, tooltip }) => {
  return (
    <div className="relative group">
      <motion.button
        className={`flex items-center justify-center p-3 rounded-xl transition-all ${
          isActive
            ? "bg-gradient-to-r from-purple-600 to-blue-500 shadow-md shadow-purple-500/20"
            : "hover:bg-gray-700 hover:bg-opacity-30"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        <div
          className={`${
            isActive ? "text-white" : "text-gray-400"
          } transition-colors`}
        >
          {icon}
        </div>
      </motion.button>

      {/* Tooltip */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-xs font-medium text-white rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-20">
        {tooltip}
      </div>
    </div>
  );
};

// Add this to your global CSS for custom scrollbar
const CustomScrollbarStyles = () => (
  <style jsx global>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(31, 41, 55, 0.5);
      border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(139, 92, 246, 0.5);
      border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(139, 92, 246, 0.7);
    }
  `}</style>
);

export default Sidebar;
