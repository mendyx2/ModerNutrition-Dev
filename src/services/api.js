import axios from 'axios';

let inMemoryToken = null;

export const setAuthToken = (token) => {
  inMemoryToken = token;
};

export const getAuthToken = () => inMemoryToken;

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor to attach in-memory Sanctum Bearer token
api.interceptors.request.use((config) => {
  if (inMemoryToken) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`;
  }
  return config;
});

// Interceptor for clearer network failure diagnosis
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
