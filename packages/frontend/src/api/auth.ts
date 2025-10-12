import { apiClient } from './client';
import { User } from '../types';

export const authApi = {
  register: async (data: { email: string; password: string; displayName?: string }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: {
    displayName?: string;
    preferredCurrency?: string;
    preferredDistanceUnit?: 'km' | 'mi';
    preferredVolumeUnit?: 'L' | 'gal';
    timezone?: string;
  }) => {
    const response = await apiClient.patch('/auth/profile', data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.delete('/auth/account');
    return response.data;
  },
};
