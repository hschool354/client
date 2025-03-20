import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { usePageStore } from '../../stores/pageStore';
import { useTheme } from 'next-themes';

// Components
import PageHeader from './PageHeader';
import PageCover from './PageCover';
import PageContent from './PageContent';
import PageHistory from './PageHistory';
import PageSettings from './PageSettings';
import Notification from '../shared/Notification';
import LoadingSpinner from '../shared/LoadingSpinner';
import BottomToolbar from './BottomToolbar';

// Services
import { getPageContent, savePage } from '../../services/pageContentService';

// Animations
import { fadeVariants, containerVariants } from '../../utils/animations';

const PageComponent = ({ workspaceId, initialPage = null }) => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  
  // Zustand store
  const { 
    page, 
    blocks, 
    loading, 
    saving,
    notification,
    selectedTab,
    isStarred,
    setPage,
    setBlocks,
    setLoading,
    setSaving,
    setNotification,
    setSelectedTab,
    setIsStarred,
    toggleStar,
    init
  } = usePageStore();

  // Fetch page data using React Query
  const { isLoading } = useQuery(
    ['pageContent', initialPage?.id],
    () => getPageContent(initialPage?.id),
    {
      enabled: !!initialPage?.id,
      onSuccess: (data) => {
        init({
          page: {
            id: initialPage.id,
            title: initialPage.title || 'Untitled',
            icon: initialPage.icon || '📄',
            coverUrl: initialPage.coverUrl || '',
            isPublic: initialPage.isPublic || false,
          },
          blocks: data.blocks || [],
          pageHistory: data.history || [],
          pageTags: data.tags || [],
          recentPages: [], // Có thể cần API riêng để lấy recent pages
        });
        setLoading(false);
      },
      onError: (error) => {
        setNotification({
          type: 'error',
          message: 'Failed to load page content',
        });
        setLoading(false);
      },
    }
  );

  // Save page mutation
  const saveMutation = useMutation(
    ({ pageData, blocks }) => savePage(pageData, blocks),
    {
      onMutate: () => setSaving(true),
      onSuccess: () => {
        setSaving(false);
        setNotification({
          type: 'success',
          message: 'Page saved successfully',
        });
        queryClient.invalidateQueries(['pageContent', initialPage?.id]);
      },
      onError: (error) => {
        setSaving(false);
        setNotification({
          type: 'error',
          message: 'Failed to save page',
        });
      },
    }
  );

  // Initialize with initialPage if provided
  useEffect(() => {
    if (initialPage && !blocks.length) {
      setPage({
        id: initialPage.id,
        title: initialPage.title || 'Untitled',
        icon: initialPage.icon || '📄',
        coverUrl: initialPage.coverUrl || '',
        isPublic: initialPage.isPublic || false,
      });
      setLoading(false);
    }
  }, [initialPage, setPage, setLoading, blocks.length]);

  const handleSave = () => {
    saveMutation.mutate({ pageData: page, blocks });
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'content':
        return <PageContent />;
      case 'history':
        return <PageHistory />;
      case 'settings':
        return <PageSettings onSave={handleSave} />;
      default:
        return null;
    }
  };

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <PageHeader 
        onSave={handleSave} 
        saving={saving}
        isStarred={isStarred}
        toggleStar={toggleStar}
      />
      <AnimatePresence>
        {notification && (
          <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification(null)} 
          />
        )}
      </AnimatePresence>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {page.coverUrl && <PageCover />}
        <motion.div 
          className="flex border-b border-gray-200 dark:border-gray-700 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'content' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            onClick={() => setSelectedTab('content')}
          >
            Content
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'history' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            onClick={() => setSelectedTab('history')}
          >
            History
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'settings' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            onClick={() => setSelectedTab('settings')}
          >
            Settings
          </button>
        </motion.div>
        <div className="mt-6">{renderTabContent()}</div>
      </main>
      <BottomToolbar />
    </div>
  );
};

export default PageComponent;