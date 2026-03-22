import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://assetverse-backend-topaz.vercel.app/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============AUTH APIS ===========

export const authAPI = {
  registerHR: (data) => apiClient.post('/auth/register-hr', data),
  registerEmployee: (data) => apiClient.post('/auth/register-employee', data),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
};

// ========== ASSET APIS ===========

export const assetAPI = {
  addAsset: (data) => apiClient.post('/assets', data),
  getAssets: (page = 1, limit = 10) => apiClient.get(`/assets?page=${page}&limit=${limit}`),
  getAvailableAssets: () => apiClient.get('/assets/available'),
  updateAsset: (id, data) => apiClient.put(`/assets/${id}`, data),
  deleteAsset: (id) => apiClient.delete(`/assets/${id}`),
};

// =========== HR APIS ===========

export const hrAPI = {
  getEmployees: () => apiClient.get('/employees'),
};

// ========= REQUEST APIS ==========

export const requestAPI = {
  createRequest: (data) => apiClient.post('/requests', data),
  getRequests: () => apiClient.get('/requests'),
  approveRequest: (id) => apiClient.put(`/requests/${id}/approve`),
  rejectRequest: (id) => apiClient.put(`/requests/${id}/reject`),
};

// ========= EMPLOYEE APIS ==========

export const employeeAPI = {
  getMyAssets: () => apiClient.get('/my-assets'),
  getMyAffiliations: () => apiClient.get('/my-affiliations'),
  returnAsset: (id) => apiClient.put(`/return-asset/${id}`),
};

// =========USER APIS ==========

export const userAPI = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data) => apiClient.put('/user/profile', data),
};

// ========= PUBLIC APIS ==========

export const publicAPI = {
  getPackages: () => apiClient.get('/packages'),
  getStats: () => apiClient.get('/stats'),
};

// ======== HEALTH CHECK ========

export const healthAPI = {
  check: () => apiClient.get('/health'),
};

export default apiClient;
