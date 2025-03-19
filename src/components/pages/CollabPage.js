import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Mail, Copy, Check, X, UserPlus, 
  Settings, AlertCircle, Share2, Shield, Key
} from 'lucide-react';

const CollabPage = ({ workspace }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('editor');
  const [invitations, setInvitations] = useState([
    { email: 'sarah.thompson@example.com', role: 'editor', status: 'pending', date: '2025-03-12' },
    { email: 'michael.chen@example.com', role: 'viewer', status: 'pending', date: '2025-03-15' }
  ]);
  const [collaborators, setCollaborators] = useState([
    { id: 'user1', name: 'Alex Johnson', email: 'alex@example.com', role: 'owner', avatar: null, lastActive: 'Now' },
    { id: 'user2', name: 'Emma Davis', email: 'emma@example.com', role: 'editor', avatar: null, lastActive: '3h ago' },
    { id: 'user3', name: 'Marcus Lee', email: 'marcus@example.com', role: 'editor', avatar: null, lastActive: '1d ago' },
    { id: 'user4', name: 'Sophia Garcia', email: 'sophia@example.com', role: 'viewer', avatar: null, lastActive: '2d ago' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('members');
  const [notification, setNotification] = useState(null);
  const [expandedActions, setExpandedActions] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Detect system dark mode preference on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDarkMode);
    }
  }, []);

  // Generate invite link
  const inviteLink = `https://app.example.com/invite/${workspace?.id || 'ws-1'}?code=${generateInviteCode()}`;

  function generateInviteCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  const handleInvite = () => {
    if (inviteEmail.trim() && validateEmail(inviteEmail)) {
      const newInvitation = { 
        email: inviteEmail, 
        role: selectedRole, 
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      
      setInvitations([newInvitation, ...invitations]);
      setInviteEmail('');
      
      showNotification(`Invitation sent to ${inviteEmail}`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      showNotification("Invite link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRemoveInvitation = (email) => {
    setInvitations(invitations.filter(invite => invite.email !== email));
    showNotification(`Invitation to ${email} removed`);
  };

  const handleRemoveCollaborator = (id) => {
    const collaborator = collaborators.find(c => c.id === id);
    setCollaborators(collaborators.filter(collab => collab.id !== id));
    showNotification(`${collaborator?.name || 'User'} removed from workspace`);
  };

  const handleRoleChange = (id, newRole) => {
    setCollaborators(collaborators.map(c => {
      if (c.id === id) {
        return {...c, role: newRole};
      }
      return c;
    }));
    
    const collaborator = collaborators.find(c => c.id === id);
    showNotification(`${collaborator?.name || 'User'} is now a ${newRole}`);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get color for avatar based on name
  const getAvatarColor = (name) => {
    if (!name) return "from-purple-500 to-indigo-500";
    
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-green-500 to-emerald-600",
      "from-pink-500 to-rose-600",
      "from-amber-500 to-orange-600",
      "from-indigo-500 to-violet-600",
      "from-teal-500 to-cyan-600"
    ];
    
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'owner':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case 'editor':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case 'viewer':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const filteredCollaborators = collaborators.filter(collab => 
    collab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collab.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collab.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { staggerChildren: 0.07 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  return (
    <div className={`flex-1 min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Floating Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg bg-indigo-600 text-white flex items-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={notificationVariants}
          >
            <Check className="mr-2" size={16} />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6">
        <motion.button
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800 shadow'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          }
        </motion.button>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Header with animation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Users className="mr-3 text-indigo-500" size={28} />
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Collaboration Hub
            </h1>
          </div>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Invite people to collaborate on "{workspace?.name || 'Project Alpha'}"
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-wrap gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.button
            className={`flex items-center px-4 py-2 rounded-full text-white font-medium shadow-md
            ${expandedActions ? 'bg-purple-600 hover:bg-purple-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setExpandedActions(!expandedActions)}
          >
            {expandedActions ? (
              <>
                <X size={18} className="mr-2" />
                Close Actions
              </>
            ) : (
              <>
                <Settings size={18} className="mr-2" />
                Manage Access
              </>
            )}
          </motion.button>
          
          <AnimatePresence>
            {expandedActions && (
              <>
                <motion.button
                  className="flex items-center px-4 py-2 rounded-full bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Shield size={18} className="mr-2" />
                  Access Settings
                </motion.button>
                
                <motion.button
                  className="flex items-center px-4 py-2 rounded-full bg-amber-600 text-white font-medium shadow-md hover:bg-amber-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Key size={18} className="mr-2" />
                  Permissions
                </motion.button>
                
                <motion.button
                  className="flex items-center px-4 py-2 rounded-full bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Share2 size={18} className="mr-2" />
                  Share Externally
                </motion.button>
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <motion.button
            className={`py-3 px-5 font-medium ${activeTab === 'members' 
              ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('members')}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Members
          </motion.button>
          <motion.button
            className={`py-3 px-5 font-medium ${activeTab === 'invites' 
              ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('invites')}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Pending Invites
          </motion.button>
        </div>

        {/* Invite Form with Glass Effect */}
        <motion.div 
          className={`rounded-xl shadow-lg p-6 mb-8 backdrop-blur-md ${darkMode 
            ? 'bg-gray-800/80 border border-gray-700/50' 
            : 'bg-white/90 border border-gray-100/50'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <UserPlus size={20} className="mr-2 text-indigo-500" />
            Invite Collaborators
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                }`}
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="w-full md:w-40">
              <label htmlFor="role" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Role
              </label>
              <select
                id="role"
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                }`}
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="self-end">
              <motion.button
                className={`flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleInvite}
                disabled={!inviteEmail.trim() || !validateEmail(inviteEmail)}
              >
                <Mail size={18} className="mr-2" />
                Send Invite
              </motion.button>
            </div>
          </div>

          {/* Invite Link with style improvements */}
          <div className="mt-6">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Or share invite link
            </label>
            <div className="flex">
              <input
                type="text"
                className={`flex-1 px-4 py-3 rounded-l-lg truncate ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-gray-50 border border-gray-200 text-gray-800'
                }`}
                value={inviteLink}
                readOnly
              />
              <motion.button
                className={`flex items-center px-5 py-3 rounded-r-lg font-medium ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : darkMode 
                      ? 'bg-gray-600 text-white hover:bg-gray-500' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCopyLink}
              >
                {copied ? <Check size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </motion.button>
            </div>
            <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <AlertCircle size={12} className="inline mr-1" />
              This link expires in 7 days and can be used only once.
            </p>
          </div>
        </motion.div>

        {/* Members List */}
        {activeTab === 'members' && (
          <motion.div 
            className={`rounded-xl shadow-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            variants={containerVariants}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold">Members ({collaborators.length})</h2>
              <div className="relative">
                <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  className={`pl-10 pr-4 py-2 rounded-lg transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    darkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400' 
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <motion.div 
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredCollaborators.map((collab) => (
                <motion.div 
                  key={collab.id} 
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-750 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  } transition-colors`}
                  variants={itemVariants}
                  whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(collab.name)} flex items-center justify-center mr-4 shadow-md`}>
                      <span className="text-sm font-bold text-white">{getInitials(collab.name)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-lg">{collab.name}</p>
                      <div className="flex items-center">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{collab.email}</p>
                        <span className={`inline-flex items-center ml-3 text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                          {collab.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {collab.role === 'owner' ? (
                      <span className={`text-sm px-3 py-1 rounded-full ${getRoleBadgeStyle(collab.role)}`}>
                        Owner
                      </span>
                    ) : (
                      <div className="flex">
                        <select
                          className={`text-sm px-3 py-1 rounded-full mr-3 cursor-pointer ${getRoleBadgeStyle(collab.role)} border-0 focus:ring-2 focus:ring-indigo-300`}
                          value={collab.role}
                          onChange={(e) => handleRoleChange(collab.id, e.target.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        
                        <motion.button
                          className={`text-gray-400 hover:text-red-500 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveCollaborator(collab.id)}
                        >
                          <X size={18} />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredCollaborators.length === 0 && (
              <motion.div 
                className={`text-center py-16 rounded-lg ${darkMode ? 'bg-gray-750 text-gray-400' : 'bg-gray-50 text-gray-500'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Search size={40} className="mx-auto mb-4 opacity-40" />
                <p className="text-lg font-medium">No members found matching your search.</p>
                <p className="mt-1">Try another search term or clear the search.</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Pending Invitations */}
        {activeTab === 'invites' && (
          <motion.div 
            className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            variants={containerVariants}
          >
            <h2 className="text-xl font-semibold mb-5">Pending Invitations ({invitations.length})</h2>
            
            {invitations.length > 0 ? (
              <motion.div 
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {invitations.map((invite) => (
                  <motion.div 
                    key={invite.email} 
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-750 hover:bg-gray-700' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    } transition-colors`}
                    variants={itemVariants}
                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        darkMode ? 'bg-gray-700' : 'bg-indigo-100'
                      }`}>
                        <UserPlus size={20} className={darkMode ? 'text-gray-400' : 'text-indigo-500'} />
                      </div>
                      <div>
                        <p className="font-medium text-lg">{invite.email}</p>
                        <div className="flex items-center">
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            {invite.status}
                          </span>
                          <span className={`ml-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Sent: {invite.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-sm px-3 py-1 rounded-full ${getRoleBadgeStyle(invite.role)} mr-3`}>
                        {invite.role === 'editor' ? 'Editor' : 'Viewer'}
                      </span>
                      <motion.button
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-200 text-gray-500 hover:text-red-500'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveInvitation(invite.email)}
                      >
                        <X size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className={`text-center py-16 rounded-lg ${darkMode ? 'bg-gray-750 text-gray-400' : 'bg-gray-50 text-gray-500'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Mail size={40} className="mx-auto mb-4 opacity-40" />
                <p className="text-lg font-medium">No pending invitations.</p>
                <p className="mt-1">Invite collaborators using the form above.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CollabPage;