import api from './api'; // Assuming this is your axios instance

/**
 * Service for handling workspace-related API calls
 */
const workspaceService = {
  /**
   * Get all workspaces for the current user
   * @returns {Promise} Promise resolving to workspace data
   */
  getWorkspaces: async () => {
    try {
      const response = await api.get('/workspaces');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch workspaces' };
    }
  },

  /**
   * Create a new workspace
   * @param {Object} workspaceData - Object containing name and description
   * @returns {Promise} Promise resolving to created workspace data
   */
  createWorkspace: async (workspaceData) => {
    try {
      const response = await api.post('/workspaces', workspaceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create workspace' };
    }
  },

  /**
   * Get workspace by ID
   * @param {string} id - Workspace ID
   * @returns {Promise} Promise resolving to workspace data
   */
  getWorkspaceById: async (id) => {
    try {
      const response = await api.get(`/workspaces/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch workspace' };
    }
  },

  /**
   * Update workspace information
   * @param {string} id - Workspace ID
   * @param {Object} workspaceData - Object containing name and description
   * @returns {Promise} Promise resolving to updated workspace data
   */
  updateWorkspace: async (id, workspaceData) => {
    try {
      const response = await api.put(`/workspaces/${id}`, workspaceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update workspace' };
    }
  },

  /**
   * Delete a workspace
   * @param {string} id - Workspace ID
   * @returns {Promise} Promise resolving to success message
   */
  deleteWorkspace: async (id) => {
    try {
      const response = await api.delete(`/workspaces/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete workspace' };
    }
  },

  /**
   * Get all members of a workspace
   * @param {string} id - Workspace ID
   * @returns {Promise} Promise resolving to workspace members data
   */
  getWorkspaceMembers: async (id) => {
    try {
      const response = await api.get(`/workspaces/${id}/members`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch workspace members' };
    }
  },


  /**
 * Add a member to workspace
 * @param {string} id - Workspace ID
 * @param {Object} memberData - Object containing email and role
 * @returns {Promise} Promise resolving to invitation data
 */
addWorkspaceMember: async (id, memberData) => {
    try {
      const response = await api.post(`/workspaces/${id}/members`, memberData);
      return response.data; // Trả về { success, message, data: { invitationId, workspaceId, userId, role } }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add workspace member' };
    }
  },

  /**
   * Update a member's role in workspace
   * @param {string} workspaceId - Workspace ID
   * @param {string} userId - User ID
   * @param {Object} roleData - Object containing role
   * @returns {Promise} Promise resolving to updated role data
   */
  updateMemberRole: async (workspaceId, userId, roleData) => {
    try {
      const response = await api.put(`/workspaces/${workspaceId}/members/${userId}`, roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update member role' };
    }
  },

  /**
   * Remove a member from workspace
   * @param {string} workspaceId - Workspace ID
   * @param {string} userId - User ID
   * @returns {Promise} Promise resolving to success message
   */
  removeMember: async (workspaceId, userId) => {
    try {
      const response = await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove member' };
    }
  }
};

export default workspaceService;