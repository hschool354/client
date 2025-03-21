import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, MoreHorizontal, X, Check, RefreshCw, ExternalLink } from 'lucide-react';
import workspaceService from '../../services/workspaceService';
import { cancelInvitation } from '../../services/invitationService';

const MembersList = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  collaborators,
  setCollaborators,
  invitations,
  setInvitations,
  setIsLoading,
  showNotification,
  containerVariants,
  workspace
}) => {
  const handleRemoveCollaborator = async (userId) => {
    const collaborator = collaborators.find(c => c.id === userId);
    if (collaborator.role === 'owner') {
      showNotification("Cannot remove the workspace owner", "error");
      return;
    }
    setIsLoading(true);
    try {
      await workspaceService.removeMember(workspace.id, userId);
      setCollaborators(collaborators.filter(collab => collab.id !== userId));
      showNotification(`${collaborator?.name || 'User'} removed from workspace`);
    } catch (error) {
      showNotification(`Failed to remove member: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const collaborator = collaborators.find(c => c.id === userId);
    if (collaborator.role === 'owner') {
      showNotification("Cannot change the role of the workspace owner", "error");
      return;
    }
    setIsLoading(true);
    try {
      await workspaceService.updateMemberRole(workspace.id, userId, { role: newRole });
      setCollaborators(collaborators.map(c => c.id === userId ? { ...c, role: newRole } : c));
      showNotification(`${collaborator?.name || 'User'} is now a ${newRole}`);
    } catch (error) {
      showNotification(`Failed to update role: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvite = (email) => {
    setIsLoading(true);
    setTimeout(() => {
      setInvitations(invitations.map(invite => 
        invite.email === email 
          ? { ...invite, date: new Date().toISOString().split('T')[0] } 
          : invite
      ));
      setIsLoading(false);
      showNotification(`Invitation to ${email} resent successfully`);
    }, 800);
  };

  const handleRemoveInvitation = async (invitationId) => {
    setIsLoading(true);
    try {
      await cancelInvitation(invitationId);
      setInvitations(invitations.filter(invite => invite.id !== invitationId));
      showNotification('Invitation canceled successfully');
    } catch (error) {
      showNotification(`Failed to cancel invitation: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "?";
  
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
      case 'owner': return "bg-purple-100 text-purple-800";
      case 'admin': return "bg-pink-100 text-pink-800";
      case 'editor': return "bg-blue-100 text-blue-800";
      case 'viewer': return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Kiểm tra an toàn trước khi gọi .filter()
  const filteredCollaborators = Array.isArray(collaborators) 
    ? collaborators.filter(collab => 
        (collab.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        collab.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collab.role?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence mode="wait">
      {activeTab === 'members' && (
        <motion.div 
          key="members"
          className="rounded-xl shadow-lg p-4 md:p-6 mb-6 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
            <h2 className="text-xl font-semibold">Members ({filteredCollaborators.length})</h2>
            <div className="relative w-full md:w-auto">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-100 text-gray-900 placeholder-gray-500"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="show">
            {filteredCollaborators.length > 0 ? (
              filteredCollaborators.map((collab) => (
                <motion.div 
                  key={collab.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  variants={{ hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                  whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex items-center mb-3 md:mb-0">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(collab.name)} flex items-center justify-center mr-4 shadow-md`}>
                      <span className="text-sm font-bold text-white">{getInitials(collab.name)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-lg">{collab.name || 'Unnamed'}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-gray-500">{collab.email}</p>
                        <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                          {collab.lastActive || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center w-full md:w-auto justify-between md:justify-end gap-2">
                    <span className={`text-sm px-3 py-1 rounded-full ${getRoleBadgeStyle(collab.role)}`}>
                      {collab.role.charAt(0).toUpperCase() + collab.role.slice(1)}
                    </span>
                    <div className="relative">
                      <motion.button
                        className="p-2 rounded-full hover:bg-gray-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRoleChange(collab.id, collab.role === 'editor' ? 'viewer' : 'editor')}
                      >
                        <MoreHorizontal size={18} />
                      </motion.button>
                    </div>
                    <motion.button
                      className="p-2 rounded-full hover:bg-red-200 text-red-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveCollaborator(collab.id)}
                    >
                      <X size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p>No members found.</p>
            )}
          </motion.div>
        </motion.div>
      )}

      {activeTab === 'invites' && (
        <motion.div 
          key="invites"
          className="rounded-xl shadow-lg p-4 md:p-6 mb-6 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h2 className="text-xl font-semibold mb-5">Pending Invitations ({invitations.length})</h2>
          {invitations.length === 0 ? (
            <motion.div className="p-8 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center">
              <Mail size={40} className="mb-3 text-gray-400" />
              <p className="text-lg font-medium mb-1">No pending invitations</p>
              <p className="text-gray-500">Invite team members to start collaborating</p>
            </motion.div>
          ) : (
            <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="show">
              {invitations.map((invite) => (
                <motion.div 
                  key={invite.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  variants={{ hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                  whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="mb-3 sm:mb-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium">{invite.email}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeStyle(invite.role)}`}>
                        {invite.role.charAt(0).toUpperCase() + invite.role.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Invited on {invite.date}</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <motion.button
                      className="flex items-center justify-center py-1.5 px-3 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleResendInvite(invite.email)}
                    >
                      <RefreshCw size={14} className="mr-1" />
                      Resend
                    </motion.button>
                    <motion.button
                      className="flex items-center justify-center py-1.5 px-3 text-sm rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveInvitation(invite.id)}
                    >
                      <X size={14} className="mr-1" />
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MembersList;