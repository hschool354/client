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
  Copy,
  Star,
  LogOut,
} from "lucide-react";

import workspaceService from "../../services/workspaceService";
import {
  getWorkspacePages,
  createPage,
  deletePage,
  updatePage,
  addToFavorites,
  removeFromFavorites,
  duplicatePage,
} from "../../services/pageService";
import favoritesService from "../../services/favoritesService";
import userProfileService from "../../services/userProfileService";
import authService from "../../services/authService";

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
import { useNavigate } from "react-router-dom";

const avatarColors = [
  "bg-gradient-to-br from-red-400 to-pink-500",
  "bg-gradient-to-br from-blue-400 to-cyan-500",
  "bg-gradient-to-br from-green-400 to-teal-500",
  "bg-gradient-to-br from-purple-400 to-indigo-500",
  "bg-gradient-to-br from-yellow-400 to-orange-500",
];

const Sidebar = ({
  user,
  workspaces: initialWorkspaces,
  selectedWorkspace,
  onWorkspaceSelect,
  onNavClick,
  onPageSelect,
  activeTab,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [isExpanded] = useState(true); // Sidebar chính luôn mở
  const [activePages, setActivePages] = useState([]);
  const [favoritePages, setFavoritePages] = useState([]);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showWorkspaceSelector, setShowWorkspaceSelector] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [showComputerSidebar, setShowComputerSidebar] = useState(
    !!selectedWorkspace
  ); // Mở nếu có selectedWorkspace
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [workspaces, setWorkspaces] = useState(initialWorkspaces || []);
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const MotionButton = motion(Button);

  useEffect(() => {
    fetchWorkspaces();
    fetchFavorites();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      setShowComputerSidebar(true); // Tự động mở khi có selectedWorkspace
      fetchWorkspacePages(selectedWorkspace.id);
    } else {
      setShowComputerSidebar(false);
      setActivePages([]);
    }
  }, [selectedWorkspace]);

  const fetchUserProfile = async () => {
    try {
      const profile = await userProfileService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
      setUserProfile(null);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching workspaces...");
      const response = await workspaceService.getWorkspaces();
      console.log("Workspaces response:", response);

      if (!response.data || !Array.isArray(response.data)) {
        console.error(
          "Expected array in response.data, got:",
          typeof response.data,
          response.data
        );
        setWorkspaces([]);
        return;
      }

      const workspacesData = response.data;
      setWorkspaces(workspacesData);
      console.log("Workspaces set in state:", workspacesData);
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

  const fetchWorkspacePages = async (workspaceId) => {
    try {
      setIsLoading(true);
      const response = await getWorkspacePages(workspaceId);
      console.log("Raw pages response:", response);

      let pages = [];
      if (Array.isArray(response)) {
        pages = response;
      } else if (response && Array.isArray(response.rootPages)) {
        pages = response.rootPages;
      } else if (response && Array.isArray(response.allPages)) {
        pages = response.allPages;
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

  const fetchFavorites = async () => {
    try {
      const favorites = await favoritesService.getFavorites();
      setFavoritePages(favorites);
      console.log("Favorite pages:", favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavoritePages([]);
    }
  };

  const filteredPages = Array.isArray(activePages)
    ? activePages.filter((page) =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleCreateWorkspace = async () => {
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

      await fetchWorkspaces();
      onWorkspaceSelect(createdWorkspace);
      navigate(`/workspace/${createdWorkspace.id}`);
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

      const updatedWorkspaces = workspaces.filter(
        (workspace) => workspace.id !== workspaceId
      );
      setWorkspaces(updatedWorkspaces);

      if (selectedWorkspace?.id === workspaceId) {
        const newSelected =
          updatedWorkspaces.length > 0 ? updatedWorkspaces[0] : null;
        onWorkspaceSelect(newSelected);
        navigate(newSelected ? `/workspace/${newSelected.id}` : "/home");
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

      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.map((workspace) =>
          workspace.id === id ? updatedWorkspace : workspace
        )
      );

      if (selectedWorkspace?.id === id) {
        onWorkspaceSelect(updatedWorkspace);
        navigate(`/workspace/${updatedWorkspace.id}`);
      }
    } catch (error) {
      console.error("Error updating workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectWorkspace = (workspace) => {
    onWorkspaceSelect(workspace);
    setShowWorkspaceSelector(false);
    navigate(`/workspace/${workspace.id}`);
  };

  const handleCreatePage = async () => {
    if (!newPageTitle.trim() || !selectedWorkspace) return;

    try {
      setIsLoading(true);
      const pageData = {
        title: newPageTitle.trim(),
        icon: "📄",
      };

      const newPage = await createPage(selectedWorkspace.id, pageData);
      setNewPageTitle("");
      setShowNewPageModal(false);

      await fetchWorkspacePages(selectedWorkspace.id);
      onPageSelect(newPage);
      navigate(`/workspace/${selectedWorkspace.id}/page/${newPage.id}`);
    } catch (error) {
      console.error("Error creating page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePage = async (pageId, event) => {
    event.stopPropagation();

    if (!pageId) return;

    try {
      setIsLoading(true);
      await deletePage(pageId);

      if (selectedWorkspace) {
        await fetchWorkspacePages(selectedWorkspace.id);
      }
      navigate(`/workspace/${selectedWorkspace.id}`);
    } catch (error) {
      console.error("Error deleting page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicatePage = async (pageId, event) => {
    event.stopPropagation(); // Ngăn sự kiện click lan ra ngoài

    if (!pageId || !selectedWorkspace) return;

    try {
      setIsLoading(true);
      const duplicatedPage = await duplicatePage(pageId); // Gọi API nhân bản trang
      console.log("Duplicated page:", duplicatedPage);

      // Cập nhật danh sách trang
      await fetchWorkspacePages(selectedWorkspace.id);

      // Điều hướng đến trang vừa nhân bản
      onPageSelect(duplicatedPage);
      navigate(`/workspace/${selectedWorkspace.id}/page/${duplicatedPage.id}`);

      toast({
        title: "Success",
        description: `Page "${duplicatedPage.title}" duplicated!`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error duplicating page:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    if (tab === "computer") {
      setShowComputerSidebar(!showComputerSidebar);
    } else {
      setShowComputerSidebar(false);
    }

    if (onNavClick) {
      console.log("Calling onNavClick with:", tab);
      onNavClick(tab);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Success",
        description: "You have been logged out.",
        variant: "success",
      });
      navigate("/login"); 
    } catch (error) {
      console.error("Error during logout:", error.message);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRandomAvatarColor = () => {
    const randomIndex = Math.floor(Math.random() * avatarColors.length);
    return avatarColors[randomIndex];
  };

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
            <NavIcon
              icon={darkMode ? <Sun size={20} /> : <Moon size={20} />}
              isActive={false}
              onClick={toggleDarkMode}
              tooltip={darkMode ? "Light Mode" : "Dark Mode"}
            />
            <NavIcon
              icon={<LogOut size={20} />}
              isActive={false}
              onClick={handleLogout}
              tooltip="Logout"
            />
          </TooltipProvider>
        </div>

        <div className="mt-auto p-4 border-t border-sky-400/30 relative z-10">
          <motion.button
            className="flex items-center justify-center"
            onClick={() => setShowWorkspaceSelector(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 ring-2 ring-white/30 ${
                userProfile?.avatar_base64 ? "" : getRandomAvatarColor()
              }`}
              whileHover={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)" }}
            >
              {userProfile?.avatar_base64 ? (
                <img
                  src={`data:image/jpeg;base64,${userProfile.avatar_base64}`}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-white">
                  {userProfile?.full_name
                    ? getInitials(userProfile.full_name)
                    : "U"}
                </span>
              )}
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* Computer Sidebar */}
      <AnimatePresence>
        {showComputerSidebar && (
          <motion.div
            className="h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 flex flex-col border-r border-blue-100 relative"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-white/40 backdrop-filter backdrop-blur-sm"></div>

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

            <div className="p-4 border-b border-blue-100 relative z-10">
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center">
                  <Folder size={16} className="text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    {selectedWorkspace?.name || "No Workspace Selected"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => setShowWorkspaceSelector(true)}
                >
                  Switch
                </Button>
              </motion.div>
            </div>

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

            <div className="flex-1 relative z-10">
              {/* Favorites Section */}
              <div className="px-4 pt-4 flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="text-xs font-medium text-yellow-500 tracking-wider border-yellow-200"
                >
                  FAVORITES
                </Badge>
              </div>
              <ScrollArea className="h-[20vh] px-4 py-2">
                {favoritePages.length > 0 ? (
                  <ul className="space-y-1">
                    {favoritePages.map((page) => (
                      <motion.li
                        key={page.pageId}
                        className="group"
                        whileHover={{ x: 2 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <div
                          className="flex items-center w-full px-2 py-2 rounded-lg hover:bg-yellow-100/70 text-left cursor-pointer"
                          onClick={() =>
                            onPageSelect({ id: page.pageId, title: page.title })
                          }
                        >
                          <Star
                            size={16}
                            className="text-yellow-400 group-hover:text-yellow-600 transition-colors min-w-4"
                          />
                          <span className="ml-2 text-sm truncate text-gray-700 group-hover:text-yellow-800 transition-colors flex-1">
                            {page.title}
                          </span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="text-yellow-300 mb-2">
                      <Star size={24} />
                    </div>
                    <p className="text-xs text-yellow-400">
                      No favorite pages yet
                    </p>
                  </div>
                )}
              </ScrollArea>
              <Separator className="my-2 bg-blue-100" />{" "}
              {/* Thêm đường phân cách */}
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
                  onClick={() => setShowNewPageModal(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={14} />
                </MotionButton>
              </div>
              <ScrollArea className="h-[calc(100vh-160px)] px-4 py-2">
                {selectedWorkspace ? (
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
                            onClick={() => onPageSelect(page)}
                          >
                            <File
                              size={16}
                              className="text-blue-400 group-hover:text-blue-600 transition-colors min-w-4"
                            />
                            <span className="ml-2 text-sm truncate text-gray-700 group-hover:text-blue-800 transition-colors flex-1">
                              {page.title}
                            </span>
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
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="p-1 rounded-md hover:bg-blue-200/80 text-blue-400 hover:text-blue-600"
                                      onClick={(e) =>
                                        handleDuplicatePage(page.id, e)
                                      } // Thêm nút Duplicate
                                    >
                                      <Copy size={14} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="bottom"
                                    className="bg-white text-blue-800 border-blue-100"
                                  >
                                    <p className="text-xs">Duplicate</p>
                                  </TooltipContent>
                                </Tooltip>
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
                          onClick={() => setShowNewPageModal(true)}
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
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-xs text-blue-400">
                      Please select a workspace
                    </p>
                    <MotionButton
                      variant="outline"
                      className="mt-3 px-3 py-1.5 bg-gradient-to-r from-blue-400 to-sky-500 hover:from-blue-500 hover:to-sky-600 rounded-lg shadow-md text-xs text-white border-none flex items-center"
                      onClick={() => setShowWorkspaceSelector(true)}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={12} />
                      <span className="ml-1">Select Workspace</span>
                    </MotionButton>
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace Selector Dialog */}
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
              setShowWorkspaceSelector(false);
              setShowWorkspaceModal(true);
            }}
            whileHover={{ x: 2, backgroundColor: "rgba(219, 234, 254, 1)" }}
          >
            <Plus size={16} className="text-blue-500 mr-2" />
            Create New Workspace
          </MotionButton>
        </DialogContent>
      </Dialog>

      {/* New Workspace Modal */}
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
            <motion.button
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition-colors text-sm text-gray-600 border border-blue-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWorkspaceModal(false)}
            >
              Cancel
            </motion.button>
            <motion.button
              className={`px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-400 to-sky-500 text-white text-sm font-medium shadow-md transition-all ${
                !newWorkspaceName.trim() || isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-blue-500 hover:to-sky-600"
              }`}
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
              onClick={handleCreateWorkspace}
              disabled={!newWorkspaceName.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Page Modal */}
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
            <MotionButton
              variant="outline"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition-colors text-sm text-gray-600 border-blue-100"
              onClick={() => setShowNewPageModal(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </MotionButton>
            <MotionButton
              variant="default"
              className={`px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-400 to-sky-500 hover:from-blue-500 hover:to-sky-600 transition-all text-sm font-medium shadow-md ${
                !newPageTitle.trim() || isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleCreatePage}
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

// Enhanced Navigation Icon component
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
