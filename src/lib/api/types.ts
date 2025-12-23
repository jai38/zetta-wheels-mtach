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
  defaultAlloySize?: number | null; // Inches
  alloySize?: number; // Pixels
  x_front?: number;
  y_front?: number;
  x_rear?: number;
  y_rear?: number;
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
export interface Car {
  id: number;
  modelId: number;
  colorId: number;
  carImage: string;
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
  isDefault?: boolean;
}

// Alloy Master Data Types
export interface AlloyDesign {
  id: number;
  name: string;
  description?: string;
  previewImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlloyPCD {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlloyFinish {
  id: number;
  name: string;
  description?: string;
  colorCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlloySize {
  id: number;
  diameter: number;
  width: number;
  offset: number | null;
  specs: string;
  createdAt?: string;
  updatedAt?: string;
}

// Full Alloy Entity
export interface Alloy {
  id: number;
  alloyName: string;
  designId: number;
  pcdId: number;
  finishId: number;
  sizeId: number;
  buy_url?: string;
  image_url?: string;
  design?: AlloyDesign;
  pcd?: AlloyPCD;
  finish?: AlloyFinish;
  size?: AlloySize;
  carIds?: number[];
  modelIds?: number[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlloysListResponse {
  alloys: Alloy[];
  pagination: Pagination;
}

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