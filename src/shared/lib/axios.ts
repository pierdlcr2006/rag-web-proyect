import axios from 'axios';
import { useAuthStore } from '@/sites/b2c-site/auth/store/authStore';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important for HttpOnly cookies
});

// Request interceptor: add Authorization header
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  console.log(`AXIOS REQUEST [${config.method?.toUpperCase()}] ${config.url}`, { hasToken: !!token });
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retrying
    if (error.response?.status === 401) {
      // DON'T intercept refresh/login/logout requests to avoid infinite loops
      const isAuthRequest = originalRequest.url?.includes('/auth/');
      
      if (!originalRequest._retry && !isAuthRequest) {
        originalRequest._retry = true;
        
        try {
          await useAuthStore.getState().refreshToken();
          const newToken = useAuthStore.getState().accessToken;
          
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      } else if (isAuthRequest) {
        // If it was an auth request and it failed with 401, just logout
        useAuthStore.getState().logout();
      } else {
        // If we already retried and still get 401, force logout
        useAuthStore.getState().logout();
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
