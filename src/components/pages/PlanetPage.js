import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Plus, Filter, ExternalLink } from 'lucide-react';
import { getPublicTemplates, applyTemplate } from '../../services/templateService';
import workspaceService from '../../services/workspaceService'; // Thêm để lấy workspaces
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'; 
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { getWorkspacePages } from '../../services/pageService';

const PlanetPage = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false); // Modal chọn workspace/page
  const [workspaces, setWorkspaces] = useState([]); // Danh sách workspaces
  const [selectedTemplateId, setSelectedTemplateId] = useState(null); // Template được chọn để áp dụng

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Lấy danh sách template công khai từ backend
  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const templatesData = await getPublicTemplates({
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      });
      setTemplates(templatesData || []);
      setFilteredTemplates(templatesData || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      showNotification(`Failed to load templates: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật danh sách template khi thay đổi category
  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory]);

  // Lọc template theo search query
  useEffect(() => {
    let result = templates;
    if (searchQuery) {
      result = result.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredTemplates(result);
  }, [searchQuery, templates]);

  // Lấy danh sách workspaces khi mở modal
  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      const response = await workspaceService.getWorkspaces();
      const workspacesData = Array.isArray(response) ? response : response.data || [];
      console.log('Initial workspaces data:', workspacesData);
  
      const workspacesWithPages = await Promise.all(
        workspacesData.map(async (ws) => {
          try {
            const pagesResponse = await getWorkspacePages(ws.id);
            console.log(`Raw pages response for workspace ${ws.id}:`, pagesResponse); // Log chi tiết
  
            let pages = [];
            if (Array.isArray(pagesResponse)) {
              pages = pagesResponse;
            } else if (pagesResponse && Array.isArray(pagesResponse.rootPages)) {
              pages = pagesResponse.rootPages;
            } else if (pagesResponse && Array.isArray(pagesResponse.allPages)) {
              pages = pagesResponse.allPages;
            } else {
              console.warn(`Unexpected pages format for workspace ${ws.id}:`, pagesResponse);
            }
            return { ...ws, pages };
          } catch (error) {
            console.error(`Error fetching pages for workspace ${ws.id}:`, error);
            return { ...ws, pages: [] }; // Trả về mảng rỗng nếu lỗi
          }
        })
      );
      console.log('Workspaces with pages:', workspacesWithPages);
      setWorkspaces(workspacesWithPages);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      showNotification(`Failed to load workspaces: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi nhấn "Add to Workspace"
  const handleAddToWorkspace = (templateId) => {
    setSelectedTemplateId(templateId);
    fetchWorkspaces(); // Lấy danh sách workspaces
    setShowWorkspaceModal(true); // Mở modal
  };

  // Áp dụng template vào page đã chọn
  const handleApplyTemplate = async (pageId) => {
    console.log('Applying template:', { pageId, templateId: selectedTemplateId });
    setIsLoading(true);
    try {
      await applyTemplate(pageId, selectedTemplateId, { overwrite: false });
      showNotification('Template applied to page successfully');
      setShowWorkspaceModal(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      console.error('Error applying template:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      showNotification(`Failed to apply template: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'error': return 'bg-red-600';
      case 'warning': return 'bg-amber-600';
      default: return 'bg-indigo-600';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 28 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const categories = ['all', ...new Set(templates.map(t => t.category).filter(Boolean))];

  return (
    <div className="flex-1 min-h-screen bg-gray-50 text-gray-900">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Star className="text-indigo-600 w-8 h-8" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${getNotificationStyle(
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

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <motion.div
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Star className="mr-3 text-indigo-500" size={28} />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Template Planet
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-600">
            Explore and add templates to your workspace
          </p>
        </motion.div>

        {/* Search và Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-100 text-gray-900 placeholder-gray-500"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-600" />
            <select
              className="py-2 px-3 rounded-lg bg-gray-100 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Danh sách template */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <div className="h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {template.thumbnailUrl ? (
                    <img src={template.thumbnailUrl} alt={template.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Preview
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{template.description || 'No description'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                    {template.category || 'Uncategorized'}
                  </span>
                  <div className="flex gap-2">
                    <motion.button
                      className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddToWorkspace(template.id)}
                      title="Add to Workspace"
                    >
                      <Plus size={18} />
                    </motion.button>
                    <motion.button
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="View Details"
                    >
                      <ExternalLink size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-600">
              No templates found.
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal chọn workspace và page */}
      <Dialog open={showWorkspaceModal} onOpenChange={setShowWorkspaceModal}>
        <DialogContent className="bg-white rounded-lg p-6 max-w-md">
          <DialogHeader>
            <DialogTitle>Select a Page to Apply Template</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            {workspaces.length > 0 ? (
              workspaces.map((ws) => (
                <div key={ws.id} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{ws.name}</h3>
                  {ws.pages && ws.pages.length > 0 ? (
                    <ul className="ml-4 space-y-2">
                      {ws.pages.map((page) => (
                        <li key={page.id}>
                          <Button
                            variant="ghost"
                            className="w-full text-left justify-start text-gray-700 hover:bg-gray-100"
                            onClick={() => handleApplyTemplate(page.id)}
                          >
                            {page.title}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 ml-4">No pages available in this workspace</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No workspaces available</p>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWorkspaceModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanetPage;