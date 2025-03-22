import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Plus, Tag } from 'lucide-react';
import { createBlock, updateBlock, deleteBlock } from '../../services/blockService';
import BlockRenderer from '../BlockRenderer';
import BottomToolbar from '../pages/BottomToolbar';

const PageContent = ({ page, blocks, setBlocks, socket, setNotification }) => {
  const [focusedBlockId, setFocusedBlockId] = useState(null);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [pageTags, setPageTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');
  const commandMenuRef = useRef(null);
  const [quillRefs, setQuillRefs] = useState({});

  const blockTypes = useMemo(
    () => [
      { type: 'text', label: 'Text', description: 'Just start writing with plain text' },
      { type: 'heading', label: 'Heading', description: 'Big section heading' },
      { type: 'bullet', label: 'Bullet List', description: 'Create a simple bulleted list' },
      { type: 'numbered', label: 'Numbered List', description: 'Create an ordered list' },
      { type: 'quote', label: 'Quote', description: 'Highlight a quote' },
      { type: 'code', label: 'Code', description: 'Add a code snippet' },
      { type: 'image', label: 'Image', description: 'Embed an image by URL' },
      { type: 'divider', label: 'Divider', description: 'Separate sections with a line' },
    ],
    []
  );

  const setQuillRef = useCallback((blockId, ref) => {
    setQuillRefs((prev) => ({ ...prev, [blockId]: ref }));
  }, []);

  const handleInputChange = useCallback(
    (e, blockId) => {
      const content = e.target.value;
      console.log('Input changed:', { content, blockId });

      const div = document.createElement('div');
      div.innerHTML = content;
      const text = div.textContent || div.innerText || '';

      if (text.trim().startsWith('/') && !commandFilter) {
        setShowCommandMenu(true);
        setCommandFilter(text.trim().slice(1));
      } else if (showCommandMenu) {
        setCommandFilter(text.trim().slice(1));
      } else {
        setShowCommandMenu(false);
        setCommandFilter('');
      }
    },
    [commandFilter, showCommandMenu]
  );

  const emitBlockUpdate = useCallback((blockId, updates) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) {
      console.error('Block not found for emit:', blockId);
      return;
    }
    const payload = {
      pageId: page.id,
      blockId: block.id,
      type: block.type,
      content: block.content,
      style: block.style,
      ...updates, // Ghi đè các thuộc tính được cập nhật
    };
    socket.emit('blockUpdate', payload);
    console.log('Client A emitting blockUpdate:', payload);
  }, [page.id, blocks, socket]);

  const handleChangeBlockType = useCallback(
    async (newType) => {
      if (!focusedBlockId) return;

      try {
        const block = blocks.find((b) => b.id === focusedBlockId);
        if (!block) return;

        console.log('handleChangeBlockType called with newType:', newType);
        const plainText = stripTags(block.content || '').replace(/^\/.*/, '');
        await updateBlock(focusedBlockId, { type: newType, content: plainText });
        setBlocks((prev) =>
          prev.map((b) => (b.id === focusedBlockId ? { ...b, type: newType, content: plainText } : b))
        );
        emitBlockUpdate(focusedBlockId, { type: newType, content: plainText });
        setShowCommandMenu(false);
        setCommandFilter('');

        setTimeout(() => {
          const quillRef = quillRefs[focusedBlockId];
          if (quillRef && typeof quillRef.getEditor === 'function') {
            const quill = quillRef.getEditor();
            quill.setText(plainText);
            quill.focus();
          } else {
            console.warn('Quill editor not found for block:', focusedBlockId);
          }
        }, 100);
      } catch (error) {
        console.error('Failed to change block type:', error);
        setNotification({ type: 'error', message: 'Failed to change block type: ' + error.message });
      }
    },
    [focusedBlockId, blocks, socket, setNotification, quillRefs, emitBlockUpdate]
  );

  const handleUpdateBlock = useCallback(
    async (blockId, updates) => {
      try {
        await updateBlock(blockId, updates);
        setBlocks((prev) =>
          prev.map((b) => (b.id === blockId ? { ...b, ...updates } : b))
        );
        emitBlockUpdate(blockId, updates);
      } catch (error) {
        console.error('Failed to update block:', error);
        setNotification({ type: 'error', message: 'Failed to update block: ' + error.message });
      }
    },
    [blocks, emitBlockUpdate, setNotification]
  );

  const stripTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return div.textContent || div.innerText || '';
  };

  const handleAddBlock = useCallback(async (type = 'text', position = blocks.length) => {
    console.log('HandleAddBlock triggered with type:', type, 'at position:', position);
    try {
      const newBlock = await createBlock({
        pageId: page.id,
        type,
        content: '',
        position,
        style: {
          fontFamily: 'Arial',
          fontSize: type === 'heading' ? '24px' : '16px',
          color: '#000000',
          bold: type === 'heading' ? true : false,
          italic: false,
          underline: false,
          align: 'left',
        },
      });
      const blockWithId = { ...newBlock, id: newBlock._id };
      console.log('New block created:', blockWithId);
      setBlocks((prev) => {
        const newBlocks = [...prev.slice(0, position), blockWithId, ...prev.slice(position)];
        console.log('Updated blocks:', newBlocks);
        return newBlocks;
      });
      socket.emit('addBlock', { pageId: page.id, block: blockWithId });
      setShowCommandMenu(false);
      setCommandFilter('');
      setTimeout(() => {
        const editor = document.querySelector(`div[data-block-id="${newBlock._id}"] .ql-editor`);
        if (editor) {
          editor.focus();
          setFocusedBlockId(newBlock._id);
          console.log('Focused new block:', newBlock._id);
        } else {
          console.error('Editor not found for block:', newBlock._id);
        }
      }, 100);
    } catch (error) {
      console.error("Failed to add block:", error);
      setNotification({ type: 'error', message: "Failed to add block: " + error.message });
    }
  }, [blocks, page.id, socket, setNotification]);

  const handleUpdateStyle = useCallback(async (blockId, styleUpdates) => {
    if (!blockId) {
      console.error("No block focused to update style");
      return;
    }

    try {
      const block = blocks.find((b) => b.id === blockId);
      if (!block) {
        console.error("Block not found for style update:", blockId);
        return;
      }

      const currentStyle = block.style || {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#000000',
        bold: false,
        italic: false,
        underline: false,
        align: 'left',
      };

      const newStyle = { ...currentStyle, ...styleUpdates };
      console.log('Updating style for block:', blockId, 'New style:', newStyle);

      await updateBlock(blockId, { style: newStyle });
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId ? { ...b, style: newStyle } : b
        )
      );
      socket.emit('blockUpdate', { pageId: page.id, blockId, style: newStyle });
    } catch (error) {
      console.error("Failed to update block style:", error);
      setNotification({ type: 'error', message: "Failed to update block style: " + error.message });
    }
  }, [blocks, page.id, socket, setNotification]);

  const handleDeleteBlock = useCallback(async (blockId, blockIndex) => {
    try {
      await deleteBlock(blockId);
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
      socket.emit('deleteBlock', { pageId: page.id, blockId });
      if (blockIndex > 0) {
        const prevBlockId = blocks[blockIndex - 1].id;
        setTimeout(() => {
          const textarea = document.querySelector(`textarea[data-block-id="${prevBlockId}"]`);
          if (textarea) {
            textarea.focus();
            setFocusedBlockId(prevBlockId);
          }
        }, 100);
      }
    } catch (error) {
      console.error("Failed to delete block:", error);
      setNotification({ type: 'error', message: "Failed to delete block: " + error.message });
    }
  }, [blocks, page.id, socket, setNotification]);

  const handleKeyDown = useCallback((e, blockId) => {
    const blockIndex = blocks.findIndex((b) => b.id === blockId);
    const block = blocks[blockIndex];

    if (e.key === 'Enter' && !showCommandMenu) {
      e.preventDefault();
      if (e.shiftKey) {
        return;
      }
      const newType = block.type === 'bullet' || block.type === 'numbered' ? block.type : 'text';
      handleAddBlock(newType, blockIndex + 1);
    } else if (e.key === 'Backspace' && !block.content && blockIndex > 0) {
      e.preventDefault();
      handleDeleteBlock(blockId, blockIndex);
    } else if (e.key === 'Tab' && (block.type === 'bullet' || block.type === 'numbered')) {
      e.preventDefault();
      const indentLevel = block.style?.indentLevel || 0;
      if (e.shiftKey) {
        if (indentLevel > 0) {
          handleUpdateStyle(blockId, { indentLevel: indentLevel - 1 });
        }
      } else {
        handleUpdateStyle(blockId, { indentLevel: indentLevel + 1 });
      }
    } else if (e.key === 'Enter' && showCommandMenu) {
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
  }, [blocks, showCommandMenu, commandFilter, blockTypes, handleAddBlock, handleChangeBlockType, handleUpdateStyle, handleDeleteBlock]);

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

  const handleAddTag = useCallback((e) => {
    if (e.key === 'Enter' && newTag.trim() && !pageTags.includes(newTag.trim())) {
      setPageTags((prev) => [...prev, newTag.trim()]);
      setNewTag('');
      e.preventDefault();
    }
  }, [newTag, pageTags]);

  const handleRemoveTag = useCallback((tag) => {
    setPageTags((prev) => prev.filter((t) => t !== tag));
  }, []);

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
            <BlockRenderer
              block={{ ...block, pageId: page.id }}
              onFocus={() => setFocusedBlockId(block.id)}
              onBlur={() => setFocusedBlockId(null)}
              onDelete={async () => {
                try {
                  await deleteBlock(block.id);
                  setBlocks((prev) => prev.filter((b) => b.id !== block.id));
                  socket.emit('deleteBlock', { pageId: page.id, blockId: block.id });
                } catch (error) {
                  console.error('Failed to delete block:', error);
                  setNotification({ type: 'error', message: 'Failed to delete block: ' + error.message });
                }
              }}
              onUpdate={handleUpdateBlock}              
              onInputChange={handleInputChange}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              socket={socket}
              setQuillRef={setQuillRef}
            />
            {focusedBlockId === block.id && showCommandMenu && (
              <div
                ref={commandMenuRef}
                className="absolute z-50 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg pointer-events-auto max-h-[300px] overflow-y-auto"
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
      <BottomToolbar
        focusedBlockId={focusedBlockId}
        blocks={blocks}
        handleUpdateStyle={handleUpdateStyle}
        quillRef={quillRefs[focusedBlockId]}
      />
    </motion.div>
  );
};

export default PageContent;