import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if it's an authenticated endpoint (not login/register)
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                             error.config?.url?.includes('/auth/register');
      
      // Only logout and redirect if it's NOT a login/register attempt
      if (!isAuthEndpoint) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    
    // Log errors for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    
    return Promise.reject(error);
  }
);

// Analytics tracking helper
export const trackEvent = async (action, metadata = {}) => {
  try {
    await api.post('/analytics/track', { action, metadata });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    if (process.env.NODE_ENV === 'development') {
      console.error('Analytics tracking failed:', error.response?.data || error.message);
    }
  }
};

export default api;
