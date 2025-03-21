import React, { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { updateBlock } from '../../services/blockService';

const NumberedListBlock = React.memo(
  ({ block, onFocus, onBlur, onDelete, onUpdate, onInputChange, onKeyDown, socket, setQuillRef }) => {
    const [value, setValue] = useState(block.content || '');
    const quillRef = useRef(null);

    const handleChange = (content) => {
      setValue(content);
      onUpdate(block.id, { content });
      onInputChange({ target: { value: content } }, block.id);
      try {
        updateBlock(block.id, { content });
        socket.emit('blockUpdate', { pageId: block.pageId, blockId: block.id, content });
      } catch (error) {
        console.error('Failed to update block:', error);
      }
    };

    const handleKeyDownWrapper = (e) => {
      onKeyDown(e, block.id);
    };

    useEffect(() => {
      if (quillRef.current && setQuillRef) {
        setQuillRef(block.id, quillRef.current);
      }
    }, [block.id, setQuillRef]);

    return (
      <div className="relative" data-block-id={block.id}>
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
          <ReactQuill
            ref={quillRef}
            value={value}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={handleKeyDownWrapper}
            placeholder="List item"
            modules={{ toolbar: false }}
            className="flex-1 text-gray-900 dark:text-gray-100"
            style={{ minHeight: '1.5rem' }}
          />
        </div>
      </div>
    );
  }
);

export default NumberedListBlock;