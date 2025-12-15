import axios from 'axios';
import { mockDataService } from './mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timeout - falling back to mock data');
    } else if (error.response?.status >= 500) {
      console.warn('Server error - falling back to mock data');
    }
    return Promise.reject(error);
  }
);

const withFallback = async (apiCall, fallbackCall, operation = 'API call') => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.warn(`${operation} failed, using fallback:`, error.message);
    return fallbackCall();
  }
};

export const ordersAPI = {
  getAll: () => withFallback(
    () => api.get('/api/orders'),
    () => mockDataService.getOrders(),
    'Get orders'
  ),
  
  create: (order) => withFallback(
    () => api.post('/api/orders', order),
    () => mockDataService.createOrder(order),
    'Create order'
  ),
  
  update: (id, order) => withFallback(
    () => api.put(`/api/orders/${id}`, order),
    () => mockDataService.updateOrder(id, order),
    'Update order'
  ),
  
  delete: (id) => withFallback(
    () => api.delete(`/api/orders/${id}`),
    () => mockDataService.deleteOrder(id),
    'Delete order'
  ),
};

export const dashboardAPI = {
  getConfig: () => withFallback(
    async () => {
      const response = await api.get('/api/dashboard/config');
      return { 
        widgets: response.data.widgets || [],
        dateFilter: response.data.dateFilter || 'all'
      };
    },
    () => mockDataService.getDashboardConfig(),
    'Get dashboard config'
  ),
  
  saveConfig: (config) => withFallback(
    async () => {
      const response = await api.post('/api/dashboard/config', config);
      return { 
        widgets: response.data.widgets || [],
        dateFilter: response.data.dateFilter || 'all'
      };
    },
    () => mockDataService.saveDashboardConfig(config),
    'Save dashboard config'
  ),

  addWidget: async (widget) => {
    try {
      const response = await api.post('/api/dashboard/widget', widget);
      return response.data;
    } catch (error) {
      console.warn('API call failed:', error.message);
      throw error;
    }
  },

  deleteWidget: async (widgetId) => {
    try {
      const response = await api.delete(`/api/dashboard/widget/${widgetId}`);
      return response.data;
    } catch (error) {
      console.warn('API call failed:', error.message);
      throw error;
    }
  },

  getAnalytics: async (dateFilter) => {
    try {
      const response = await api.get('/api/dashboard/analytics', {
        params: { dateFilter }
      });
      return response.data;
    } catch (error) {
      console.warn('API call failed:', error.message);
      throw error;
    }
  },
};
