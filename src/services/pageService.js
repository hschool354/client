import api from "./api";

/**
 * Fetches page data from the server
 * @param {string} workspaceId - The ID of the workspace
 * @returns {Promise} - The page data
 */
export const fetchPageData = async (pageId) => {
    try {
      const response = await getPageDetails(pageId); // Gọi API thực
      console.log("Fetched page data:", response);
      return {
        page: {
          id: response.id,
          title: response.title || 'Untitled',
          icon: response.icon || '📄',
          coverUrl: response.cover_url || '',
          isPublic: response.is_public || false,
        },
        blocks: response.blocks || [],
        pageHistory: response.history || [],
        pageTags: response.tags || [],
        recentPages: response.recent_pages || [],
      };
    } catch (error) {
      console.error("Error fetching page data:", error);
      throw error;
    }
  };

/**
 * Saves page data to the server
 * @param {Object} data - The page data to save
 * @returns {Promise} - The result of the save operation
 */
export const savePage = async (data) => {
    try {
      const { page, blocks } = data;
      // Lưu metadata page
      const pageResponse = await updatePage(page.id, {
        title: page.title,
        icon: page.icon,
        cover_url: page.coverUrl,
        is_public: page.isPublic,
      });
      // Lưu blocks
      const contentResponse = await savePageContent(page.id, blocks);
      return { success: true, page: pageResponse, blocks: contentResponse };
    } catch (error) {
      console.error("Error saving page:", error);
      throw error;
    }
  };

/**
 * Lấy danh sách trang trong workspace
 * @param {string} workspaceId - ID của workspace
 * @returns {Promise} - Promise chứa danh sách trang
 */
export const getWorkspacePages = async (workspaceId) => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}/pages`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách trang:", error);
    throw error;
  }
};

/**
 * Tạo trang mới trong workspace
 * @param {string} workspaceId - ID của workspace
 * @param {Object} pageData - Dữ liệu trang mới (title, icon, parent_page_id)
 * @returns {Promise} - Promise chứa thông tin trang mới
 */
export const createPage = async (workspaceId, pageData) => {
  try {
    const response = await api.post(
      `/workspaces/${workspaceId}/pages`,
      pageData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo trang mới:", error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết của trang
 * @param {string} pageId - ID của trang
 * @returns {Promise} - Promise chứa thông tin chi tiết trang
 */
export const getPageDetails = async (pageId) => {
  try {
    const response = await api.get(`/pages/${pageId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin trang:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin trang
 * @param {string} pageId - ID của trang
 * @param {Object} updateData - Dữ liệu cập nhật (title, icon, cover_url, is_public, parent_page_id)
 * @returns {Promise} - Promise chứa thông tin trang sau khi cập nhật
 */
export const updatePage = async (pageId, updateData) => {
  try {
    const response = await api.put(`/pages/${pageId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trang:", error);
    throw error;
  }
};

/**
 * Xóa trang
 * @param {string} pageId - ID của trang
 * @returns {Promise} - Promise chứa kết quả xóa trang
 */
export const deletePage = async (pageId) => {
  try {
    const response = await api.delete(`/pages/${pageId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa trang:", error);
    throw error;
  }
};

/**
 * Nhân bản trang
 * @param {string} pageId - ID của trang cần nhân bản
 * @returns {Promise} - Promise chứa thông tin trang mới được nhân bản
 */
export const duplicatePage = async (pageId) => {
  try {
    const response = await api.post(`/pages/${pageId}/duplicate`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi nhân bản trang:", error);
    throw error;
  }
};

/**
 * Lưu nội dung trang
 * @param {string} pageId - ID của trang
 * @param {Array} blocks - Mảng các block nội dung
 * @returns {Promise} - Promise chứa kết quả lưu nội dung
 */
export const savePageContent = async (pageId, blocks) => {
  try {
    // Giả sử bạn có endpoint riêng cho việc lưu nội dung
    const response = await api.post(`/pages/${pageId}/content`, { blocks });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lưu nội dung trang:", error);
    throw error;
  }
};

/**
 * Lấy lịch sử chỉnh sửa trang
 * @param {string} pageId - ID của trang
 * @returns {Promise} - Promise chứa lịch sử chỉnh sửa
 */
export const getPageHistory = async (pageId) => {
  try {
    const response = await api.get(`/pages/${pageId}/history`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử trang:", error);
    throw error;
  }
};

/**
 * Thêm trang vào danh sách yêu thích
 * @param {string} pageId - ID của trang
 * @returns {Promise} - Promise chứa kết quả thêm vào yêu thích
 */
export const addToFavorites = async (pageId) => {
  try {
    const response = await api.post(`/favorites`, { page_id: pageId });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm trang vào yêu thích:", error);
    throw error;
  }
};

/**
 * Xóa trang khỏi danh sách yêu thích
 * @param {string} pageId - ID của trang
 * @returns {Promise} - Promise chứa kết quả xóa khỏi yêu thích
 */
export const removeFromFavorites = async (pageId) => {
  try {
    const response = await api.delete(`/favorites/page/${pageId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa trang khỏi yêu thích:", error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái công khai của trang
 * @param {string} pageId - ID của trang
 * @param {boolean} isPublic - Trạng thái công khai
 * @returns {Promise} - Promise chứa kết quả cập nhật
 */
export const updatePageVisibility = async (pageId, isPublic) => {
  try {
    const response = await api.patch(`/pages/${pageId}/visibility`, {
      is_public: isPublic,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái công khai:", error);
    throw error;
  }
};

/**
 * Lấy thông tin trang từ share link
 * @param {string} shareLink - Link chia sẻ
 * @returns {Promise} - Promise chứa thông tin trang
 */
export const getPageByShareLink = async (shareLink) => {
  try {
    const response = await api.get(`/shared/${shareLink}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy trang từ link chia sẻ:", error);
    throw error;
  }
};
