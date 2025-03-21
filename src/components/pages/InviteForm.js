import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Copy, Check, AlertCircle } from "lucide-react";
import workspaceService from "../../services/workspaceService";

const InviteForm = ({
  workspace,
  inviteEmail,
  setInviteEmail,
  selectedRole,
  setSelectedRole,
  invitations,
  setInvitations,
  collaborators,
  setCollaborators,
  setIsLoading,
  showNotification,
}) => {
  const [copied, setCopied] = useState(false);
  const [emailError, setEmailError] = useState("");

  const inviteLink = `https://app.example.com/invite/${
    workspace?.id || "ws-1"
  }?code=${generateInviteCode()}`;

  function generateInviteCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(inviteEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (invitations.some((invite) => invite.email === inviteEmail)) {
      setEmailError("This email has already been invited");
      return;
    }

    if (collaborators.some((collab) => collab.email === inviteEmail)) {
      setEmailError("This person is already a collaborator");
      return;
    }

    setIsLoading(true);
    try {
      const memberData = { email: inviteEmail, role: selectedRole };
      const response = await workspaceService.addWorkspaceMember(
        workspace.id,
        memberData
      );

      // Server trả về dữ liệu lời mời, không phải thành viên mới
      const invitationData = response.data; // { invitationId, workspaceId, userId, role }

      // Thêm lời mời vào danh sách invitations
      setInvitations([
        ...invitations,
        {
          id: invitationData.invitationId,
          email: inviteEmail,
          role: invitationData.role,
          workspaceId: invitationData.workspaceId,
          userId: invitationData.userId,
          status: "pending", // Giả định trạng thái mặc định là pending
        },
      ]);

      setInviteEmail("");
      showNotification(`Invitation sent to ${inviteEmail}`);
    } catch (error) {
      console.error("Error inviting member:", error);
      setEmailError(error.message || "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      showNotification("Invite link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      className="rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 backdrop-blur-md bg-white/90 border border-gray-100/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <UserPlus size={20} className="mr-2 text-indigo-500" />
        Invite Collaborators
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 text-gray-700"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                emailError
                  ? "border-red-500 focus:ring-red-500"
                  : "bg-gray-50 border border-gray-200 text-gray-900"
              }`}
              placeholder="colleague@example.com"
              value={inviteEmail}
              onChange={(e) => {
                setInviteEmail(e.target.value);
                if (emailError && validateEmail(e.target.value))
                  setEmailError("");
              }}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>
        </div>
        <div className="w-full md:w-40">
          <label
            htmlFor="role"
            className="block text-sm font-medium mb-2 text-gray-700"
          >
            Role
          </label>
          <select
            id="role"
            className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 border border-gray-200 text-gray-900"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>
        <div className="self-end">
          <motion.button
            className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={handleInvite}
          >
            <Mail size={18} className="mr-2" />
            Send Invite
          </motion.button>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Or share invite link
        </label>
        <div className="flex flex-wrap md:flex-nowrap gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-lg md:rounded-r-none truncate bg-gray-50 border border-gray-200 text-gray-800"
            value={inviteLink}
            readOnly
          />
          <motion.button
            className={`w-full md:w-auto flex items-center justify-center px-5 py-3 md:rounded-l-none rounded-lg font-medium ${
              copied
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCopyLink}
          >
            {copied ? (
              <Check size={18} className="mr-2" />
            ) : (
              <Copy size={18} className="mr-2" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </motion.button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          <AlertCircle size={12} className="inline mr-1" />
          This link expires in 7 days and can be used only once.
        </p>
      </div>
    </motion.div>
  );
};

export default InviteForm;
