import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Clock, Eye } from 'lucide-react';
import { getPageHistory, restorePageVersion } from '../../services/pageContentService';

const PageHistory = ({ page, setBlocks, onRestore }) => { // Nhận props từ PageComponent
  const { data, isLoading, error } = useQuery({
    queryKey: ['pageHistory', page.id],
    queryFn: () => getPageHistory(page.id),
    enabled: !!page.id,
    onError: (error) => console.error("Failed to load history:", error),
  });

  const handleRestore = async (version) => {
    try {
      const restoredData = await restorePageVersion(page.id, version);
      setBlocks(restoredData.blocks); // Cập nhật blocks cục bộ
      onRestore(version); // Gọi callback từ PageComponent
    } catch (error) {
      console.error("Failed to restore version:", error);
    }
  };

  if (isLoading) return <div>Loading history...</div>;
  if (error) return <div className="text-red-500">Error loading history: {error.message}</div>;

  const history = Array.isArray(data) ? data : (data?.history || []);

  if (!history.length) {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Page History</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            No history available for this page.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Page History</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View and restore previous versions of this page</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {history.map((version, index) => (
            <li
              key={version.id || index}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300 mr-3">
                    <Clock size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Version {history.length - index}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="mr-2">{version.editorName || 'Unknown'}</span>
                      <span>{version.date ? format(new Date(version.date), 'MMM d, yyyy h:mm a') : 'N/A'}</span>
                    </div>
                    {version.changes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{version.changes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                  >
                    <Eye size={16} className="mr-1" /> View
                  </button>
                  {index > 0 && (
                    <button
                      className="ml-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
                      onClick={() => handleRestore(version.version)}
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default PageHistory;