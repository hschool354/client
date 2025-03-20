import api from "./api";

/**
 * Tạo block mới
 * @param {Object} blockData - Dữ liệu block (pageId, type, content, position, properties)
 * @returns {Promise} - Promise chứa thông tin block mới
 */
export const createBlock = async (blockData) => {
  try {
    const response = await api.post("/blocks", blockData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo block mới:", error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết của block
 * @param {string} blockId - ID của block
 * @returns {Promise} - Promise chứa thông tin chi tiết block
 */
export const getBlock = async (blockId) => {
  try {
    const response = await api.get(`/blocks/${blockId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin block:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin block
 * @param {string} blockId - ID của block
 * @param {Object} updateData - Dữ liệu cập nhật (content, type, properties)
 * @returns {Promise} - Promise chứa thông tin block sau khi cập nhật
 */
export const updateBlock = async (blockId, updateData) => {
  try {
    const response = await api.put(`/blocks/${blockId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật block:", error);
    throw error;
  }
};

/**
 * Xóa block
 * @param {string} blockId - ID của block
 * @returns {Promise} - Promise chứa kết quả xóa block
 */
export const deleteBlock = async (blockId) => {
  try {
    const response = await api.delete(`/blocks/${blockId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa block:", error);
    throw error;
  }
};

/**
 * Thay đổi vị trí block
 * @param {string} blockId - ID của block
 * @param {number} position - Vị trí mới
 * @returns {Promise} - Promise chứa kết quả thay đổi vị trí
 */
export const updateBlockPosition = async (blockId, position) => {
  try {
    const response = await api.put(`/blocks/${blockId}/position`, { position });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thay đổi vị trí block:", error);
    throw error;
  }
};

/**
 * Nhân bản block
 * @param {string} blockId - ID của block cần nhân bản
 * @returns {Promise} - Promise chứa thông tin block mới được nhân bản
 */
export const duplicateBlock = async (blockId) => {
  try {
    const response = await api.post(`/blocks/${blockId}/duplicate`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi nhân bản block:", error);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả các block của một trang
 * @param {string} pageId - ID của trang
 * @returns {Promise} - Promise chứa danh sách các block
 */
export const getPageBlocks = async (pageId) => {
  try {
    // Giả sử bạn có endpoint để lấy tất cả block của một trang
    const response = await api.get(`/pages/${pageId}/blocks`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách block của trang:", error);
    throw error;
  }
};

/**
 * Tạo nhiều block cùng lúc
 * @param {Array} blocksData - Mảng dữ liệu các block cần tạo
 * @returns {Promise} - Promise chứa thông tin các block mới
 */
export const createMultipleBlocks = async (blocksData) => {
  try {
    // Giả sử bạn có endpoint để tạo nhiều block cùng lúc
    const response = await api.post("/blocks/batch", { blocks: blocksData });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo nhiều block:", error);
    throw error;
  }
};

/**
 * Cập nhật nhiều block cùng lúc
 * @param {Array} blocksData - Mảng dữ liệu các block cần cập nhật
 * @returns {Promise} - Promise chứa thông tin các block sau khi cập nhật
 */
export const updateMultipleBlocks = async (blocksData) => {
  try {
    // Giả sử bạn có endpoint để cập nhật nhiều block cùng lúc
    const response = await api.put("/blocks/batch", { blocks: blocksData });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật nhiều block:", error);
    throw error;
  }
};

/**
 * Thêm block con vào block cha
 * @param {string} parentBlockId - ID của block cha
 * @param {string} childBlockId - ID của block con
 * @returns {Promise} - Promise chứa kết quả thêm block con
 */
export const addChildBlock = async (parentBlockId, childBlockId) => {
  try {
    const response = await api.post(`/blocks/${parentBlockId}/children`, {
      childBlockId
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm block con:", error);
    throw error;
  }
};

/**
 * Xóa block con khỏi block cha
 * @param {string} parentBlockId - ID của block cha
 * @param {string} childBlockId - ID của block con
 * @returns {Promise} - Promise chứa kết quả xóa block con
 */
export const removeChildBlock = async (parentBlockId, childBlockId) => {
  try {
    const response = await api.delete(`/blocks/${parentBlockId}/children/${childBlockId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa block con:", error);
    throw error;
  }
};