import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, RefreshCw } from 'lucide-react';
import InviteForm from './InviteForm';
import MembersList from './MembersList';
import workspaceService from '../../services/workspaceService'; // Import workspaceService
import { getUserInvitations } from '../../services/invitationService'; // Chỉ cần getUserInvitations

const CollabPage = ({ workspace, user }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('editor');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('members');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [collaborators, setCollaborators] = useState([]);

  // Load dữ liệu khi workspace thay đổi, nhưng chỉ nếu workspace tồn tại
  useEffect(() => {
    if (workspace && workspace.id) {
      fetchWorkspaceData(workspace.id);
    } else {
      // Nếu không có workspace, reset state
      setInvitations([]);
      setCollaborators([]);
    }
  }, [workspace]);

  const fetchWorkspaceData = async (workspaceId) => {
    setIsLoading(true);
    try {
      const userInvitations = await getUserInvitations();
      const workspaceInvitations = userInvitations.filter(
        (invite) => invite.workspaceId === workspaceId && invite.status === 'pending'
      );
      setInvitations(workspaceInvitations);

      const workspaceMembers = await workspaceService.getWorkspaceMembers(workspaceId);
      setCollaborators(workspaceMembers);
    } catch (error) {
      showNotification(`Error loading workspace data: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'error': return "bg-red-600";
      case 'warning': return "bg-amber-600";
      default: return "bg-indigo-600";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 28 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  // Nếu workspace chưa được chọn, hiển thị thông báo
  if (!workspace) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <p className="text-lg text-gray-600">Please select a workspace to view collaboration details.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50 text-gray-900">
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="text-indigo-600 w-8 h-8" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div 
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${getNotificationStyle(notification.type)} text-white flex items-center`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={notificationVariants}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <motion.div 
          className="mb-6 md:mb-8"
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
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Collaboration Hub
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-600">
            Invite people to collaborate on "{workspace.name || 'Project Alpha'}"
          </p>
        </motion.div>

        <InviteForm 
          workspace={workspace}
          inviteEmail={inviteEmail}
          setInviteEmail={setInviteEmail}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          invitations={invitations}
          setInvitations={setInvitations}
          collaborators={collaborators}
          setCollaborators={setCollaborators}
          setIsLoading={setIsLoading}
          showNotification={showNotification}
        />

        <MembersList 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          collaborators={collaborators}
          setCollaborators={setCollaborators}
          invitations={invitations}
          setInvitations={setInvitations}
          setIsLoading={setIsLoading}
          showNotification={showNotification}
          containerVariants={containerVariants}
          workspace={workspace}
        />
      </div>
    </div>
  );
};

export default CollabPage;