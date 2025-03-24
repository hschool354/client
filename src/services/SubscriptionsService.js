import api from './api';

/**
 * Lấy thông tin gói đăng ký hiện tại của người dùng.
 * @async
 * @returns {Promise} Promise trả về thông tin gói đăng ký hiện tại hoặc null nếu không có.
 * @throws {Error} Ném lỗi nếu không thể lấy thông tin gói đăng ký.
 * @example
 * const subscription = await getCurrentSubscription();
 * console.log(subscription); // { id, planType, startDate, endDate, status }
 */
export const getCurrentSubscription = async () => {
  try {
    const response = await api.get('/subscriptions/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy thông tin gói đăng ký' };
  }
};

/**
 * Nâng cấp gói đăng ký từ FREE lên PREMIUM.
 * @async
 * @returns {Promise} Promise trả về thông tin gói đăng ký mới sau khi nâng cấp.
 * @throws {Error} Ném lỗi nếu không thể nâng cấp gói đăng ký.
 * @example
 * const newSubscription = await upgradeSubscription();
 * console.log(newSubscription); // { id, planType: 'PREMIUM', startDate, endDate, status }
 */
export const upgradeSubscription = async () => {
  try {
    const response = await api.post('/subscriptions/upgrade');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể nâng cấp gói đăng ký' };
  }
};

/**
 * Hủy gói đăng ký hiện tại (chuyển trạng thái thành CANCELLED).
 * @async
 * @returns {Promise} Promise trả về thông báo hủy thành công.
 * @throws {Error} Ném lỗi nếu không thể hủy gói đăng ký.
 * @example
 * const result = await cancelSubscription();
 * console.log(result); // { message: 'Subscription cancelled successfully' }
 */
export const cancelSubscription = async () => {
  try {
    const response = await api.post('/subscriptions/cancel');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể hủy gói đăng ký' };
  }
};

export default {
  getCurrentSubscription,
  upgradeSubscription,
  cancelSubscription,
};