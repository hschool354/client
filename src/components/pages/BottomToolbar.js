import React from 'react';
import { motion } from 'framer-motion';
import { usePageStore } from '../../stores/pageStore';

// Import icons
import { 
  CodeIcon, // Replaced CommandLineIcon with CodeIcon
  PencilIcon, 
  DocumentTextIcon, 
  CameraIcon, // Replaced PhotoIcon with CameraIcon
  ViewGridIcon, // Replaced ViewColumnsIcon with ViewGridIcon
  ClipboardCopyIcon,
  BookmarkIcon,
  ColorSwatchIcon, // Replaced PaletteIcon with ColorSwatchIcon
  PlusIcon
} from '@heroicons/react/outline';

const BottomToolbar = () => {
  const { addBlock } = usePageStore();
  
  // Tools configuration
  const tools = [
    { 
      id: 'command', 
      icon: <CodeIcon className="h-5 w-5" />, 
      label: 'Command', 
      action: () => {} 
    },
    { 
      id: 'edit', 
      icon: <PencilIcon className="h-5 w-5" />, 
      label: 'Edit', 
      action: () => {} 
    },
    { 
      id: 'text', 
      icon: <DocumentTextIcon className="h-5 w-5" />, 
      label: 'Text', 
      action: () => addBlock({ type: 'text', content: '' }) 
    },
    { 
      id: 'image', 
      icon: <CameraIcon className="h-5 w-5" />, // Updated to use CameraIcon
      label: 'Image', 
      action: () => addBlock({ type: 'image', content: '' }) 
    },
    { 
      id: 'layout', 
      icon: <ViewGridIcon className="h-5 w-5" />, // Updated to use ViewGridIcon
      label: 'Layout', 
      action: () => {} 
    },
    { 
      id: 'copy', 
      icon: <ClipboardCopyIcon className="h-5 w-5" />, 
      label: 'Copy', 
      action: () => {} 
    },
    { 
      id: 'bookmark', 
      icon: <BookmarkIcon className="h-5 w-5" />, 
      label: 'Bookmark', 
      action: () => addBlock({ type: 'bookmark', content: '' }) 
    },
    { 
      id: 'palette', 
      icon: <ColorSwatchIcon className="h-5 w-5" />, // Updated to use ColorSwatchIcon
      label: 'Style', 
      action: () => {} 
    },
  ];
  
  return (
    <motion.div 
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-2 py-1 flex items-center space-x-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={tool.action}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          onClick={() => addBlock({ type: 'text', content: '' })}
          className="p-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          title="Add block"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default BottomToolbar;