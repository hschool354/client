import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { updateBlock } from '../../services/blockService';
import debounce from 'lodash.debounce';
import './quill-custom.css';

const TextBlock = React.memo(
  ({ block, onFocus, onBlur, onDelete, onUpdate, onInputChange, onKeyDown, socket, setQuillRef, setNotification }) => {
    const [value, setValue] = useState(block.content || '');
    const quillRef = useRef(null);

    // Debounced function để gửi cập nhật tới server và các client khác
    const debouncedUpdate = useCallback(
      debounce(async (content) => {
        try {
          await updateBlock(block.id, { content });
          socket.emit('blockUpdate', { pageId: block.pageId, blockId: block.id, content });
        } catch (error) {
          console.error('Failed to update block:', error);
          if (setNotification) {
            setNotification({ type: 'error', message: 'Failed to update block: ' + error.message });
          }
        }
      }, 500), // Gửi sau 500ms kể từ lần gõ cuối cùng
      [block.id, block.pageId, socket, setNotification]
    );

    const handleChange = (content) => {
      setValue(content);
      onUpdate(block.id, { content });
      onInputChange({ target: { value: content } }, block.id);
      debouncedUpdate(content); // Gọi hàm debounced để gửi cập nhật
    };

    const handleKeyDownWrapper = (e) => {
      onKeyDown(e, block.id);
    };

    // Đồng bộ value với block.content khi có cập nhật từ bên ngoài (Socket.IO)
    useEffect(() => {
      if (block.content !== value) {
        setValue(block.content || '');
      }
    }, [block.content]);

    // Truyền Quill ref lên parent
    useEffect(() => {
      if (quillRef.current && setQuillRef) {
        setQuillRef(block.id, quillRef.current);
      }
    }, [block.id, setQuillRef]);

    // Hủy debounce khi component unmount
    useEffect(() => {
      return () => {
        debouncedUpdate.cancel();
      };
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
          placeholder="Type / for commands..."
          modules={{ toolbar: false }}
          style={{ minHeight: '1.5em', ...block.style }} 
        />
      </div>
    );
  }
);

export default TextBlock;