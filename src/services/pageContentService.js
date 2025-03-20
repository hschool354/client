import api from "./api";

/**
 * Service quản lý nội dung trang và phiên bản
 */

/**
 * Lấy nội dung trang từ server
 * @param {string} pageId - ID của trang
 * @returns {Promise<Object>} - Nội dung trang bao gồm blocks và thông tin phiên bản
 */
export const getPageContent = async (pageId) => {
  try {
    const response = await api.get(`/pages/${pageId}/content`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy nội dung trang:", error);
    throw error;
  }
};

/**
 * Cập nhật nội dung trang
 * @param {string} pageId - ID của trang
 * @param {Array} blocks - Các block nội dung cần cập nhật
 * @returns {Promise<Object>} - Kết quả cập nhật với thông tin phiên bản mới
 */
export const updatePageContent = async (pageId, blocks) => {
  try {
    const response = await api.put(`/pages/${pageId}/content`, { blocks });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật nội dung trang:", error);
    throw error;
  }
};

/**
 * Lấy lịch sử chỉnh sửa của trang
 * @param {string} pageId - ID của trang
 * @returns {Promise<Object>} - Lịch sử chỉnh sửa của trang
 */
export const getPageHistory = async (pageId) => {
  try {
    const response = await api.get(`/pages/${pageId}/history`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử chỉnh sửa:", error);
    throw error;
  }
};

/**
 * Lấy phiên bản cụ thể của trang
 * @param {string} pageId - ID của trang
 * @param {number} version - Số phiên bản cần lấy
 * @returns {Promise<Object>} - Nội dung của phiên bản cụ thể
 */
export const getPageVersion = async (pageId, version) => {
  try {
    const response = await api.get(`/pages/${pageId}/history/${version}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy phiên bản trang:", error);
    throw error;
  }
};

/**
 * Khôi phục trang về phiên bản cũ
 * @param {string} pageId - ID của trang
 * @param {number} version - Số phiên bản cần khôi phục
 * @returns {Promise<Object>} - Kết quả khôi phục
 */
export const restorePageVersion = async (pageId, version) => {
  try {
    const response = await api.post(`/pages/${pageId}/restore/${version}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi khôi phục phiên bản trang:", error);
    throw error;
  }
};

/**
 * Lưu nội dung trang và cập nhật metadata
 * @param {Object} pageData - Dữ liệu trang (id, title, icon, ...)
 * @param {Array} blocks - Nội dung của trang
 * @returns {Promise<Object>} - Kết quả lưu trang
 */
export const savePage = async (pageData, blocks) => {
  try {
    // Cập nhật metadata của trang (từ pageService)
    const metaResponse = await api.put(`/pages/${pageData.id}`, {
      title: pageData.title,
      icon: pageData.icon,
      cover_url: pageData.coverUrl,
      is_public: pageData.isPublic,
      parent_page_id: pageData.parentPageId
    });
    
    // Cập nhật nội dung của trang
    const contentResponse = await updatePageContent(pageData.id, blocks);
    
    return {
      success: true,
      page: metaResponse.data,
      content: contentResponse
    };
  } catch (error) {
    console.error("Lỗi khi lưu trang:", error);
    throw error;
  }
};

/**
 * Xử lý cập nhật tự động nội dung trang (autosave)
 * @param {string} pageId - ID của trang 
 * @param {Array} blocks - Nội dung trang cần lưu tự động
 * @returns {Promise<Object>} - Kết quả autosave
 */
export const autoSavePageContent = async (pageId, blocks) => {
  try {
    const response = await updatePageContent(pageId, blocks);
    console.log("Đã lưu tự động trang:", pageId);
    return {
      success: true,
      version: response.version
    };
  } catch (error) {
    console.error("Lỗi khi tự động lưu nội dung trang:", error);
    throw error;
  }
};

/**
 * Tìm kiếm trong nội dung trang
 * @param {string} pageId - ID của trang 
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @returns {Promise<Array>} - Kết quả tìm kiếm
 */
export const searchInPageContent = async (pageId, searchTerm) => {
  try {
    // Lấy nội dung trang
    const content = await getPageContent(pageId);
    
    // Tìm kiếm trong blocks
    const results = content.blocks.filter(block => {
      // Kiểm tra trong các trường phổ biến của block (tùy vào cấu trúc dữ liệu của bạn)
      if (block.content && typeof block.content === 'string') {
        return block.content.toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      if (block.text && typeof block.text === 'string') {
        return block.text.toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      // Thêm các trường khác nếu cần
      
      return false;
    });
    
    return results;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm trong nội dung trang:", error);
    throw error;
  }
};
