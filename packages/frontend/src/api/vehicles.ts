import { apiClient } from './client';
import { Vehicle } from '../types';

export const vehiclesApi = {
  getAll: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get('/vehicles');
    return response.data;
  },

  getById: async (id: number): Promise<Vehicle> => {
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    makeModel?: string;
    year?: number;
    fuelType?: string;
  }): Promise<Vehicle> => {
    const response = await apiClient.post('/vehicles', data);
    return response.data;
  },

  update: async (id: number, data: {
    name?: string;
    makeModel?: string;
    year?: number;
    fuelType?: string;
  }): Promise<Vehicle> => {
    const response = await apiClient.patch(`/vehicles/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/vehicles/${id}`);
    return response.data;
  },
};
