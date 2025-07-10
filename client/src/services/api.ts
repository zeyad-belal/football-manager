import axios from 'axios';
import { ApiResponse, AuthData, TransferMarketResponse, TransferFilters, LoginFormData } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async loginOrRegister(data: LoginFormData): Promise<ApiResponse<AuthData>> {
    const response = await api.post('/auth/login-register', data);
    return response.data;
  },

  async getProfile(): Promise<ApiResponse<AuthData>> {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export const transferService = {
  async getTransferMarket(
    filters: TransferFilters = {},
    page = 1,
    limit = 20
  ): Promise<ApiResponse<TransferMarketResponse>> {
    const params = new URLSearchParams();
    
    if (filters.teamName) params.append('teamName', filters.teamName);
    if (filters.playerName) params.append('playerName', filters.playerName);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.position) params.append('position', filters.position);
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/transfers/market?${params.toString()}`);
    return response.data;
  },

  async addPlayerToTransferList(playerId: string, askingPrice: number): Promise<ApiResponse> {
    const response = await api.post('/transfers/list', { playerId, askingPrice });
    return response.data;
  },

  async removePlayerFromTransferList(playerId: string): Promise<ApiResponse> {
    const response = await api.delete(`/transfers/list/${playerId}`);
    return response.data;
  },

  async buyPlayer(playerId: string): Promise<ApiResponse> {
    const response = await api.post(`/transfers/buy/${playerId}`);
    return response.data;
  },
};

export default api;
