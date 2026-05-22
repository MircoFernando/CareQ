import axios from 'axios';
import { auth } from '../lib/firebase';

export const apiClient = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
  timeout: 10000,
});

// Request interceptor — attach Firebase JWT bearer token
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.warn('[apiClient] Failed to attach firebase JWT token', e);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return structured API error if available from backend, otherwise standard Axios error
    const normalizedError = error.response?.data?.error ?? {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred.'
    };
    return Promise.reject(normalizedError);
  }
);
