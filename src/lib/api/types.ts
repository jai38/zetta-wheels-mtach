// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Pagination
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Car Master Data Types
export interface Make {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CarModel {
  id: number;
  name: string;
  slug: string;
  makeId: number;
  isActive: boolean;
  make?: Make;
  createdAt?: string;
  updatedAt?: string;
}

export interface Color {
  id: number;
  name: string;
  colorCode: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Car Types
export interface CarImage {
  id: number;
  image_url: string;
}

export interface Car {
  id: number;
  modelId: number;
  colorId: number;
  carImage: string;
  images?: CarImage[];
  x_front?: number;
  y_front?: number;
  x_rear?: number;
  y_rear?: number;
  wheelSize?: number;
  isActive: boolean;
  isDefault?: boolean;
  model?: CarModel;
  color?: Color;
  createdAt?: string;
  updatedAt?: string;
}

export interface CarsListResponse {
  cars: Car[];
  pagination: Pagination;
}

export interface CarColorOption {
  color: Color;
  carIds: number[];
}

// ... (omitted code)

export interface CarsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  makeId?: number;
  modelId?: number;
  colorId?: number;
  isActive?: boolean;
  isDefault?: boolean;
}

export interface AlloysQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  designId?: number;
  pcdId?: number;
  finishId?: number;
  sizeId?: number;
  diameter?: number;
  carId?: number;
  isActive?: boolean;
}
