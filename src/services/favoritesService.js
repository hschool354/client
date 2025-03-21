import api from './api'; 

/**
 * Lấy danh sách trang yêu thích của người dùng
 * @returns {Promise} - Promise chứa danh sách các trang yêu thích
 */
export const getFavorites = async () => {
  try {
    const response = await api.get('/favorites');
    return response.data.favorites; // Trả về mảng favorites từ response
  } catch (error) {
    console.error('Error fetching favorites:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Không thể lấy danh sách yêu thích' };
  }
};

/**
 * Thêm một trang vào danh sách yêu thích
 * @param {string} pageId - ID của trang cần thêm vào yêu thích
 * @returns {Promise} - Promise chứa thông tin kết quả thêm
 */
export const addFavorite = async (pageId) => {
  try {
    const response = await api.post('/favorites', { pageId });
    return response.data; // Trả về { message, pageId }
  } catch (error) {
    console.error('Error adding favorite:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Không thể thêm trang vào yêu thích' };
  }
};

/**
 * Xóa một trang khỏi danh sách yêu thích
 * @param {string} pageId - ID của trang cần xóa khỏi yêu thích
 * @returns {Promise} - Promise chứa thông tin kết quả xóa
 */
export const removeFavorite = async (pageId) => {
  try {
    const response = await api.delete(`/favorites/${pageId}`);
    return response.data; // Trả về { message, pageId }
  } catch (error) {
    console.error('Error removing favorite:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Không thể xóa trang khỏi yêu thích' };
  }
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
};