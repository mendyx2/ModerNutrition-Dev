import axios from 'axios';

let inMemoryToken = localStorage.getItem('mn_member_token') || null;

export const setAuthToken = (token) => {
  inMemoryToken = token;
  if (token) {
    localStorage.setItem('mn_member_token', token);
  } else {
    localStorage.removeItem('mn_member_token');
  }
};

export const getAuthToken = () => inMemoryToken || localStorage.getItem('mn_member_token');

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://modernutrition-backend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor to attach Sanctum Bearer token from memory or storage
api.interceptors.request.use((config) => {
  const currentToken = inMemoryToken || localStorage.getItem('mn_member_token');
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

// Interceptor for clearer network failure diagnosis
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired
      localStorage.removeItem('mn_member_token');
      localStorage.removeItem('mn_member_user');
      inMemoryToken = null;
    }
    if (error.message === 'Network Error') {
      const isLocalhost = API_BASE_URL.includes('localhost');
      const customMsg = isLocalhost
        ? 'Cannot reach API (VITE_API_URL is set to localhost in production). Please set VITE_API_URL in Vercel to your live Railway/Render backend URL.'
        : `Cannot connect to live API at (${API_BASE_URL}). Please verify your backend server is online.`;
      
      error.response = {
        data: { message: customMsg }
      };
    }
    return Promise.reject(error);
  }
);

export default api;
