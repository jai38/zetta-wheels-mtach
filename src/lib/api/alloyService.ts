import { apiClient, API_ENDPOINTS } from './config';
import type {
  Alloy,
  AlloyDesign,
  AlloyPCD,
  AlloyFinish,
  AlloySize,
  AlloysListResponse,
  AlloysQueryParams,
  ApiResponse,
  Pagination,
} from './types';

/**
 * Get list of alloy designs
 */
export const getAlloyDesigns = async (params?: { page?: number; limit?: number; search?: string; isActive?: boolean }): Promise<{ items: AlloyDesign[]; pagination: Pagination }> => {
  const response = await apiClient.get<ApiResponse<{ items: AlloyDesign[]; pagination: Pagination }>>(
    API_ENDPOINTS.ALLOY.DESIGNS,
    { params }
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch alloy designs');
};

/**
 * Get list of alloy PCDs
 */
export const getAlloyPCDs = async (params?: { page?: number; limit?: number; search?: string; isActive?: boolean }): Promise<{ items: AlloyPCD[]; pagination: Pagination }> => {
  const response = await apiClient.get<ApiResponse<{ items: AlloyPCD[]; pagination: Pagination }>>(
    API_ENDPOINTS.ALLOY.PCDS,
    { params }
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch alloy PCDs');
};

/**
 * Get list of alloy finishes
 */
export const getAlloyFinishes = async (params?: { page?: number; limit?: number; search?: string; isActive?: boolean }): Promise<{ items: AlloyFinish[]; pagination: Pagination }> => {
  const response = await apiClient.get<ApiResponse<{ items: AlloyFinish[]; pagination: Pagination }>>(
    API_ENDPOINTS.ALLOY.FINISHES,
    { params }
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch alloy finishes');
};

/**
 * Get list of alloy sizes
 */
export const getAlloySizes = async (params?: { page?: number; limit?: number; search?: string; isActive?: boolean }): Promise<{ items: AlloySize[]; pagination: Pagination }> => {
  const response = await apiClient.get<ApiResponse<{ items: AlloySize[]; pagination: Pagination }>>(
    API_ENDPOINTS.ALLOY.SIZES,
    { params }
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch alloy sizes');
};

/**
 * Get list of alloys
 */
export const getAlloys = async (params?: AlloysQueryParams): Promise<AlloysListResponse> => {
  const response = await apiClient.get<ApiResponse<AlloysListResponse>>(
    API_ENDPOINTS.ALLOYS,
    { params }
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch alloys');
};

/**
 * Get single alloy by ID
 */
export const getAlloyById = async (id: number): Promise<Alloy> => {
  const response = await apiClient.get<ApiResponse<Alloy>>(
    `${API_ENDPOINTS.ALLOYS}/${id}`
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch alloy');
};

/**
 * Create new alloy
 */
export const createAlloy = async (alloyData: Partial<Alloy>): Promise<Alloy> => {
  const response = await apiClient.post<ApiResponse<Alloy>>(
    API_ENDPOINTS.ALLOYS,
    alloyData
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to create alloy');
};

/**
 * Update alloy
 */
export const updateAlloy = async (id: number, alloyData: Partial<Alloy>): Promise<Alloy> => {
  const response = await apiClient.put<ApiResponse<Alloy>>(
    `${API_ENDPOINTS.ALLOYS}/${id}`,
    alloyData
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to update alloy');
};

/**
 * Get list of alloy designs for a specific car
 */
export const getAlloyDesignsForCar = async (carId: number): Promise<AlloyDesign[]> => {
  const response = await apiClient.get<ApiResponse<AlloyDesign[]>>(
    API_ENDPOINTS.CAR_SPECIFIC.ALLOY_DESIGNS(carId)
  );

  if (response.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch alloy designs for car');
}

/**
 * Get list of alloy finishes for a specific car
 */
export const getAlloyFinishesForCar = async (carId: number): Promise<AlloyFinish[]> => {
  const response = await apiClient.get<ApiResponse<AlloyFinish[]>>(
    API_ENDPOINTS.CAR_SPECIFIC.ALLOY_FINISHES(carId)
  );

  if (response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch alloy finishes for car');
}

