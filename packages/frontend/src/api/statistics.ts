import { apiClient } from './client';
import { VehicleStatistics, BrandGradeStats, StatisticsQuery } from '../types';

export const statisticsApi = {
  getVehicleStatistics: async (vehicleId: number, query?: StatisticsQuery): Promise<VehicleStatistics> => {
    const response = await apiClient.get(`/statistics/vehicles/${vehicleId}`, { params: query });
    return response.data;
  },

  getUserOverview: async (query?: StatisticsQuery) => {
    const response = await apiClient.get('/statistics/overview', { params: query });
    return response.data;
  },

  getBrandGradeStatistics: async (vehicleId: number, query?: StatisticsQuery): Promise<BrandGradeStats[]> => {
    const response = await apiClient.get(`/statistics/vehicles/${vehicleId}/brand-grade`, { params: query });
    return response.data;
  },
};
