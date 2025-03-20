import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Upload, Tag, Globe, Lock, Trash2 } from 'lucide-react';
import { deletePage } from '../../services/pageService';

const PageSettings = ({ page, onSave, updatePage, pageTags, setPageTags }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleDeletePage = async () => {
    try {
      await deletePage(page.id);
      setConfirmDelete(false);
      window.location.href = '/';
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => updatePage({ coverUrl: event.target.result });
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emoji) => {
    updatePage({ icon: emoji });
    setShowEmojiPicker(false);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && newTag.trim() && !pageTags.includes(newTag.trim())) {
      setPageTags([...pageTags, newTag.trim()]);
      setNewTag('');
      e.preventDefault();
    }
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

  const emojis = ['📄', '📝', '📌', '📊', '📈', '📉', '📋', '✏️', '📁', '🗂️', '📚', '💼', '🖥️', '📱', '🤖', '🔍', '💡', '⚙️'];

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Page Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Customize your page properties and settings</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Page Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
              value={page.title}
              onChange={(e) => updatePage({ title: e.target.value })}
              placeholder="Untitled"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Page Icon</label>
            <div className="flex items-center">
              <button className="border border-gray-300 dark:border-gray-600 rounded-md p-2 text-2xl" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                {page.icon}
              </button>
              <button className="ml-2 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <Smile size={16} className="mr-1" /> Change Icon
              </button>
            </div>
            {showEmojiPicker && (
              <div className="mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 shadow">
                <div className="grid grid-cols-6 gap-2">
                  {emojis.map((emoji) => (
                    <button key={emoji} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-xl" onClick={() => handleEmojiSelect(emoji)}>
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image</label>
            <div className="flex items-center">
              {page.coverUrl ? (
                <div className="relative w-24 h-12 overflow-hidden rounded-md">
                  <img src={page.coverUrl} alt="Cover" className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">No image</span>
                </div>
              )}
              <label className="ml-4 flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer text-sm">
                <Upload size={16} className="mr-1" /> Upload new cover
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {pageTags.map(tag => (
                <div key={tag} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-sm flex items-center">
                  <span className="mr-1">{tag}</span>
                  <button className="text-gray-500 hover:text-red-500" onClick={() => handleRemoveTag(tag)}>×</button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag"
              />
              <button className="px-3 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-500" onClick={handleAddTag}>
                <Tag size={16} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
            <button
              className={`flex items-center px-4 py-2 rounded-md text-sm ${page.isPublic ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
              onClick={() => updatePage({ isPublic: !page.isPublic })}
            >
              {page.isPublic ? (
                <>
                  <Globe size={16} className="mr-2" /> Public
                </>
              ) : (
                <>
                  <Lock size={16} className="mr-2" /> Private
                </>
              )}
            </button>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {page.isPublic ? 'Anyone with the link can view this page' : 'Only you can access this page'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={onSave}>
          Save Changes
        </button>
        {!confirmDelete ? (
          <button
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none"
            onClick={() => setConfirmDelete(true)}
          >
            Delete Page
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
              onClick={handleDeletePage}
            >
              <Trash2 size={16} className="mr-1" /> Confirm Delete
            </button>
            <button
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PageSettings;