import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import io from 'socket.io-client';

// Components
import PageHeader from './PageHeader';
import PageCover from './PageCover';
import PageContent from './PageContent';
import PageHistory from './PageHistory';
import PageSettings from './PageSettings';
import Notification from '../shared/Notification';
import LoadingSpinner from '../shared/LoadingSpinner';

// Services
import { getPageContent, savePage, restorePageVersion } from '../../services/pageContentService';

// Animations
import { fadeVariants, containerVariants } from '../../utils/animations';

const socket = io('http://localhost:5000');

const PageComponent = ({ workspaceId, initialPage = null }) => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const [clientId] = useState(Math.random().toString(36).substring(2));

  const [page, setPage] = useState({
    id: initialPage?.id || '',
    title: initialPage?.title || 'Untitled',
    icon: initialPage?.icon || '📄',
    coverUrl: initialPage?.coverUrl || '',
    isPublic: initialPage?.isPublic || false,
  });
  const [blocks, setBlocks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedTab, setSelectedTab] = useState('content');
  const [isStarred, setIsStarred] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pageTags, setPageTags] = useState([]);

  const updatePage = (updates) => setPage((prev) => ({ ...prev, ...updates }));

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['pageContent', initialPage?.id],
    queryFn: () => {
      if (!initialPage?.id) throw new Error('Page ID is missing');
      return getPageContent(initialPage.id);
    },
    enabled: !!initialPage?.id,
  });

  useEffect(() => {
    if (initialPage?.id) {
      socket.emit('joinPage', initialPage.id);

      socket.on('blockUpdate', ({ blockId, content, type, style }) => {
        console.log(`Client B received blockUpdate: blockId=${blockId}, content=${content}, type=${type}, style=${style}`);
        setBlocks((prev) => {
          const newBlocks = prev.map((b) =>
            b.id === blockId
              ? {
                  ...b,
                  content: content !== undefined ? content : b.content,
                  type: type !== undefined ? type : b.type,
                  style: style !== undefined ? style : b.style,
                }
              : b
          );
          console.log('Client B updated blocks after blockUpdate:', newBlocks.filter(b => b.id === blockId));
          return [...newBlocks];
        });
      });

      socket.on('blockAdded', (block) => {
        console.log('Received blockAdded:', block);
        setBlocks((prev) => {
          if (prev.some((b) => b.id === block.id)) return prev;
          return [...prev, { ...block, style: block.style || { /* default style */ } }];
        });
      });

      socket.on('blockDeleted', (blockId) => {
        console.log(`Received blockDeleted: blockId=${blockId}`);
        setBlocks((prev) => prev.filter((b) => b.id !== blockId));
      });

      return () => {
        socket.off('blockUpdate');
        socket.off('blockAdded');
        socket.off('blockDeleted');
      };
    }
  }, [initialPage?.id]);

  useEffect(() => {
    if (data) {
      console.log('Raw response from getPageContent:', data);
      const blocksData = Array.isArray(data.blocks)
        ? data.blocks.map((block, index) => {
            console.log('Processing block:', block);
            const blockData = {
              id: block._id || block.id || `temp-${index}`,
              content: block.content || '',
              type: block.type || 'text',
              position: block.position ?? index,
              style: block.style || {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#000000',
                bold: false,
                italic: false,
                underline: false,
                align: 'left',
              },
            };
            blockData.style = {
              fontFamily: blockData.style.fontFamily || 'Arial',
              fontSize: blockData.style.fontSize || '16px',
              color: blockData.style.color || '#000000',
              bold: blockData.style.bold ?? false,
              italic: blockData.style.italic ?? false,
              underline: blockData.style.underline ?? false,
              align: blockData.style.align || 'left',
            };
            console.log('Mapped block:', blockData);
            return blockData;
          })
        : [];
      setBlocks(blocksData);

      if (data.page) {
        setPage((prev) => ({
          ...prev,
          title: data.page.title || prev.title,
          icon: data.page.icon || prev.icon,
          coverUrl: data.page.coverUrl || prev.coverUrl,
          isPublic: data.page.isPublic ?? prev.isPublic,
        }));
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setNotification({
        type: 'error',
        message: `Failed to load page content: ${error.message}`,
      });
      setBlocks([]);
    }
  }, [error]);

  const handleSave = () => {
    saveMutation.mutate({ pageData: page, blocks });
  };

  const saveMutation = useMutation({
    mutationFn: ({ pageData, blocks }) => savePage(pageData, blocks),
    onMutate: () => setSaving(true),
    onSuccess: () => {
      setSaving(false);
      setNotification({ type: 'success', message: 'Page saved successfully' });
      queryClient.invalidateQueries(['pageContent', initialPage?.id]);
    },
    onError: (error) => {
      setSaving(false);
      setNotification({ type: 'error', message: 'Failed to save page' });
    },
  });

  const handleRestore = async (version) => {
    try {
      await restorePageVersion(initialPage.id, version);
      await refetch({ throwOnError: true });
      setNotification({ type: 'success', message: `Restored to version ${version}` });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to restore version' });
    }
  };

  const toggleStar = () => setIsStarred((prev) => !prev);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'content':
        return (
          <PageContent
            page={page}
            blocks={blocks}
            setBlocks={setBlocks}
            socket={socket}
            setNotification={setNotification}
          />
        );
      case 'history':
        return <PageHistory page={page} setBlocks={setBlocks} onRestore={handleRestore} />;
      case 'settings':
        return (
          <PageSettings
            page={page}
            onSave={handleSave}
            updatePage={updatePage}
            pageTags={pageTags}
            setPageTags={setPageTags}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading || !initialPage?.id) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <PageHeader
        page={page}
        updatePage={updatePage}
        onSave={handleSave}
        saving={saving}
        isStarred={isStarred}
        toggleStar={toggleStar}
        setShowEmojiPicker={setShowEmojiPicker}
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
    </div>
  );
};

export default PageComponent;