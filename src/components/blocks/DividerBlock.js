import React from 'react';
import { Trash2 } from 'lucide-react';

const DividerBlock = React.memo(({ block, onDelete }) => {
  return (
    <div className="relative py-2" data-block-id={block.id}>
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

export default DividerBlock;