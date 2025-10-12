import { apiClient } from './client';
import { FuelEntry } from '../types';

export const fuelEntriesApi = {
  getAll: async (vehicleId?: number): Promise<FuelEntry[]> => {
    const params = vehicleId ? { vehicleId } : {};
    const response = await apiClient.get('/fuel-entries', { params });
    return response.data;
  },

  getById: async (id: number): Promise<FuelEntry> => {
    const response = await apiClient.get(`/fuel-entries/${id}`);
    return response.data;
  },

  create: async (data: {
    vehicleId: number;
    entryDate: string;
    odometer: number;
    stationName?: string;
    fuelBrand?: string;
    fuelGrade?: string;
    quantityLiters: number;
    totalAmount: number;
    currency: string;
    notes?: string;
  }): Promise<FuelEntry> => {
    const response = await apiClient.post('/fuel-entries', data);
    return response.data;
  },

  update: async (id: number, data: {
    entryDate?: string;
    odometer?: number;
    stationName?: string;
    fuelBrand?: string;
    fuelGrade?: string;
    quantityLiters?: number;
    totalAmount?: number;
    currency?: string;
    notes?: string;
  }): Promise<FuelEntry> => {
    const response = await apiClient.patch(`/fuel-entries/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/fuel-entries/${id}`);
    return response.data;
  },
};
