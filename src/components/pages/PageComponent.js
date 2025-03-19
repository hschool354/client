import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Plus, Search, MoreHorizontal, Star, StarOff, Share2, 
  Image, Layout, ChevronDown, Trash2, Copy, Edit, Bookmark, Clock, 
  Eye, Calendar, Tag, Layers, Moon, Sun, Command, Palette, Menu
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { format } from 'date-fns';

const PageComponent = ({ workspaceId, initialPage = null }) => {
  // State management
  const [page, setPage] = useState(initialPage || {
    id: '',
    title: 'Untitled',
    icon: '📄',
    coverUrl: '',
    isPublic: false,
    blocks: []
  });
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [coverExpanded, setCoverExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentPages, setRecentPages] = useState([]);
  const [notification, setNotification] = useState(null);
  const [selectedTab, setSelectedTab] = useState('content');
  const [selectedEmoji, setSelectedEmoji] = useState('📄');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [focusedBlockId, setFocusedBlockId] = useState(null);
  const [pageHistory, setPageHistory] = useState([]);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [pageTags, setPageTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const dropdownRef = useRef(null);
  const titleRef = useRef(null);
  const { theme, setTheme } = useTheme();

  const emojis = ['📄', '📝', '📌', '📊', '📈', '📉', '🔍', '💡', '🚀', '🎯', '🏆', '✅', '⭐', '🔔', '📅', '💻', '🌐', '📱', '📂', '🔐'];
  
  // Sample page data - In real app, this would be fetched from your MongoDB and SQL database
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // Simulating API fetch delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // This would be replaced with actual API calls to your MongoDB for blocks
        // and SQL for page metadata
        setBlocks([
          { id: 'block-1', type: 'heading_1', content: 'Welcome to your new page', position: 0 },
          { id: 'block-2', type: 'text', content: 'This is a modern and beautiful page editor. Start typing to add content.', position: 1 },
          { id: 'block-3', type: 'bulleted_list', content: 'Organize your thoughts', position: 2 },
          { id: 'block-4', type: 'bulleted_list', content: 'Share with your team', position: 3 },
          { id: 'block-5', type: 'bulleted_list', content: 'Create beautiful documents', position: 4 },
          { id: 'block-6', type: 'divider', content: '', position: 5 },
          { id: 'block-7', type: 'text', content: 'Click anywhere and start typing...', position: 6 },
        ]);
        
        setRecentPages([
          { id: 'page-1', title: 'Project Roadmap', icon: '🗺️', updatedAt: '2025-03-18' },
          { id: 'page-2', title: 'Meeting Notes', icon: '📝', updatedAt: '2025-03-17' },
          { id: 'page-3', title: 'Product Ideas', icon: '💡', updatedAt: '2025-03-15' }
        ]);
        
        setPageHistory([
          { version: 3, editedBy: 'Alex Johnson', editedAt: '2025-03-18T14:30:00Z' },
          { version: 2, editedBy: 'Emma Davis', editedAt: '2025-03-17T09:15:00Z' },
          { version: 1, editedBy: 'You', editedAt: '2025-03-16T16:45:00Z' }
        ]);
        
        setPageTags(['documentation', 'project']);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching page data:', error);
        setNotification({
          type: 'error',
          message: 'Failed to load page data'
        });
        setLoading(false);
      }
    };
    
    fetchPageData();
  }, [workspaceId]);

  // Handle click outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Simulated save function - would connect to your SQL and MongoDB in production
  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Simulate saving delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In production: 
      // 1. Update page metadata in SQL database (pages table)
      // 2. Update blocks in MongoDB (blocks collection)
      
      setNotification({
        type: 'success',
        message: 'Page saved successfully'
      });
    } catch (error) {
      console.error('Error saving page:', error);
      setNotification({
        type: 'error',
        message: 'Failed to save page'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (e) => {
    setPage({ ...page, title: e.target.value });
  };

  const handleBlockChange = (id, content) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const handleAddBlock = (type, position) => {
    const newId = `block-${Date.now()}`;
    const newBlock = {
      id: newId,
      type: type || 'text',
      content: '',
      position: position + 1
    };
    
    const updatedBlocks = [
      ...blocks.slice(0, position + 1),
      newBlock,
      ...blocks.slice(position + 1).map(b => ({ ...b, position: b.position + 1 }))
    ];
    
    setBlocks(updatedBlocks);
    setTimeout(() => {
      setFocusedBlockId(newId);
    }, 100);
  };

  const handleDeleteBlock = (id) => {
    const blockIndex = blocks.findIndex(b => b.id === id);
    if (blockIndex < 0) return;
    
    const updatedBlocks = [
      ...blocks.slice(0, blockIndex),
      ...blocks.slice(blockIndex + 1).map(b => ({ ...b, position: b.position - 1 }))
    ];
    
    setBlocks(updatedBlocks);
    
    // Focus previous block if exists
    if (blockIndex > 0) {
      setFocusedBlockId(blocks[blockIndex - 1].id);
    } else if (updatedBlocks.length > 0) {
      setFocusedBlockId(updatedBlocks[0].id);
    }
  };

  const handleCoverUpload = () => {
    // In production, this would open a file picker and upload to your storage
    const sampleCoverUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop';
    setPage({ ...page, coverUrl: sampleCoverUrl });
  };

  const handleToggleStar = () => {
    setIsStarred(!isStarred);
    // In production, this would update the favorites table in your SQL database
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    setPage({ ...page, icon: emoji });
    setShowEmojiPicker(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !pageTags.includes(newTag.trim())) {
      setPageTags([...pageTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setPageTags(pageTags.filter(t => t !== tag));
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Block rendering helper
  const renderBlock = (block) => {
    const isFocused = focusedBlockId === block.id;
    
    switch (block.type) {
      case 'heading_1':
        return (
          <motion.div 
            className="block-wrapper relative group"
            variants={itemVariants}
            key={block.id}
          >
            <input
              className="w-full px-3 py-2 text-2xl font-bold bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
              value={block.content}
              onChange={(e) => handleBlockChange(block.id, e.target.value)}
              placeholder="Heading 1"
              onFocus={() => setFocusedBlockId(block.id)}
              autoFocus={isFocused}
            />
            <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => handleDeleteBlock(block.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => handleAddBlock('text', block.position)}
              >
                <Plus size={16} />
              </button>
            </div>
          </motion.div>
        );
        
      case 'text':
        return (
          <motion.div 
            className="block-wrapper relative group"
            variants={itemVariants}
            key={block.id}
          >
            <textarea
              className="w-full px-3 py-2 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md resize-none overflow-hidden"
              value={block.content}
              onChange={(e) => {
                handleBlockChange(block.id, e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder="Type something..."
              rows={1}
              onFocus={() => setFocusedBlockId(block.id)}
              autoFocus={isFocused}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddBlock('text', block.position);
                }
              }}
            />
            <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => handleDeleteBlock(block.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => handleAddBlock('text', block.position)}
              >
                <Plus size={16} />
              </button>
            </div>
          </motion.div>
        );
        
      case 'bulleted_list':
        return (
          <motion.div 
            className="block-wrapper relative group flex"
            variants={itemVariants}
            key={block.id}
          >
            <div className="pt-2 pr-2">•</div>
            <input
              className="flex-1 px-2 py-2 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
              value={block.content}
              onChange={(e) => handleBlockChange(block.id, e.target.value)}
              placeholder="List item"
              onFocus={() => setFocusedBlockId(block.id)}
              autoFocus={isFocused}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddBlock('bulleted_list', block.position);
                }
              }}
            />
            <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => handleDeleteBlock(block.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => handleAddBlock('bulleted_list', block.position)}
              >
                <Plus size={16} />
              </button>
            </div>
          </motion.div>
        );
        
      case 'divider':
        return (
          <motion.div 
            className="block-wrapper relative group py-2"
            variants={itemVariants}
            key={block.id}
          >
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => handleDeleteBlock(block.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => handleAddBlock('text', block.position)}
              >
                <Plus size={16} />
              </button>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  // Tab content rendering
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'content':
        return (
          <motion.div 
            className="flex-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {blocks.map(block => renderBlock(block))}
            
            <motion.button
              className="mt-4 flex items-center px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAddBlock('text', blocks.length - 1)}
            >
              <Plus size={16} className="mr-2" />
              Add block
            </motion.button>
          </motion.div>
        );
        
      case 'history':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Page History</h3>
              <div className="space-y-3">
                {pageHistory.map((history, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full p-2 mr-3">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Version {history.version}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Edited by {history.editedBy} • {format(new Date(history.editedAt), 'MMM d, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm">
                      View
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );
        
      case 'settings':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Page Settings</h3>
              
              <motion.div variants={itemVariants} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={page.title}
                  onChange={handleTitleChange}
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Icon
                </label>
                <div className="flex items-center">
                  <button
                    className="text-2xl border border-gray-300 dark:border-gray-600 rounded-md p-2 mr-2"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    {page.icon}
                  </button>
                  {showEmojiPicker && (
                    <div ref={dropdownRef} className="absolute z-10 mt-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-5 gap-2 max-w-xs">
                        {emojis.map((emoji, i) => (
                          <button
                            key={i}
                            className="text-2xl p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            onClick={() => handleEmojiSelect(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Click to change page icon
                  </span>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cover Image
                </label>
                <button
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={handleCoverUpload}
                >
                  <Image size={16} className="mr-2" />
                  {page.coverUrl ? 'Change Cover' : 'Add Cover'}
                </button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mb-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags
                  </label>
                  <button
                    className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                    onClick={() => setShowTagsInput(!showTagsInput)}
                  >
                    {showTagsInput ? 'Done' : 'Add Tags'}
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {pageTags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full px-3 py-1 text-sm"
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                      <button
                        className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                
                {showTagsInput && (
                  <div className="flex mt-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Add new tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button
                      className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                      onClick={handleAddTag}
                    >
                      Add
                    </button>
                  </div>
                )}
              </motion.div>
              
              <motion.div variants={itemVariants} className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    id="public-toggle"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={page.isPublic}
                    onChange={() => setPage({ ...page, isPublic: !page.isPublic })}
                  />
                  <label htmlFor="public-toggle" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Make this page public
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Public pages can be viewed by anyone with the link.
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 mr-2"
                >
                  Delete Page
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </motion.div>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <motion.header 
        className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Menu size={20} />
              </button>
              
              <div className="flex items-center space-x-2">
                <button 
                  className="text-2xl"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  {page.icon}
                </button>
                <input
                  ref={titleRef}
                  type="text"
                  className="text-lg font-medium border-0 focus:outline-none focus:ring-0 bg-transparent text-gray-900 dark:text-gray-100 w-auto"
                  placeholder="Untitled"
                  value={page.title}
                  onChange={handleTitleChange}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button 
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleToggleStar}
              >
                {isStarred ? <Star size={20} className="text-yellow-500" /> : <StarOff size={20} />}
              </button>
              
              <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Share2 size={20} />
              </button>
              
              <motion.button
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm:text-sm rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleSave}
                whileTap={{ scale: 0.95 }}
              >
                {saving ? 'Saving...' : 'Save'}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={notificationVariants}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Cover Image */}
        {page.coverUrl && (
          <motion.div
            className="relative mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div 
              className={`w-full rounded-xl overflow-hidden ${
                coverExpanded ? 'h-64' : 'h-40'
              } transition-all duration-300`}
            >
              <img 
                src={page.coverUrl} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <button 
                className="p-1 rounded-md bg-white/70 hover:bg-white/90 dark:bg-gray-800/70 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300"
                onClick={() => setCoverExpanded(!coverExpanded)}
              >
                <ChevronDown size={16} className={`transform transition-transform ${coverExpanded ? 'rotate-180' : ''}`} />
              </button>
              <button 
                className="p-1 rounded-md bg-white/70 hover:bg-white/90 dark:bg-gray-800/70 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300"
                onClick={handleCoverUpload}
              >
                <Image size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Page Title and Icon */}
        <motion.div 
          className="flex items-start space-x-3 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-4xl">
            {page.icon}
          </div>
          <div className="flex-1">
            <input
              className="w-full text-3xl font-bold bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-white"
              value={page.title}
              onChange={handleTitleChange}
              placeholder="Untitled Page"
              ref={titleRef}
            />
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Clock size={14} className="mr-1" />
              Last edited {format(new Date(), 'MMM d, yyyy')}
              
              {pageTags.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Tag size={14} className="mr-1" />
                    <div className="flex space-x-1">
                      {pageTags.map((tag, index) => (
                        <span key={index} className="text-indigo-600 dark:text-indigo-400">
                          #{tag}{index < pageTags.length - 1 && ","}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex border-b border-gray-200 dark:border-gray-700 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className={`px-4 py-2 text-sm font-medium ${
              selectedTab === 'content'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setSelectedTab('content')}
          >
            Content
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              selectedTab === 'history'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setSelectedTab('history')}
          >
            History
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              selectedTab === 'settings'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setSelectedTab('settings')}
          >
            Settings
          </button>
        </motion.div>

        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </main>

      {/* Bottom Toolbar */}
      <motion.div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-2"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Command size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
        <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Edit size={16} />
        </button>
        <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <FileText size={16} />
        </button>
        <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Image size={16} />
        </button>
        <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Layout size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
        <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Copy size={16} />
        </button>
        <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Bookmark size={16} />
        </button>
        <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Palette size={16} />
        </button>
      </motion.div>
    </div>
  );
};

// Missing X icon definition needed in the component
const X = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default PageComponent;