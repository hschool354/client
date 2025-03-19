import api from './api';

// Constants
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Service để xử lý các hoạt động liên quan đến xác thực người dùng.
 */
const authService = {
  /**
   * Đăng ký người dùng mới.
   * @param {Object} userData - Thông tin người dùng: email, password, fullName
   * @returns {Promise<Object>} - Kết quả từ server bao gồm thông báo và userId
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw _handleError(error);
    }
  },

  /**
   * Đăng nhập người dùng.
   * @param {Object} credentials - Thông tin đăng nhập: email, password
   * @returns {Promise<Object>} - Thông tin người dùng và token
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, refreshToken, user } = response.data;
      
      // Lưu token và thông tin người dùng vào localStorage
      _saveAuthData(token, refreshToken, user);
      
      return { user, token };
    } catch (error) {
      throw _handleError(error);
    }
  },

  /**
   * Đăng xuất người dùng hiện tại.
   * @returns {Promise<Object>} - Kết quả từ server
   */
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const response = await api.post('/auth/logout', { refreshToken });
      
      // Xóa dữ liệu xác thực khỏi localStorage sau khi đăng xuất
      _clearAuthData();
      
      return response.data;
    } catch (error) {
      // Xóa dữ liệu xác thực khỏi localStorage ngay cả khi có lỗi
      _clearAuthData();
      throw _handleError(error);
    }
  },

  /**
   * Làm mới Access Token bằng Refresh Token.
   * @returns {Promise<string>} - Token mới
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { token } = response.data;
      
      // Lưu token mới vào localStorage
      localStorage.setItem(TOKEN_KEY, token);
      
      return token;
    } catch (error) {
      // Nếu refresh token không hợp lệ, xóa dữ liệu xác thực
      _clearAuthData();
      throw _handleError(error);
    }
  },

  /**
   * Gửi yêu cầu đặt lại mật khẩu.
   * @param {string} email - Email của người dùng
   * @returns {Promise<Object>} - Kết quả từ server
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw _handleError(error);
    }
  },

  /**
   * Đặt lại mật khẩu bằng token.
   * @param {Object} resetData - Dữ liệu đặt lại mật khẩu: token, newPassword
   * @returns {Promise<Object>} - Kết quả từ server
   */
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw _handleError(error);
    }
  },

  /**
   * Lấy token đặt lại mật khẩu trong môi trường phát triển.
   * @param {string} email - Email của người dùng
   * @returns {Promise<Object>} - Token đặt lại mật khẩu và URL
   */
  getDevResetToken: async (email) => {
    try {
      const response = await api.get(`/auth/dev-reset-token?email=${email}`);
      return response.data;
    } catch (error) {
      throw _handleError(error);
    }
  },

  /**
   * Lấy thông tin người dùng hiện tại.
   * @returns {Promise<Object>} - Thông tin người dùng
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw _handleError(error);
    }
  },

  /**
   * Cập nhật thông tin người dùng trong localStorage.
   * @param {Object} userData - Thông tin người dùng mới
   */
  updateUserData: (userData) => {
    const storedUser = JSON.parse(localStorage.getItem(USER_KEY)) || {};
    const updatedUser = { ...storedUser, ...userData };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  /**
   * Kiểm tra xem người dùng đã đăng nhập hay chưa.
   * @returns {boolean} - true nếu đã đăng nhập, false nếu chưa
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  /**
   * Lấy token xác thực hiện tại.
   * @returns {string|null} - Token hoặc null nếu không có
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Lấy thông tin người dùng từ localStorage.
   * @returns {Object|null} - Thông tin người dùng hoặc null nếu không có
   */
  getUser: () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Thêm hoặc cập nhật token trong localStorage.
   * @param {string} token - Token mới
   */
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Lưu dữ liệu xác thực vào localStorage.
 * @param {string} token - JWT token
 * @param {string} refreshToken - Refresh token
 * @param {Object} user - Thông tin người dùng
 * @private
 */
const _saveAuthData = (token, refreshToken, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Xóa dữ liệu xác thức khỏi localStorage.
 * @private
 */
const _clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Xử lý lỗi từ API.
 * @param {Error} error - Lỗi từ axios
 * @returns {Error} - Lỗi đã được xử lý
 * @private
 */
const _handleError = (error) => {
  // Kiểm tra xem lỗi có phải từ response không
  if (error.response) {
    // Server trả về lỗi với status code
    const { status, data } = error.response;
    
    // Xử lý lỗi 401 (Unauthorized)
    if (status === 401) {
      // Xóa dữ liệu xác thực nếu token hết hạn hoặc không hợp lệ
      _clearAuthData();
    }
    
    // Trả về thông báo lỗi từ server nếu có
    return new Error(data.message || 'Authentication error');
  } else if (error.request) {
    // Yêu cầu đã được gửi nhưng không nhận được phản hồi
    return new Error('No response from server');
  } else {
    // Lỗi trong quá trình thiết lập request
    return new Error('Error setting up request');
  }
};

export default authService;