import { apiClient, API_ENDPOINTS } from './config';
import type {
  Make,
  CarModel,
  Color,
  Variant,
  Car,
  CarsListResponse,
  MakesQueryParams,
  ModelsQueryParams,
  ColorsQueryParams,
  VariantsQueryParams,
  CarsQueryParams,
  ApiResponse,
  Pagination,
  CarColorOption,
} from './types';

/**
 * Get list of makes
 */
export const getMakes = async (params?: MakesQueryParams): Promise<{ items: Make[]; pagination: Pagination }> => {
  const response = await apiClient.get<ApiResponse<{ items: Make[]; pagination: Pagination }>>(
    API_ENDPOINTS.CAR.MAKES,
    { params }
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch makes');
};

/**
 * Get list of models
 */
export const getModels = async (params?: ModelsQueryParams): Promise<{ items: CarModel[]; pagination: Pagination }> => {
  const response = await apiClient.get<ApiResponse<{ items: CarModel[]; pagination: Pagination }>>(
    API_ENDPOINTS.CAR.MODELS,
    { params }
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch models');
};

/**
 * Get list of colors
 */
export const getColors = async (params?: ColorsQueryParams): Promise<{ items: Color[]; pagination: Pagination }> => {
  const response = await apiClient.get<ApiResponse<{ items: Color[]; pagination: Pagination }>>(
    API_ENDPOINTS.CAR.COLORS,
    { params }
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch colors');
};

/**
 * Get list of variants
 */
export const getVariants = async (params?: VariantsQueryParams): Promise<{ items: Variant[]; pagination: Pagination }> => {
  const response = await apiClient.get<ApiResponse<{ items: Variant[]; pagination: Pagination }>>(
    API_ENDPOINTS.CAR.VARIANTS,
    { params }
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch variants');
};

/**
 * Get list of cars
 */
export const getCars = async (params?: CarsQueryParams): Promise<CarsListResponse> => {
  const response = await apiClient.get<ApiResponse<CarsListResponse>>(
    API_ENDPOINTS.CARS,
    { params }
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch cars');
};

/**
 * Get single car by ID
 */
export const getCarById = async (id: number): Promise<Car> => {
  const response = await apiClient.get<ApiResponse<Car>>(
    `${API_ENDPOINTS.CARS}/${id}`
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch car');
};

/**
 * Create new car
 */
export const createCar = async (carData: Partial<Car>): Promise<Car> => {
  const response = await apiClient.post<ApiResponse<Car>>(
    API_ENDPOINTS.CARS,
    carData
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to create car');
};

/**
 * Update car
 */
export const updateCar = async (id: number, carData: Partial<Car>): Promise<Car> => {
  const response = await apiClient.put<ApiResponse<Car>>(
    `${API_ENDPOINTS.CARS}/${id}`,
    carData
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to update car');
};

/**
 * Delete car (soft delete)
 */
export const deleteCar = async (id: number): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `${API_ENDPOINTS.CARS}/${id}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete car');
  }
};

/**
 * Get list of colors for a specific car
 */
export const getColorsForCar = async (carId: number): Promise<CarColorOption[]> => {
  const response = await apiClient.get<ApiResponse<CarColorOption[]>>(
    API_ENDPOINTS.CAR_SPECIFIC.COLORS(carId)
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch colors for car');
}

