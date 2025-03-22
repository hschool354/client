import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { updateBlock } from '../../services/blockService';
import debounce from 'lodash.debounce';

const HeadingBlock = React.memo(
  ({ block, onFocus, onBlur, onDelete, onUpdate, onInputChange, onKeyDown, setQuillRef, setNotification }) => {
    const [value, setValue] = useState(block.content || '');
    const quillRef = useRef(null);

    const debouncedUpdate = useCallback(
      debounce(async (content) => {
        try {
          await updateBlock(block.id, { content });
          onUpdate(block.id, { content }); // Gọi onUpdate thay vì emit trực tiếp
        } catch (error) {
          console.error('Failed to update block:', error);
          if (setNotification) {
            setNotification({ type: 'error', message: 'Failed to update block: ' + error.message });
          }
        }
      }, 500),
      [block.id, onUpdate, setNotification]
    );

    const handleChange = (content) => {
      setValue(content);
      onUpdate(block.id, { content });
      onInputChange({ target: { value: content } }, block.id);
      debouncedUpdate(content);
    };

    const handleKeyDownWrapper = (e) => {
      onKeyDown(e, block.id);
    };

    useEffect(() => {
      if (block.content !== value) {
        setValue(block.content || '');
      }
    }, [block.content]);

    useEffect(() => {
      if (quillRef.current && setQuillRef) {
        setQuillRef(block.id, quillRef.current);
      }
    }, [block.id, setQuillRef]);

    useEffect(() => {
      return () => debouncedUpdate.cancel();
    }, [debouncedUpdate]);

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
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyDownWrapper}
          placeholder="Heading"
          modules={{ toolbar: false }}
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          style={{ minHeight: '2rem', ...block.style }}
        />
      </div>
    );
  }
);

export default HeadingBlock;