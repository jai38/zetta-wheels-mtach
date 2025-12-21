import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login if needed
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // You can dispatch a logout action or redirect here
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
  },
  // Car Master Data
  CAR: {
    MAKES: '/api/v1/admin/car/makes',
    MODELS: '/api/v1/admin/car/models',
    COLORS: '/api/v1/admin/car/colors',
  },
  // Cars
  CARS: '/api/v1/admin/cars',
  // Alloy Master Data
  ALLOY: {
    DESIGNS: '/api/v1/admin/alloy/designs',
    PCDS: '/api/v1/admin/alloy/pcds',
    FINISHES: '/api/v1/admin/alloy/finishes',
    SIZES: '/api/v1/admin/alloy/sizes',
  },
  // Alloys
  ALLOYS: '/api/v1/admin/alloys',
  // Car specific endpoints
  CAR_SPECIFIC: {
    COLORS: (carId: number) => `/api/admin/cars/${carId}/colors`,
    ALLOY_DESIGNS: (carId: number) => `/api/admin/cars/${carId}/alloy-designs`,
    ALLOY_FINISHES: (carId: number) => `/api/admin/cars/${carId}/alloy-finishes`,
  }
};
