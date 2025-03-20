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

import workspaceService from "../../services/workspaceService";
import {
  getWorkspacePages,
  createPage,
  deletePage,
  updatePage,
  addToFavorites,
  removeFromFavorites,
} from "../../services/pageService";

// shadcn/ui components
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";

const Sidebar = ({
  user,
  workspaces: initialWorkspaces,
  onNavClick,
  onPageSelect,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("computer");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [activePages, setActivePages] = useState([]);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showWorkspaceSelector, setShowWorkspaceSelector] = useState(false);
  const [showNewWorkspaceForm, setShowNewWorkspaceForm] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [showComputerSidebar, setShowComputerSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [workspaces, setWorkspaces] = useState(initialWorkspaces || []);
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState("");
  const MotionButton = motion(Button);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching workspaces...");
      const response = await workspaceService.getWorkspaces();
      console.log("Workspaces response:", response);

      // Check if response has a data property and if it's an array
      if (!response.data || !Array.isArray(response.data)) {
        console.error(
          "Expected array in response.data, got:",
          typeof response.data,
          response.data
        );
        setWorkspaces([]);
        return;
      }

      const workspacesData = response.data; // Extract the array from the data property
      setWorkspaces(workspacesData);
      console.log("Workspaces set in state:", workspacesData);

      // If there are workspaces and none selected yet
      if (workspacesData.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(workspacesData[0]);
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      if (error.response) {
        console.error(
          "Error response:",
          error.response.status,
          error.response.data
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      fetchWorkspacePages(selectedWorkspace.id);
    }
  }, [selectedWorkspace]);

  // Add this function to fetch pages
  // const fetchWorkspacePages = async (workspaceId) => {
  //   try {
  //     setIsLoading(true);
  //     const pages = await getWorkspacePages(workspaceId);
  //     console.log("Pages from getWorkspacePages:", pages);
  //     setActivePages(pages || []);
  //   } catch (error) {
  //     console.error("Error fetching workspace pages:", error);
  //     // You may want to add toast notification here
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchWorkspacePages = async (workspaceId) => {
    try {
      setIsLoading(true);
      const response = await getWorkspacePages(workspaceId);
      console.log("Raw pages response:", response);

      let pages = [];
      if (Array.isArray(response)) {
        pages = response; // Direct array response (unlikely based on logs)
      } else if (response && Array.isArray(response.rootPages)) {
        pages = response.rootPages; // Use rootPages for top-level pages
      } else if (response && Array.isArray(response.allPages)) {
        pages = response.allPages; // Use allPages if that's preferred
      } else {
        console.warn("Unexpected pages response format:", response);
      }

      setActivePages(pages);
      console.log("Set activePages to:", pages);
    } catch (error) {
      console.error("Error fetching workspace pages:", error);
      setActivePages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter pages based on search term
  console.log("activePages before filter:", activePages);
  const filteredPages = Array.isArray(activePages)
    ? activePages.filter((page) =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleCreateWorkspace = async () => {
    console.log("handleCreateWorkspace triggered");
    if (!newWorkspaceName.trim()) return;

    try {
      setIsLoading(true);
      const workspaceData = {
        name: newWorkspaceName.trim(),
        description:
          newWorkspaceDescription.trim() ||
          `Workspace for ${newWorkspaceName.trim()}`,
      };

      const createdWorkspace = await workspaceService.createWorkspace(
        workspaceData
      );
      console.log("Created workspace:", createdWorkspace);

      await fetchWorkspaces(); // Refresh toàn bộ danh sách
      setSelectedWorkspace(createdWorkspace); // Vẫn đặt workspace mới làm selected
      setNewWorkspaceName("");
      setNewWorkspaceDescription("");
      setShowWorkspaceModal(false);

      toast({
        title: "Success",
        description: `Workspace "${createdWorkspace.name}" created!`,
        variant: "success",
      });
    } catch (error) {
      console.error(
        "Error creating workspace:",
        error.response?.data || error.message
      );
      toast({
        title: "Error",
        description: error.message || "Failed to create workspace",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkspace = async (workspaceId) => {
    if (!workspaceId) return;

    try {
      setIsLoading(true);
      await workspaceService.deleteWorkspace(workspaceId);

      // Cập nhật state workspaces
      const updatedWorkspaces = workspaces.filter(
        (workspace) => workspace.id !== workspaceId
      );
      setWorkspaces(updatedWorkspaces);

      // Nếu workspace bị xóa là workspace đang được chọn, chọn workspace khác
      if (
        selectedWorkspace?.id === workspaceId &&
        updatedWorkspaces.length > 0
      ) {
        setSelectedWorkspace(updatedWorkspaces[0]);
      } else if (updatedWorkspaces.length === 0) {
        setSelectedWorkspace(null);
        setActivePages([]);
      }

      setShowWorkspaceSelector(false);
    } catch (error) {
      console.error("Error deleting workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWorkspace = async (id, updatedData) => {
    try {
      setIsLoading(true);
      const updatedWorkspace = await workspaceService.updateWorkspace(
        id,
        updatedData
      );

      // Cập nhật state workspaces
      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.map((workspace) =>
          workspace.id === id ? updatedWorkspace : workspace
        )
      );

      // Nếu workspace được update là workspace đang được chọn
      if (selectedWorkspace?.id === id) {
        setSelectedWorkspace(updatedWorkspace);
      }
    } catch (error) {
      console.error("Error updating workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    setShowWorkspaceSelector(false);
  };

  const handleCreatePage = async () => {
    if (!newPageTitle.trim() || !selectedWorkspace) return;

    try {
      setIsLoading(true);
      const pageData = {
        title: newPageTitle.trim(),
        icon: "📄", // Default icon
      };

      await createPage(selectedWorkspace.id, pageData);
      setNewPageTitle("");
      setShowNewPageModal(false);

      // Refresh pages list
      await fetchWorkspacePages(selectedWorkspace.id);
    } catch (error) {
      console.error("Error creating page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePage = async (pageId, event) => {
    // Stop event propagation to avoid triggering parent click events
    event.stopPropagation();

    if (!pageId) return;

    try {
      setIsLoading(true);
      await deletePage(pageId);

      // Refresh pages list
      if (selectedWorkspace) {
        await fetchWorkspacePages(selectedWorkspace.id);
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Only open computer sidebar when clicking on computer icon
    if (tab === "computer") {
      setShowComputerSidebar(!showComputerSidebar);
    } else {
      // Close computer sidebar when clicking other tabs
      setShowComputerSidebar(false);
    }

    // Call onNavClick with exact parameters
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
        className="h-screen bg-gradient-to-b from-sky-500 to-blue-600 text-white flex flex-col shadow-lg border-r border-sky-400/30 relative"
        initial={{ width: "72px" }}
        animate={{ width: "72px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Glass overlay for main sidebar - softer blur effect */}
        <div className="absolute inset-0 bg-white/15 backdrop-filter backdrop-blur-[2px] border-r border-white/15"></div>

        {/* Logo Area */}
        <div className="flex items-center justify-center h-16 border-b border-sky-400/30 relative z-10">
          <motion.div
            className="flex items-center"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white to-blue-200 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-sm font-bold text-blue-600">ND</span>
            </div>
          </motion.div>
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col items-center py-6 space-y-4 relative z-10">
          <TooltipProvider>
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
          </TooltipProvider>
        </div>

        {/* User Avatar (Bottom) */}
        <div className="mt-auto p-4 border-t border-sky-400/30 relative z-10">
          <motion.button
            className="flex items-center justify-center"
            onClick={() => setShowWorkspaceSelector(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-blue-200 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-2 ring-white/30"
              whileHover={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)" }}
            >
              <span className="text-sm font-bold text-blue-600">
                {user ? getInitials(user.full_name) : "U"}
              </span>
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* Computer Sidebar - Light, clean color scheme */}
      <AnimatePresence>
        {showComputerSidebar && (
          <motion.div
            className="h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 flex flex-col border-r border-blue-100 relative"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Glass overlay for secondary sidebar - softer effect */}
            <div className="absolute inset-0 bg-white/40 backdrop-filter backdrop-blur-sm"></div>

            {/* Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 -right-3 bg-gradient-to-r from-blue-400 to-sky-500 hover:from-blue-500 hover:to-sky-600 rounded-full p-1.5 shadow-lg z-10 border-none text-white"
              onClick={() => setShowComputerSidebar(false)}
              asChild
            >
              <motion.button
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={14} />
              </motion.button>
            </Button>

            {/* Current Workspace Title */}
            <div className="p-4 border-b border-blue-100 relative z-10">
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Folder size={16} className="text-blue-500 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  {selectedWorkspace?.name || "No Workspace"}
                </span>
              </motion.div>
            </div>

            {/* Search Box */}
            <div className="px-4 pt-4 relative z-10">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-2.5 text-blue-400"
                />
                <Input
                  type="text"
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-blue-100 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Pages List */}
            <div className="flex-1 relative z-10">
              <div className="px-4 pt-4 flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="text-xs font-medium text-blue-500 tracking-wider border-blue-200"
                >
                  PAGES
                </Badge>
                <MotionButton
                  variant="ghost"
                  size="icon"
                  className="p-1 rounded-md hover:bg-blue-100 text-blue-400 hover:text-blue-600"
                  onClick={() => {
                    console.log("Plus button clicked - opening new page modal"); // Debug
                    setShowNewPageModal(true);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={14} />
                </MotionButton>
              </div>

              <ScrollArea className="h-[calc(100vh-160px)] px-4 py-2">
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
                        <div
                          className="flex items-center w-full px-2 py-2 rounded-lg hover:bg-blue-100/70 text-left cursor-pointer"
                          onClick={() => {
                            console.log("Page selected:", page); // Debug
                            onPageSelect(page); // Gọi hàm onPageSelect truyền từ HomeContent
                          }}
                        >
                          <File
                            size={16}
                            className="text-blue-400 group-hover:text-blue-600 transition-colors min-w-4"
                          />
                          <span className="ml-2 text-sm truncate text-gray-700 group-hover:text-blue-800 transition-colors flex-1">
                            {page.title}
                          </span>

                          {/* Action buttons - only show on hover */}
                          <div className="hidden group-hover:flex space-x-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="p-1 rounded-md hover:bg-blue-200/80 text-blue-400 hover:text-blue-600"
                                  >
                                    <Eye size={14} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  className="bg-white text-blue-800 border-blue-100"
                                >
                                  <p className="text-xs">Preview</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="p-1 rounded-md hover:bg-blue-200/80 text-blue-400 hover:text-blue-600"
                                  >
                                    <Edit size={14} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  className="bg-white text-blue-800 border-blue-100"
                                >
                                  <p className="text-xs">Edit</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="p-1 rounded-md hover:bg-blue-200/80 text-blue-400 hover:text-blue-600"
                                    onClick={(e) =>
                                      handleDeletePage(page.id, e)
                                    }
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  className="bg-white text-blue-800 border-blue-100"
                                >
                                  <p className="text-xs">Delete</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </motion.li>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="text-blue-300 mb-2">
                        <File size={24} />
                      </div>
                      <p className="text-xs text-blue-400">
                        {searchTerm ? "No matching pages" : "No pages yet"}
                      </p>
                      <MotionButton
                        variant="outline"
                        className="mt-3 px-3 py-1.5 bg-gradient-to-r from-blue-400 to-sky-500 hover:from-blue-500 hover:to-sky-600 rounded-lg shadow-md text-xs text-white border-none flex items-center"
                        onClick={() => {
                          console.log("Opening new page modal");
                          setShowNewPageModal(true);
                        }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Plus size={12} />
                        <span className="ml-1">Add a page</span>
                      </MotionButton>
                    </div>
                  )}
                </ul>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace Selector Dialog - Clean white & blue theme */}
      <Dialog
        open={showWorkspaceSelector}
        onOpenChange={setShowWorkspaceSelector}
      >
        <DialogContent className="bg-white rounded-2xl p-6 border border-blue-100 shadow-xl backdrop-filter backdrop-blur-lg max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-blue-800">
              Select Workspace
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Choose a workspace from the list below or create a new one.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-60 pr-1">
            <div className="space-y-1 mt-2">
              {workspaces &&
              Array.isArray(workspaces) &&
              workspaces.length > 0 ? (
                workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    className="flex items-center justify-between group"
                  >
                    <motion.button
                      className={`flex items-center flex-1 px-3 py-2.5 rounded-xl text-left transition-all ${
                        selectedWorkspace?.id === workspace.id
                          ? "bg-gradient-to-r from-blue-400 to-sky-500 text-white shadow-lg shadow-blue-300/30"
                          : "hover:bg-blue-50 text-gray-700"
                      }`}
                      whileHover={{ x: 2 }}
                      onClick={() => handleSelectWorkspace(workspace)}
                    >
                      <Folder
                        size={16}
                        className={
                          selectedWorkspace?.id === workspace.id
                            ? "text-white"
                            : "text-blue-400"
                        }
                      />
                      <span className="ml-2 text-sm">{workspace.name}</span>
                    </motion.button>

                    {/* Add delete button */}
                    {workspaces.length > 1 && (
                      <MotionButton
                        variant="ghost"
                        size="icon"
                        className="p-1 rounded-md hover:bg-red-100 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          const confirmDelete = window.confirm(
                            `Are you sure you want to delete "${workspace.name}"?`
                          );
                          if (confirmDelete) {
                            handleDeleteWorkspace(workspace.id);
                          }
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={14} />
                      </MotionButton>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-blue-400 text-sm">
                  No workspaces available
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator className="my-4 bg-blue-100" />

          <MotionButton
            variant="secondary"
            className="flex items-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 w-full px-3 py-2.5 rounded-xl hover:shadow-md transition-all"
            onClick={() => {
              console.log("Opening new workspace form");
              setShowWorkspaceSelector(false);
              setShowNewWorkspaceForm(true);
            }}
            whileHover={{ x: 2, backgroundColor: "rgba(219, 234, 254, 1)" }}
          >
            <Plus size={16} className="text-blue-500 mr-2" />
            Create New Workspace
          </MotionButton>
        </DialogContent>
      </Dialog>

      {/* New Workspace Form Dialog */}
      <Dialog
        open={showNewWorkspaceForm}
        onOpenChange={setShowNewWorkspaceForm}
      >
        <DialogContent className="bg-white rounded-2xl p-6 border border-blue-100 shadow-xl backdrop-filter backdrop-blur-lg max-w-sm">
          <DialogHeader>
            <div className="flex items-center mb-3">
              <div className="mr-3 p-2.5 bg-blue-100 rounded-xl shadow-md">
                <FolderPlus size={20} className="text-blue-500" />
              </div>
              <DialogTitle className="text-lg font-semibold text-blue-800">
                Create New Workspace
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-gray-600">
              Fill in the details to create a new workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              type="text"
              className="w-full bg-white rounded-xl px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 border border-blue-100 placeholder-blue-300"
              placeholder="Workspace Name (e.g., My Test Workspace 10)"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              autoFocus
            />
            <Input
              type="text"
              className="w-full bg-white rounded-xl px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 border border-blue-100 placeholder-blue-300"
              placeholder="Description (e.g., This is a test workspace)"
              value={newWorkspaceDescription}
              onChange={(e) => setNewWorkspaceDescription(e.target.value)}
            />
          </div>

          <DialogFooter className="flex justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition-colors text-sm text-gray-600 border-blue-100"
              onClick={() => setShowNewWorkspaceForm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className={`px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-400 to-sky-500 hover:from-blue-500 hover:to-sky-600 transition-all text-sm font-medium shadow-md ${
                !newWorkspaceName.trim() || isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleCreateWorkspace}
              disabled={!newWorkspaceName.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Workspace Dialog - Clean white & blue theme */}
      <Dialog open={showWorkspaceModal} onOpenChange={setShowWorkspaceModal}>
        <DialogContent className="bg-white rounded-2xl p-6 border border-blue-100 shadow-xl backdrop-filter backdrop-blur-lg max-w-sm">
          <DialogHeader>
            <div className="flex items-center mb-3">
              <div className="mr-3 p-2.5 bg-blue-100 rounded-xl shadow-md">
                <FolderPlus size={20} className="text-blue-500" />
              </div>
              <DialogTitle className="text-lg font-semibold text-blue-800">
                Create Workspace
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-gray-600">
              Enter a name and optional description for your new workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              type="text"
              className="w-full bg-white rounded-xl px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 border border-blue-100 placeholder-blue-300"
              placeholder="Workspace Name"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              autoFocus
            />

            <Input
              type="text"
              className="w-full bg-white rounded-xl px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 border border-blue-100 placeholder-blue-300"
              placeholder="Description (optional)"
              value={newWorkspaceDescription}
              onChange={(e) => setNewWorkspaceDescription(e.target.value)}
            />
          </div>

          <DialogFooter className="flex justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition-colors text-sm text-gray-600 border-blue-100"
              onClick={() => setShowWorkspaceModal(false)}
              asChild
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </Button>

            <Button
              variant="default"
              className={`px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-400 to-sky-500 hover:from-blue-500 hover:to-sky-600 transition-all text-sm font-medium shadow-md ${
                !newWorkspaceName.trim() || isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleCreateWorkspace}
              disabled={!newWorkspaceName.trim() || isLoading}
              asChild
            >
              <motion.button
                whileHover={
                  newWorkspaceName.trim() && !isLoading
                    ? {
                        scale: 1.02,
                        boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                      }
                    : {}
                }
                whileTap={
                  newWorkspaceName.trim() && !isLoading ? { scale: 0.98 } : {}
                }
              >
                {isLoading ? "Creating..." : "Create"}
              </motion.button>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add this new page dialog near the end of the component */}
      <Dialog open={showNewPageModal} onOpenChange={setShowNewPageModal}>
        <DialogContent className="bg-white rounded-2xl p-6 border border-blue-100 shadow-xl backdrop-filter backdrop-blur-lg max-w-sm">
          <DialogHeader>
            <div className="flex items-center mb-3">
              <div className="mr-3 p-2.5 bg-blue-100 rounded-xl shadow-md">
                <File size={20} className="text-blue-500" />
              </div>
              <DialogTitle className="text-lg font-semibold text-blue-800">
                Create New Page
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-gray-600">
              Enter a title for your new page.
            </DialogDescription>
          </DialogHeader>

          <Input
            type="text"
            className="w-full bg-white rounded-xl px-4 py-3 mb-5 text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 border border-blue-100 placeholder-blue-300"
            placeholder="Page Title"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            autoFocus
          />

          <DialogFooter className="flex justify-end space-x-3">
            {/* Nút Cancel */}
            <MotionButton
              variant="outline"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition-colors text-sm text-gray-600 border-blue-100"
              onClick={() => {
                console.log("Cancel button clicked"); // Debug
                setShowNewPageModal(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </MotionButton>

            {/* Nút Create */}
            <MotionButton
              variant="default"
              className={`px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-400 to-sky-500 hover:from-blue-500 hover:to-sky-600 transition-all text-sm font-medium shadow-md ${
                !newPageTitle.trim() ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={() => {
                console.log("Create button clicked"); // Debug
                handleCreatePage();
              }}
              disabled={!newPageTitle.trim() || isLoading}
              whileHover={
                newPageTitle.trim() && !isLoading
                  ? {
                      scale: 1.02,
                      boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                    }
                  : {}
              }
              whileTap={
                newPageTitle.trim() && !isLoading ? { scale: 0.98 } : {}
              }
            >
              {isLoading ? "Creating..." : "Create"}
            </MotionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Enhanced Navigation Icon component with tooltip using shadcn/ui
const NavIcon = ({ icon, isActive, onClick, tooltip }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          className={`flex items-center justify-center p-3 rounded-xl transition-all ${
            isActive
              ? "bg-gradient-to-r from-blue-400 to-sky-500 shadow-md shadow-blue-500/30"
              : "hover:bg-white/20"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
        >
          <div
            className={`${
              isActive ? "text-white" : "text-white"
            } transition-colors`}
          >
            {icon}
          </div>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className="bg-white text-xs font-medium text-blue-800 border-blue-100"
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

export default Sidebar;
