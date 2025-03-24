// src/components/Chatbot.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Lightbulb, HelpCircle } from 'lucide-react';

const Chatbot = ({ socket, pageId, pageTitle, blocks, isOpen, onClose }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Load lịch sử trò chuyện từ localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chatMessages_${pageId}`);
    if (savedMessages) {
      setChatMessages(JSON.parse(savedMessages));
    }
  }, [pageId]);

  // Lưu lịch sử trò chuyện vào localStorage
  useEffect(() => {
    localStorage.setItem(`chatMessages_${pageId}`, JSON.stringify(chatMessages));
  }, [chatMessages, pageId]);

  // Lắng nghe phản hồi từ chatbot
  useEffect(() => {
    if (!socket) return;

    socket.on('chatbotResponse', ({ message }) => {
      setChatMessages((prev) => [...prev, { sender: 'bot', text: message }]);
    });

    return () => {
      socket.off('chatbotResponse');
    };
  }, [socket]);

  // Gửi tin nhắn tới chatbot
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { sender: 'user', text: chatInput }]);
    socket.emit('chatbotMessage', { pageId, message: chatInput, pageTitle, blocks });
    setChatInput('');
  };

  // Gửi tin nhắn gợi ý
  const handleQuickSuggestion = (suggestion) => {
    setChatMessages((prev) => [...prev, { sender: 'user', text: suggestion }]);
    socket.emit('chatbotMessage', { pageId, message: suggestion, pageTitle, blocks });
  };

  // Xóa lịch sử trò chuyện
  const handleClearChat = () => {
    setChatMessages([]);
    localStorage.removeItem(`chatMessages_${pageId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-20 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">IdeaBot</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleClearChat}
                className="text-gray-500 hover:text-red-500"
                title="Clear Chat"
              >
                <Trash2 size={18} />
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
          </div>

          <div className="flex space-x-2 mb-3">
            <button
              onClick={() => handleQuickSuggestion('I need an idea')}
              className="flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
            >
              <Lightbulb size={14} className="mr-1" />
              Idea
            </button>
            <button
              onClick={() => handleQuickSuggestion('How do I use this app?')}
              className="flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
            >
              <HelpCircle size={14} className="mr-1" />
              How to Use
            </button>
          </div>

          <div className="h-72 overflow-y-auto mb-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
            {chatMessages.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                Start chatting with IdeaBot!
              </p>
            ) : (
              chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
              placeholder="Ask me anything..."
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              <Send size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;