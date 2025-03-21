import React from 'react';
import { Trash2 } from 'lucide-react';
import { updateBlock } from '../../services/blockService';

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

export default ImageBlock;