import axios from 'axios';

// Base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://s62-johnrobert-capstone-skillsamaritan.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - automatically attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - logout user
    if (error.response && error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
      
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// Authentication API Methods
// ============================================

export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   */
  login: (credentials) => api.post('/auth/login', credentials),

  /**
   * Signup new user
   * @param {Object} userData - { name, email, password, skills }
   */
  signup: (userData) => api.post('/auth/signup', userData),

  /**
   * Get current user profile
   */
  getProfile: () => api.get('/auth/profile'),
};

// ============================================
// Task API Methods
// ============================================

export const taskAPI = {
  /**
   * Get all tasks
   * @param {Object} params - Optional query parameters (status, search, etc.)
   */
  getAllTasks: (params = {}) => api.get('/tasks', { params }),

  /**
   * Get single task by ID
   * @param {string} taskId
   */
  getTaskById: (taskId) => api.get(`/tasks/${taskId}`),

  /**
   * Create new task
   * @param {Object} taskData - { title, description, points, skillsRequired }
   */
  createTask: (taskData) => api.post('/tasks', taskData),

  /**
   * Accept a task
   * @param {string} taskId
   */
  acceptTask: (taskId) => api.put(`/tasks/accept/${taskId}`),

  /**
   * Complete a task
   * @param {string} taskId
   */
  completeTask: (taskId) => api.put(`/tasks/complete/${taskId}`),

  /**
   * Update task
   * @param {string} taskId
   * @param {Object} taskData
   */
  updateTask: (taskId, taskData) => api.put(`/tasks/${taskId}`, taskData),

  /**
   * Delete task
   * @param {string} taskId
   */
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
};

// ============================================
// User API Methods
// ============================================

export const userAPI = {
  /**
   * Get all users
   */
  getAllUsers: () => api.get('/users'),

  /**
   * Get user by ID
   * @param {string} userId
   */
  getUserById: (userId) => api.get(`/users/${userId}`),

  /**
   * Update user profile
   * @param {string} userId
   * @param {Object} userData
   */
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),

  /**
   * Get user's tasks (created and accepted)
   * @param {string} userId
   */
  getUserTasks: (userId) => api.get(`/users/${userId}/tasks`),
};

// ============================================
// Contact API Methods
// ============================================

export const contactAPI = {
  /**
   * Send contact form message
   * @param {Object} contactData - { name, email, subject, message }
   */
  sendMessage: (contactData) => api.post('/contact', contactData),
};

// Export the configured axios instance as default
export default api;
