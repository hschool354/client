import React from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, ArrowLeftIcon, SwitchHorizontalIcon, ArrowRightIcon } from '@heroicons/react/outline';
import { Underline } from 'lucide-react';

const BottomToolbar = ({ focusedBlockId, blocks, handleUpdateStyle, quillRef }) => {
  const fonts = ['Arial', 'Times New Roman', 'Roboto', 'Helvetica', 'Courier New'];
  const fontSizes = ['12px', '14px', '16px', '20px', '24px', '32px'];

  const focusedBlock = blocks.find((block) => block.id === focusedBlockId);
  const currentStyle = focusedBlock?.style || {
    fontFamily: 'Arial',
    fontSize: '16px',
    color: '#000000',
    bold: false,
    italic: false,
    underline: false,
    align: 'left',
  };

  const applyQuillFormat = (format, value) => {
    if (quillRef && quillRef.getEditor) {
      const quill = quillRef.getEditor();
      const selection = quill.getSelection();
      if (selection) {
        quill.format(format, value);
        // Cập nhật style cho block nếu cần
        handleUpdateStyle(focusedBlockId, { [format]: value });
      } else {
        handleUpdateStyle(focusedBlockId, { [format]: value });
      }
    }
  };

  const handleFontChange = (e) => {
    applyQuillFormat('font', e.target.value);
  };

  const handleFontSizeChange = (e) => {
    applyQuillFormat('size', e.target.value);
  };

  const handleColorChange = (e) => {
    applyQuillFormat('color', e.target.value);
  };

  const toggleBold = () => {
    applyQuillFormat('bold', !currentStyle.bold);
  };

  const toggleItalic = () => {
    applyQuillFormat('italic', !currentStyle.italic);
  };

  const toggleUnderline = () => {
    applyQuillFormat('underline', !currentStyle.underline);
  };

  const setAlign = (align) => {
    applyQuillFormat('align', align);
  };

  const preventFocusLoss = (e) => {
    e.preventDefault();
  };

  // if (!focusedBlockId || !quillRef) {
  //   return null;
  // }

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-2 py-1 flex items-center space-x-2">
        <select
          value={currentStyle.fontFamily}
          onChange={handleFontChange}
          onMouseDown={preventFocusLoss}
          className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        <select
          value={currentStyle.fontSize}
          onChange={handleFontSizeChange}
          onMouseDown={preventFocusLoss}
          className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <input
          type="color"
          value={currentStyle.color}
          onChange={handleColorChange}
          onMouseDown={preventFocusLoss}
          className="w-8 h-8 rounded-md cursor-pointer"
        />

        <button
          onClick={toggleBold}
          onMouseDown={preventFocusLoss}
          className={`p-2 rounded-md ${currentStyle.bold ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
          title="Bold"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={toggleItalic}
          onMouseDown={preventFocusLoss}
          className={`p-2 rounded-md ${currentStyle.italic ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
          title="Italic"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={toggleUnderline}
          onMouseDown={preventFocusLoss}
          className={`p-2 rounded-md ${currentStyle.underline ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
          title="Underline"
        >
          <Underline className="h-5 w-5" />
        </button>

        <button
          onClick={() => setAlign('left')}
          onMouseDown={preventFocusLoss}
          className={`p-2 rounded-md ${currentStyle.align === 'left' ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
          title="Align Left"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => setAlign('center')}
          onMouseDown={preventFocusLoss}
          className={`p-2 rounded-md ${currentStyle.align === 'center' ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
          title="Align Center"
        >
          <SwitchHorizontalIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => setAlign('right')}
          onMouseDown={preventFocusLoss}
          className={`p-2 rounded-md ${currentStyle.align === 'right' ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
          title="Align Right"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default BottomToolbar;