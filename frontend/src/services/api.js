import axios from 'axios';

// Base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://s62-johnrobert-capstone-skillsamaritan.onrender.com/api';

// Create axios instance
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - automatically attach Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 globally
API.interceptors.response.use(
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
  login: (credentials) => API.post('/auth/login', credentials),

  /**
   * Signup new user
   * @param {Object} userData - { name, email, password, skills }
   */
  signup: (userData) => API.post('/auth/signup', userData),
};

// ============================================
// Task API Methods
// ============================================

export const taskAPI = {
  /**
   * Get all tasks
   * @param {Object} params - Optional query parameters (status, search, etc.)
   */
  getAllTasks: () => API.get('/tasks'),

  /**
   * Get single task by ID
   * @param {string} taskId
   */
  getTaskById: (taskId) => API.get('/tasks/' + taskId),

  /**
   * Create new task
   * @param {Object} taskData - { title, description, points, skillsRequired }
   */
  createTask: (taskData) => API.post('/tasks', taskData),

  /**
   * Accept a task
   * @param {string} taskId
   */
  acceptTask: (taskId) => API.post('/tasks/' + taskId + '/accept'),

  /**
   * Complete a task
   * @param {string} taskId
   */
  completeTask: (taskId) => API.post('/tasks/' + taskId + '/complete'),
};

// ============================================
// User API Methods
// ============================================

export const userAPI = {
  /**
   * Get all users
   */
  getAllUsers: () => API.get('/users'),

  /**
   * Update user profile
   * @param {string} userId
   * @param {Object} userData
   */
  updateUser: (userId, userData) => API.put('/users/' + userId, userData),
};

// Export the configured axios instance as default
export default API;
