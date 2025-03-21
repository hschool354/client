import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Plus, Trash2, Tag } from 'lucide-react';
import { createBlock, updateBlock, deleteBlock } from '../../services/blockService';

const TextBlock = React.memo(({ block, onFocus, onBlur, onDelete, onUpdate, onInputChange, socket }) => {
  const handleUpdate = async (e) => {
    const newContent = e.target.value;
    if (!block.id) {
      console.error("Block id is undefined:", block);
      return;
    }
    onUpdate(block.id, { content: newContent });
    try {
      await updateBlock(block.id, { content: newContent });
      socket.emit('blockUpdate', { pageId: block.pageId, blockId: block.id, content: newContent });
    } catch (error) {
      console.error("Failed to update block:", error);
    }
  };

  return (
    <div className="relative">
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
        onChange={(e) => {
          handleUpdate(e);
          onInputChange(e, block.id);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Type / for commands..."
        rows={block.content ? block.content.split('\n').length : 1}
        style={{ minHeight: '1.5rem' }}
      />
    </div>
  );
});

const HeadingBlock = React.memo(({ block, onFocus, onBlur, onDelete, onUpdate, onInputChange, socket }) => {
  const handleUpdate = async (e) => {
    const newContent = e.target.value;
    if (!block.id) {
      console.error("Block id is undefined:", block);
      return;
    }
    onUpdate(block.id, { content: newContent });
    try {
      await updateBlock(block.id, { content: newContent });
      socket.emit('blockUpdate', { pageId: block.pageId, blockId: block.id, content: newContent });
    } catch (error) {
      console.error("Failed to update block:", error);
    }
  };

  return (
    <div className="relative">
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
        onChange={(e) => {
          handleUpdate(e);
          onInputChange(e, block.id);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Heading"
        rows={block.content ? block.content.split('\n').length : 1}
        style={{ minHeight: '2rem' }}
      />
    </div>
  );
});

const BulletListBlock = React.memo(({ block, onFocus, onBlur, onDelete, onUpdate, onInputChange, socket }) => {
  const handleUpdate = async (e) => {
    const newContent = e.target.value;
    if (!block.id) {
      console.error("Block id is undefined:", block);
      return;
    }
    onUpdate(block.id, { content: newContent });
    try {
      await updateBlock(block.id, { content: newContent });
      socket.emit('blockUpdate', { pageId: block.pageId, blockId: block.id, content: newContent });
    } catch (error) {
      console.error("Failed to update block:", error);
    }
  };

  return (
    <div className="relative">
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
          onChange={(e) => {
            handleUpdate(e);
            onInputChange(e, block.id);
          }}
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

const NumberedListBlock = React.memo(({ block, onFocus, onBlur, onDelete, onUpdate, onInputChange, socket }) => {
  const handleUpdate = async (e) => {
    const newContent = e.target.value;
    if (!block.id) {
      console.error("Block id is undefined:", block);
      return;
    }
    onUpdate(block.id, { content: newContent });
    try {
      await updateBlock(block.id, { content: newContent });
      socket.emit('blockUpdate', { pageId: block.pageId, blockId: block.id, content: newContent });
    } catch (error) {
      console.error("Failed to update block:", error);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex">
        <div className="mt-3 mr-2">{block.position + 1}.</div>
        <textarea
          data-block-id={block.id}
          className="w-full p-2 border-0 focus:outline-none focus:ring-0 resize-none bg-transparent text-gray-900 dark:text-gray-100"
          value={block.content || ''}
          onChange={(e) => {
            handleUpdate(e);
            onInputChange(e, block.id);
          }}
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

const QuoteBlock = React.memo(({ block, onFocus, onBlur, onDelete, onUpdate, onInputChange, socket }) => {
  const handleUpdate = async (e) => {
    const newContent = e.target.value;
    if (!block.id) {
      console.error("Block id is undefined:", block);
      return;
    }
    onUpdate(block.id, { content: newContent });
    try {
      await updateBlock(block.id, { content: newContent });
      socket.emit('blockUpdate', { pageId: block.pageId, blockId: block.id, content: newContent });
    } catch (error) {
      console.error("Failed to update block:", error);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-4">
        <textarea
          data-block-id={block.id}
          className="w-full p-2 border-0 focus:outline-none focus:ring-0 resize-none bg-transparent text-gray-900 dark:text-gray-100 italic"
          value={block.content || ''}
          onChange={(e) => {
            handleUpdate(e);
            onInputChange(e, block.id);
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Quote"
          rows={block.content ? block.content.split('\n').length : 1}
          style={{ minHeight: '1.5rem' }}
        />
      </div>
    </div>
  );
});

const CodeBlock = React.memo(({ block, onFocus, onBlur, onDelete, onUpdate, onInputChange, socket }) => {
  const handleUpdate = async (e) => {
    const newContent = e.target.value;
    if (!block.id) {
      console.error("Block id is undefined:", block);
      return;
    }
    onUpdate(block.id, { content: newContent });
    try {
      await updateBlock(block.id, { content: newContent });
      socket.emit('blockUpdate', { pageId: block.pageId, blockId: block.id, content: newContent });
    } catch (error) {
      console.error("Failed to update block:", error);
    }
  };

  return (
    <div className="relative">
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
        className="w-full p-2 border-0 focus:outline-none focus:ring-0 resize-none bg-gray-100 dark:bg-gray-800 font-mono text-gray-900 dark:text-gray-100 rounded-md"
        value={block.content || ''}
        onChange={(e) => {
          handleUpdate(e);
          onInputChange(e, block.id);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Code"
        rows={block.content ? block.content.split('\n').length : 1}
        style={{ minHeight: '1.5rem' }}
      />
    </div>
  );
});

const ImageBlock = React.memo(({ block, onDelete, onUpdate, socket }) => {
  const handleUpdate = async (e) => {
    const newContent = e.target.value;
    if (!block.id) {
      console.error("Block id is undefined:", block);
      return;
    }
    onUpdate(block.id, { content: newContent });
    try {
      await updateBlock(block.id, { content: newContent });
      socket.emit('blockUpdate', { pageId: block.pageId, blockId: block.id, content: newContent });
    } catch (error) {
      console.error("Failed to update block:", error);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
      {block.content ? (
        <img src={block.content} alt="Block image" className="w-full h-auto rounded-md" />
      ) : (
        <input
          type="text"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter image URL"
          value={block.content || ''}
          onChange={handleUpdate}
        />
      )}
    </div>
  );
});

const DividerBlock = React.memo(({ block, onDelete }) => {
  return (
    <div className="relative py-2">
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

const PageContent = ({ page, blocks, setBlocks, socket }) => {
  const [focusedBlockId, setFocusedBlockId] = useState(null);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [pageTags, setPageTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');
  const commandMenuRef = useRef(null);

  const blockTypes = [
    { type: 'text', label: 'Text', description: 'Just start writing with plain text' },
    { type: 'heading', label: 'Heading', description: 'Big section heading' },
    { type: 'bullet', label: 'Bullet List', description: 'Create a simple bulleted list' },
    { type: 'numbered', label: 'Numbered List', description: 'Create an ordered list' },
    { type: 'quote', label: 'Quote', description: 'Highlight a quote' },
    { type: 'code', label: 'Code', description: 'Add a code snippet' },
    { type: 'image', label: 'Image', description: 'Embed an image by URL' },
    { type: 'divider', label: 'Divider', description: 'Separate sections with a line' },
  ];

  const renderBlock = (block) => {
    if (!block || !block.id) {
      console.error("Invalid block:", block);
      return null;
    }
    console.log('Rendering block:', block);
    const blockProps = {
      block: { ...block, pageId: page.id },
      onFocus: () => setFocusedBlockId(block.id),
      onBlur: () => setFocusedBlockId(null),
      onDelete: async () => {
        try {
          await deleteBlock(block.id);
          setBlocks((prev) => prev.filter((b) => b.id !== block.id));
          socket.emit('deleteBlock', { pageId: page.id, blockId: block.id });
        } catch (error) {
          console.error("Failed to delete block:", error);
        }
      },
      onUpdate: (id, updates) => {
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
      },
      onInputChange: handleInputChange,
      socket,
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
      case 'numbered':
      case 'numbered_list':
        return <NumberedListBlock key={block.id} {...blockProps} />;
      case 'quote':
        return <QuoteBlock key={block.id} {...blockProps} />;
      case 'code':
        return <CodeBlock key={block.id} {...blockProps} />;
      case 'image':
        return <ImageBlock key={block.id} {...blockProps} />;
      case 'divider':
        return <DividerBlock key={block.id} {...blockProps} />;
      default:
        console.warn(`Unknown block type: ${block.type}, rendering as text`);
        return <TextBlock key={block.id} {...blockProps} />;
    }
  };

  const handleInputChange = (e, blockId) => {
    const value = e.target.value;
    console.log('Input changed:', { value, blockId });
    if (value.startsWith('/') && !commandFilter) {
      setShowCommandMenu(true);
      setCommandFilter(value.slice(1));
      console.log('Showing command menu with filter:', value.slice(1));
    } else if (showCommandMenu) {
      setCommandFilter(value.slice(1));
      console.log('Updating command filter:', value.slice(1));
    }
  };

  const handleChangeBlockType = async (newType) => {
    console.log('HandleChangeBlockType triggered with type:', newType);
    if (!focusedBlockId) {
      console.error("No block focused to change type");
      return;
    }

    try {
      const updatedBlock = await updateBlock(focusedBlockId, { type: newType });
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === focusedBlockId ? { ...b, type: newType } : b
        )
      );
      socket.emit('blockUpdate', { pageId: page.id, blockId: focusedBlockId, type: newType });
      setShowCommandMenu(false);
      setCommandFilter('');

      const textarea = document.querySelector(`textarea[data-block-id="${focusedBlockId}"]`);
      if (textarea) {
        const currentContent = textarea.value;
        if (currentContent.startsWith('/')) {
          const newContent = currentContent.slice(1).trim();
          setBlocks((prev) =>
            prev.map((b) =>
              b.id === focusedBlockId ? { ...b, content: newContent } : b
            )
          );
          await updateBlock(focusedBlockId, { content: newContent });
          socket.emit('blockUpdate', { pageId: page.id, blockId: focusedBlockId, content: newContent });
        }
        textarea.focus();
        console.log('Focused block after type change:', focusedBlockId);
      } else {
        console.error('Textarea not found for block:', focusedBlockId);
      }
    } catch (error) {
      console.error("Failed to change block type:", error);
      alert("Failed to change block type: " + error.message);
    }
  };

  const handleAddBlock = async (type = 'text') => {
    console.log('HandleAddBlock triggered with type:', type);
    const lastBlockIndex = blocks.length > 0 ? blocks.length - 1 : -1;
    try {
      const newBlock = await createBlock({
        pageId: page.id,
        type,
        content: '',
        position: lastBlockIndex + 1,
      });
      const blockWithId = { ...newBlock, id: newBlock._id };
      console.log('New block created:', blockWithId);
      setBlocks((prev) => {
        const newBlocks = [...prev, blockWithId];
        console.log('Updated blocks:', newBlocks);
        return newBlocks;
      });
      socket.emit('addBlock', { pageId: page.id, block: blockWithId });
      setShowCommandMenu(false);
      setCommandFilter('');
      setTimeout(() => {
        const textarea = document.querySelector(`textarea[data-block-id="${newBlock._id}"]`);
        if (textarea) {
          textarea.focus();
          console.log('Focused new block:', newBlock._id);
        } else {
          console.error('Textarea not found for block:', newBlock._id);
        }
      }, 100);
    } catch (error) {
      console.error("Failed to add block:", error);
      alert("Failed to add block: " + error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && showCommandMenu) {
      const filteredCommands = blockTypes.filter((cmd) =>
        cmd.label.toLowerCase().includes(commandFilter.toLowerCase())
      );
      if (filteredCommands.length > 0) {
        console.log('Enter pressed, changing block to:', filteredCommands[0].type);
        handleChangeBlockType(filteredCommands[0].type);
        e.preventDefault();
      }
    } else if (e.key === 'Escape') {
      setShowCommandMenu(false);
      setCommandFilter('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (commandMenuRef.current && !commandMenuRef.current.contains(e.target)) {
        setShowCommandMenu(false);
        setCommandFilter('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim() && !pageTags.includes(newTag.trim())) {
      setPageTags((prev) => [...prev, newTag.trim()]);
      setNewTag('');
      e.preventDefault();
    }
  };

  const handleRemoveTag = (tag) => {
    setPageTags((prev) => prev.filter((t) => t !== tag));
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
          {pageTags.map((tag) => (
            <div key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm flex items-center">
              <span className="mr-1">{tag}</span>
              <button className="text-gray-500 hover:text-red-500" onClick={() => handleRemoveTag(tag)}>
                ×
              </button>
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
      <div className="space-y-4 relative">
        {blocks.map((block) => (
          <div key={block.id} className="group relative">
            {renderBlock(block)}
            {focusedBlockId === block.id && showCommandMenu && (
              <div
                ref={commandMenuRef}
                className="absolute z-50 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg pointer-events-auto"
                style={{ zIndex: 50 }}
              >
                {blockTypes
                  .filter((cmd) => cmd.label.toLowerCase().includes(commandFilter.toLowerCase()))
                  .map((cmd) => (
                    <div
                      key={cmd.type}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        console.log('Menu item clicked:', cmd.type);
                        handleChangeBlockType(cmd.type);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">{cmd.label}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{cmd.description}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center">
          <button
            className="text-gray-400 hover:text-indigo-500"
            onClick={() => {
              console.log('Bottom plus button clicked');
              handleAddBlock('text');
            }}
          >
            <Plus size={16} />
          </button>
          <span className="ml-2 text-gray-500 dark:text-gray-400">Add a block</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PageContent;