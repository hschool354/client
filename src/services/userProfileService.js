import api from './api';

/**
 * Lấy thông tin profile người dùng hiện tại
 * @returns {Promise} Promise trả về thông tin profile người dùng
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/usersProfile'); // Đảm bảo endpoint đúng với server
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy thông tin profile' };
  }
};

/**
 * Cập nhật thông tin profile người dùng
 * @param {Object} profileData - Dữ liệu profile (full_name, email)
 * @returns {Promise} Promise trả về thông tin profile đã cập nhật
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/usersProfile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể cập nhật thông tin profile' };
  }
};

/**
 * Cập nhật avatar người dùng
 * @param {File} avatarFile - File ảnh được chọn từ input
 * @returns {Promise} Promise trả về thông tin avatar đã cập nhật
 */
export const updateUserAvatar = async (avatarFile) => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await api.put('/usersProfile/avatar', formData, { // Sửa URL thành /users/avatar
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể cập nhật avatar' };
  }
};

/**
 * Lấy cài đặt người dùng
 * @returns {Promise} Promise trả về cài đặt người dùng
 */
export const getUserSettings = async () => {
  try {
    const response = await api.get('/users/settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy cài đặt người dùng' };
  }
};

/**
 * Cập nhật cài đặt người dùng
 * @param {Object} settingsData - Dữ liệu cài đặt (theme, language, notifications_enabled, ...)
 * @returns {Promise} Promise trả về cài đặt đã cập nhật
 */
export const updateUserSettings = async (settingsData) => {
  try {
    const response = await api.put('/users/settings', settingsData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể cập nhật cài đặt người dùng' };
  }
};

/**
 * Xóa tài khoản người dùng
 * @returns {Promise} Promise trả về thông báo xóa thành công
 */
export const deleteUserAccount = async () => {
  try {
    const response = await api.delete('/users/account');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể xóa tài khoản' };
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  getUserSettings,
  updateUserSettings,
  deleteUserAccount
};