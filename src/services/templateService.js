import api from './api';

/**
 * Lấy danh sách templates của người dùng hiện tại
 * @param {Object} params - Tham số filter (workspaceId, category)
 * @returns {Promise} Promise trả về danh sách templates của người dùng
 */
export const getMyTemplates = async (params = {}) => {
  try {
    const response = await api.get('/templates/my-templates', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy danh sách templates của tôi' };
  }
};

/**
 * Lấy danh sách tất cả templates công khai
 * @param {Object} params - Tham số filter (category)
 * @returns {Promise} Promise trả về danh sách tất cả templates công khai
 */
export const getPublicTemplates = async (params = {}) => {
  try {
    const response = await api.get('/templates/public-templates', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy danh sách templates công khai' };
  }
};

/**
 * Lấy danh sách templates (kết hợp cả của người dùng và công khai - tùy chọn)
 * @param {Object} params - Tham số filter (workspaceId, category)
 * @returns {Promise} Promise trả về danh sách templates
 */
export const getTemplates = async (params = {}) => {
  try {
    const response = await api.get('/templates', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy danh sách templates' };
  }
};

/**
 * Tạo template mới
 * @param {Object} templateData - Dữ liệu template (name, description, content, workspaceId, category, isPublic)
 * @returns {Promise} Promise trả về thông tin template vừa tạo
 */
export const createTemplate = async (templateData) => {
  try {
    const response = await api.post('/templates', templateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể tạo template mới' };
  }
};

/**
 * Lấy thông tin chi tiết của một template
 * @param {string} id - ID của template
 * @returns {Promise} Promise trả về thông tin chi tiết của template
 */
export const getTemplateById = async (id) => {
  try {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy thông tin template' };
  }
};

/**
 * Cập nhật template
 * @param {string} id - ID của template
 * @param {Object} templateData - Dữ liệu cập nhật (name, description, content, category, isPublic)
 * @returns {Promise} Promise trả về thông tin template đã cập nhật
 */
export const updateTemplate = async (id, templateData) => {
  try {
    const response = await api.put(`/templates/${id}`, templateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể cập nhật template' };
  }
};

/**
 * Xóa template
 * @param {string} id - ID của template
 * @returns {Promise} Promise trả về thông báo xóa thành công
 */
export const deleteTemplate = async (id) => {
  try {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể xóa template' };
  }
};

/**
 * Áp dụng template vào trang
 * @param {string} pageId - ID của trang
 * @param {string} templateId - ID của template
 * @param {Object} options - Tùy chọn (overwrite)
 * @returns {Promise} Promise trả về thông tin trang sau khi áp dụng template
 */
export const applyTemplate = async (pageId, templateId, options = {}) => {
    try {
      const response = await api.post(`/templates/pages/${pageId}/apply-template/${templateId}`, options);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể áp dụng template' };
    }
  };

export default {
  getTemplates,
  getMyTemplates,
  getPublicTemplates,
  createTemplate,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  applyTemplate
};