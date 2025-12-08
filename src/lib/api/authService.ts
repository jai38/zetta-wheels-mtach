import { apiClient, API_ENDPOINTS } from './config';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User,
  ApiResponse 
} from './types';

/**
 * Login user
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );
  
  if (response.data.data) {
    // Store token and user in localStorage
    localStorage.setItem('auth_token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    return response.data.data;
  }
  
  throw new Error(response.data.message || 'Login failed');
};

/**
 * Register new user
 */
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    API_ENDPOINTS.AUTH.REGISTER,
    userData
  );
  
  if (response.data.data) {
    // Store token and user in localStorage
    localStorage.setItem('auth_token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    return response.data.data;
  }
  
  throw new Error(response.data.message || 'Registration failed');
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } finally {
    // Clear local storage regardless of API response
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(
    API_ENDPOINTS.AUTH.PROFILE
  );
  
  if (response.data.data) {
    return response.data.data;
  }
  
  throw new Error(response.data.message || 'Failed to fetch profile');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  return !!token;
};

/**
 * Get stored user data
 */
export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};
