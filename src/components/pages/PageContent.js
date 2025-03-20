import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Plus, Trash2, Tag } from 'lucide-react';
import { createBlock, updateBlock, deleteBlock } from '../../services/blockService';

// Block components
const TextBlock = React.memo(({ block, onFocus, onBlur, onDelete, onUpdate }) => {
  const handleUpdate = async (e) => {
    const newContent = e.target.value;
    if (!block.id) {
      console.error("Block id is undefined:", block);
      return;
    }
    onUpdate(block.id, { content: newContent });
    try {
      await updateBlock(block.id, { content: newContent });
    } catch (error) {
      console.error("Failed to update block:", error);
    }
  };

  return (
    <div className="group relative">
      <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <textarea
        data-block-id={block.id}
        className="w-full p-2 border-0 focus:outline-none focus:ring-0 resize-none bg-transparent text-gray-900 dark:text-gray-100"
        value={block.content || ''}
        onChange={handleUpdate}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Type something..."
        rows={block.content ? block.content.split('\n').length : 1}
        style={{ minHeight: '1.5rem' }}
      />
    </div>
  );
});

const HeadingBlock = React.memo(({ block, onFocus, onBlur, onDelete, onUpdate }) => {
  const handleUpdate = async (e) => {
    const newContent = e.target.value;
    if (!block.id) {
      console.error("Block id is undefined:", block);
      return;
    }
    onUpdate(block.id, { content: newContent });
    try {
      await updateBlock(block.id, { content: newContent });
    } catch (error) {
      console.error("Failed to update block:", error);
    }
  };

  return (
    <div className="group relative">
      <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <textarea
        data-block-id={block.id}
        className="w-full p-2 border-0 focus:outline-none focus:ring-0 resize-none bg-transparent text-2xl font-bold text-gray-900 dark:text-gray-100"
        value={block.content || ''}
        onChange={handleUpdate}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Heading"
        rows={block.content ? block.content.split('\n').length : 1}
        style={{ minHeight: '2rem' }}
      />
    </div>
  );
});

const BulletListBlock = React.memo(({ block, onFocus, onBlur, onDelete, onUpdate }) => {
  const handleUpdate = async (e) => {
    const newContent = e.target.value;
    if (!block.id) {
      console.error("Block id is undefined:", block);
      return;
    }
    onUpdate(block.id, { content: newContent });
    try {
      await updateBlock(block.id, { content: newContent });
    } catch (error) {
      console.error("Failed to update block:", error);
    }
  };

  return (
    <div className="group relative">
      <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex">
        <div className="mt-3 mr-2">•</div>
        <textarea
          data-block-id={block.id}
          className="w-full p-2 border-0 focus:outline-none focus:ring-0 resize-none bg-transparent text-gray-900 dark:text-gray-100"
          value={block.content || ''}
          onChange={handleUpdate}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="List item"
          rows={block.content ? block.content.split('\n').length : 1}
          style={{ minHeight: '1.5rem' }}
        />
      </div>
    </div>
  );
});

const DividerBlock = React.memo(({ block, onDelete }) => {
  return (
    <div className="group relative py-2">
      <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />
    </div>
  );
});

const PageContent = ({ page, blocks, setBlocks }) => {
  const [focusedBlockId, setFocusedBlockId] = useState(null);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [pageTags, setPageTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const renderBlock = (block) => {
    if (!block || !block.id) {
      console.error("Invalid block:", block);
      return null;
    }
    const blockProps = {
      block,
      onFocus: () => setFocusedBlockId(block.id),
      onBlur: () => setFocusedBlockId(null),
      onDelete: async () => {
        try {
          await deleteBlock(block.id);
          setBlocks((prev) => {
            const index = prev.findIndex(b => b.id === block.id);
            return [
              ...prev.slice(0, index),
              ...prev.slice(index + 1).map(b => ({ ...b, position: b.position - 1 })),
            ];
          });
        } catch (error) {
          console.error("Failed to delete block:", error);
        }
      },
      onUpdate: (id, updates) => {
        setBlocks((prev) =>
          prev.map(b => (b.id === id ? { ...b, ...updates } : b))
        );
      },
    };

    switch (block.type) {
      case 'text':
      case 'paragraph':
        return <TextBlock key={block.id} {...blockProps} />;
      case 'heading':
      case 'heading_1':
        return <HeadingBlock key={block.id} {...blockProps} />;
      case 'bullet':
      case 'bulleted_list':
        return <BulletListBlock key={block.id} {...blockProps} />;
      case 'divider':
        return <DividerBlock key={block.id} {...blockProps} />;
      default:
        console.warn(`Unknown block type: ${block.type}, rendering as text`);
        return <TextBlock key={block.id} {...blockProps} />;
    }
  };

  const handleAddBlock = async (type) => {
    const lastBlockIndex = blocks.length > 0 ? blocks.length - 1 : -1;
    try {
      const newBlock = await createBlock({
        pageId: page.id,
        type,
        content: '',
        position: lastBlockIndex + 1,
      });
      const blockWithId = { ...newBlock, id: newBlock._id };
      setBlocks((prev) => [...prev, blockWithId]);
      setTimeout(() => {
        const textarea = document.querySelector(`textarea[data-block-id="${newBlock._id}"]`);
        if (textarea) textarea.focus();
      }, 100);
    } catch (error) {
      console.error("Failed to add block:", error);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim() && !pageTags.includes(newTag.trim())) {
      setPageTags((prev) => [...prev, newTag.trim()]);
      setNewTag('');
      e.preventDefault();
    }
  };

  const handleRemoveTag = (tag) => {
    setPageTags((prev) => prev.filter(t => t !== tag));
  };

  const currentDate = format(new Date(), 'MMMM d, yyyy');

  if (!page || !blocks) {
    return <div className="text-center p-4 text-gray-500">Page data not available</div>;
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <span className="mr-2">{page.icon}</span>
          {page.title || 'Untitled'}
        </h1>
        <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400 text-sm">
          <span>Last edited on {currentDate}</span>
        </div>
        <div className="flex flex-wrap items-center mt-4 gap-2">
          {pageTags.map(tag => (
            <div key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm flex items-center">
              <span className="mr-1">{tag}</span>
              <button className="text-gray-500 hover:text-red-500" onClick={() => handleRemoveTag(tag)}>×</button>
            </div>
          ))}
          {showTagsInput ? (
            <div className="flex items-center">
              <input
                type="text"
                className="text-sm p-1 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag"
                autoFocus
              />
              <button
                className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => {
                  if (newTag.trim() && !pageTags.includes(newTag.trim())) {
                    setPageTags((prev) => [...prev, newTag.trim()]);
                    setNewTag('');
                  }
                  setShowTagsInput(false);
                }}
              >
                Add
              </button>
              <button
                className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowTagsInput(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm flex items-center"
              onClick={() => setShowTagsInput(true)}
            >
              <Tag size={14} className="mr-1" />
              Add tag
            </button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {blocks.map(block => renderBlock(block))}
        <div className="flex space-x-2 mt-6">
          <button
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300"
            onClick={() => handleAddBlock('text')}
          >
            <Plus size={16} className="mr-1" /> Text
          </button>
          <button
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300"
            onClick={() => handleAddBlock('heading')}
          >
            <Plus size={16} className="mr-1" /> Heading
          </button>
          <button
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300"
            onClick={() => handleAddBlock('bullet')}
          >
            <Plus size={16} className="mr-1" /> Bullet List
          </button>
          <button
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300"
            onClick={() => handleAddBlock('divider')}
          >
            <Plus size={16} className="mr-1" /> Divider
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PageContent;