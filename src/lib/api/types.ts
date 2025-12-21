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

// Alloy Master Data Types
export interface AlloyDesign {
  id: number;
  name: string;
  previewImageUrl?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlloyPCD {
  id: number;
  name: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlloyFinish {
  id: number;
  name: string;
  description?: string;
  colorCode?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlloySize {
  id: number;
  diameter: number;
  width: number;
  offset: string;
  specs: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Alloy Types
export interface Alloy {
  id: number;
  designId: number;
  pcdId: number;
  finishId: number;
  sizeId: number;
  alloyName: string;
  images: string[];
  isActive: boolean;
  design?: AlloyDesign;
  pcd?: AlloyPCD;
  finish?: AlloyFinish;
  size?: AlloySize;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlloysListResponse {
  alloys: Alloy[];
  pagination: Pagination;
}

// Query Parameters
export interface MakesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface ModelsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  makeId?: number;
  isActive?: boolean;
}

export interface ColorsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CarsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  makeId?: number;
  modelId?: number;
  colorId?: number;
  isActive?: boolean;
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
