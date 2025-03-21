import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, RefreshCw, Check, X } from 'lucide-react';
import InviteForm from './InviteForm';
import MembersList from './MembersList';
import workspaceService from '../../services/workspaceService';
import { getUserInvitations, acceptInvitation, declineInvitation } from '../../services/invitationService';

const CollabPage = ({ workspace, user }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('MEMBER');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('members');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [userInvitations, setUserInvitations] = useState([]);

  useEffect(() => {
    fetchUserInvitations();
    if (workspace && workspace.id) {
      fetchWorkspaceData(workspace.id);
    } else {
      setInvitations([]);
      setCollaborators([]);
    }
  }, [workspace]);

  const fetchWorkspaceData = async (workspaceId) => {
    setIsLoading(true);
    try {
      const userInvitationsResponse = await getUserInvitations();
      const userInvitationsData = userInvitationsResponse.data || [];
      setUserInvitations(userInvitationsData);

      const workspaceInvitations = userInvitationsData.filter(
        (invite) => invite.workspaceId === workspaceId
      );
      setInvitations(workspaceInvitations);

      const workspaceMembersResponse = await workspaceService.getWorkspaceMembers(workspaceId);
      const workspaceMembers = workspaceMembersResponse.data || [];
      setCollaborators(workspaceMembers);
    } catch (error) {
      console.error('Error in fetchWorkspaceData:', error);
      showNotification(`Error loading workspace data: ${error.message}`, 'error');
      setCollaborators([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInvitations = async () => {
    try {
      const response = await getUserInvitations();
      setUserInvitations(response.data || []);
    } catch (error) {
      console.error('Error fetching user invitations:', error);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    setIsLoading(true);
    try {
      await acceptInvitation(invitationId);
      showNotification('Invitation accepted successfully');
      setUserInvitations(userInvitations.filter((inv) => inv.invitationId !== invitationId));
      if (workspace && workspace.id) {
        fetchWorkspaceData(workspace.id);
      }
    } catch (error) {
      showNotification(`Failed to accept invitation: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineInvitation = async (invitationId) => {
    setIsLoading(true);
    try {
      await declineInvitation(invitationId);
      showNotification('Invitation declined successfully');
      setUserInvitations(userInvitations.filter((inv) => inv.invitationId !== invitationId));
    } catch (error) {
      showNotification(`Failed to decline invitation: ${error.message}`, 'error');
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
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 28 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

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
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${getNotificationStyle(
              notification.type
            )} text-white flex items-center`}
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
            {workspace
              ? `Invite people to collaborate on "${workspace.name || 'Project Alpha'}"`
              : 'Manage your workspace invitations'}
          </p>
        </motion.div>

        {/* Bảng lời mời */}
        <motion.div
          className="mb-6 rounded-xl shadow-lg p-4 md:p-6 bg-white/90 border border-gray-100/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Your Invitations</h2>
          {userInvitations.length > 0 ? (
            <div className="space-y-4">
              {userInvitations.map((invite) => (
                <div
                  key={invite.invitationId}
                  className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
                >
                  <div>
                    <p>
                      Invited to <strong>{invite.workspaceName}</strong> as{' '}
                      <strong>{invite.role}</strong> by {invite.inviterEmail}
                    </p>
                    <p className="text-sm text-gray-500">
                      Sent on {new Date(invite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAcceptInvitation(invite.invitationId)}
                    >
                      <Check size={16} className="inline mr-1" /> Accept
                    </motion.button>
                    <motion.button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeclineInvitation(invite.invitationId)}
                    >
                      <X size={16} className="inline mr-1" /> Decline
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No invitations found.</p>
          )}
        </motion.div>

        {workspace && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default CollabPage;