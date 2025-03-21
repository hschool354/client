import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Menu, Star, StarOff, Share2, Sun, Moon } from 'lucide-react';
import { Tooltip } from '../shared/Tooltip';
import { useState, useEffect } from 'react'; 
import favoritesService from '../../services/favoritesService'; 

const PageHeader = ({ page, updatePage, onSave, saving, isStarred, toggleStar, setShowEmojiPicker }) => {
  const { theme, setTheme } = useTheme();
  const titleRef = useRef(null);
  const [isFavorite, setIsFavorite] = useState(isStarred);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorites = await favoritesService.getFavorites();
        const isPageFavorite = favorites.some(fav => fav.pageId === page.id);
        setIsFavorite(isPageFavorite);
        // Đồng bộ với isStarred từ parent nếu cần
        if (isPageFavorite !== isStarred) {
          toggleStar(); // Cập nhật trạng thái từ parent nếu khác
        }
      } catch (error) {
        console.error('Error checking favorite status:', error.message);
        setIsFavorite(isStarred); // Dùng giá trị từ props nếu lỗi
      }
    };
    checkFavoriteStatus();
  }, [page.id, toggleStar, isStarred]); // Chạy lại khi page.id hoặc isStarred thay đổi

  // Hàm xử lý toggle favorite
  const handleToggleStar = async () => {
    try {
      if (isFavorite) {
        await favoritesService.removeFavorite(page.id);
        console.log(`Removed page ${page.id} from favorites`);
        setIsFavorite(false); // Cập nhật trạng thái local
      } else {
        await favoritesService.addFavorite(page.id);
        console.log(`Added page ${page.id} to favorites`);
        setIsFavorite(true); // Cập nhật trạng thái local
      }
      toggleStar(); // Cập nhật trạng thái từ parent
    } catch (error) {
      console.error('Error toggling favorite:', error.message);
      alert(`Failed to update favorites: ${error.message}`);
    }
  };

  return (
    <motion.header
      className="sticky top-0 bg-white dark:bg-gray-800 z-10 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Tooltip content="Menu">
              <button
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Menu"
              >
                <Menu size={20} />
              </button>
            </Tooltip>
            <div className="flex items-center space-x-2 ml-4">
              <button
                className="text-2xl"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                aria-label="Change icon"
              >
                {page.icon}
              </button>
              <input
                ref={titleRef}
                type="text"
                className="text-lg font-medium border-0 focus:outline-none focus:ring-0 bg-transparent text-gray-900 dark:text-gray-100 w-auto"
                placeholder="Untitled"
                value={page.title}
                onChange={(e) => updatePage({ title: e.target.value })}
                aria-label="Page title"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip content={theme === "dark" ? "Light mode" : "Dark mode"}>
              <button
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </Tooltip>
            <Tooltip
              content={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <button
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleToggleStar}
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                {isFavorite ? (
                  <Star size={20} className="text-yellow-500" />
                ) : (
                  <StarOff size={20} />
                )}
              </button>
            </Tooltip>
            <Tooltip content="Share">
              <button
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Share"
              >
                <Share2 size={20} />
              </button>
            </Tooltip>
            <motion.button
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onSave}
              whileTap={{ scale: 0.95 }}
              disabled={saving}
              aria-label="Save page"
            >
              {saving ? "Saving..." : "Save"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default PageHeader;