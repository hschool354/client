import React from 'react';
import { motion } from 'framer-motion';
import { usePageStore } from '../../stores/pageStore';
import { ChevronDown, ChevronUp, Image } from 'lucide-react';
import { Tooltip } from '../shared/Tooltip';

const PageCover = () => {
  const { page, coverExpanded, setCoverExpanded, updatePageCover } = usePageStore();

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real implementation, you would upload this file to your server
      // and then update the coverUrl with the returned URL
      const reader = new FileReader();
      reader.onload = (event) => {
        updatePageCover(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className="relative w-full overflow-hidden"
      initial={{ height: 40 }}
      animate={{ height: coverExpanded ? 240 : 160 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${page.coverUrl})` }}
      />
      
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white">
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Tooltip content="Change cover">
            <label className="cursor-pointer p-2 rounded-md bg-gray-900 bg-opacity-50 hover:bg-opacity-70 transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
              <Image size={16} />
            </label>
          </Tooltip>
          
          <Tooltip content={coverExpanded ? "Collapse" : "Expand"}>
            <button
              className="p-2 rounded-md bg-gray-900 bg-opacity-50 hover:bg-opacity-70 transition-colors duration-200"
              onClick={() => setCoverExpanded(!coverExpanded)}
            >
              {coverExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
};

export default PageCover;