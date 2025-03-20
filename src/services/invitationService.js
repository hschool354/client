import api from './api';

/**
 * Get all invitations for the current user
 * @returns {Promise} Promise resolving to invitations data
 */
export const getUserInvitations = async () => {
    try {
        const response = await api.get('/invitations');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch invitations' };
    }
};

/**
 * Create an invitation to a workspace
 * @param {string} workspaceId - Workspace ID
 * @param {Object} invitationData - Object containing email and role
 * @returns {Promise} Promise resolving to created invitation data
 */
export const createInvitation = async (workspaceId, invitationData) => {
    try {
        const response = await api.post(`/workspaces/${workspaceId}/invitations`, invitationData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create invitation' };
    }
};

/**
 * Accept an invitation
 * @param {string} id - Invitation ID
 * @returns {Promise} Promise resolving to success message
 */
export const acceptInvitation = async (id) => {
    try {
        const response = await api.put(`/invitations/${id}/accept`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to accept invitation' };
    }
};

/**
 * Decline an invitation
 * @param {string} id - Invitation ID
 * @returns {Promise} Promise resolving to success message
 */
export const declineInvitation = async (id) => {
    try {
        const response = await api.put(`/invitations/${id}/decline`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to decline invitation' };
    }
};

/**
 * Cancel a pending invitation
 * @param {string} id - Invitation ID
 * @returns {Promise} Promise resolving to success message
 */
export const cancelInvitation = async (id) => {
    try {
        const response = await api.delete(`/invitations/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to cancel invitation' };
    }
};
