import axios from 'axios';
import { mockDataService } from './mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Validate API URL
if (!API_URL || typeof API_URL !== 'string') {
  throw new Error('Invalid API URL configuration');
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// Request interceptor with security headers
api.interceptors.request.use(
  (config) => {
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    // Validate URL to prevent SSRF
    if (config.url && !config.url.startsWith('/api/')) {
      console.warn('Potentially unsafe URL detected:', config.url);
    }
    
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Validate response structure
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format');
    }
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timeout - falling back to mock data');
    } else if (error.response?.status >= 500) {
      console.warn('Server error - falling back to mock data');
    } else if (error.response?.status === 403) {
      console.error('CSRF token validation failed');
    } else if (error.response?.status === 401) {
      console.error('Authentication required');
    }
    
    // Sanitize error message
    const sanitizedError = {
      ...error,
      message: error.message || 'An error occurred',
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : null
    };
    
    return Promise.reject(sanitizedError);
  }
);

const withFallback = async (apiCall, fallbackCall, operation = 'API call') => {
  try {
    const response = await apiCall();
    
    // Validate response data
    if (!response || typeof response.data === 'undefined') {
      throw new Error('Invalid API response structure');
    }
    
    return response.data;
  } catch (error) {
    console.warn(`${operation} failed, using fallback:`, error.message);
    
    try {
      return fallbackCall();
    } catch (fallbackError) {
      console.error(`Fallback also failed for ${operation}:`, fallbackError.message);
      throw new Error(`Both API and fallback failed for ${operation}`);
    }
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
      // Validate widget data
      if (!widget || typeof widget !== 'object') {
        throw new Error('Invalid widget data');
      }
      
      const response = await api.post('/api/dashboard/widget', widget);
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('Add widget failed:', error.message);
      throw new Error(`Failed to add widget: ${error.message}`);
    }
  },

  deleteWidget: async (widgetId) => {
    try {
      // Validate widget ID
      if (!widgetId || typeof widgetId !== 'string') {
        throw new Error('Invalid widget ID');
      }
      
      const response = await api.delete(`/api/dashboard/widget/${encodeURIComponent(widgetId)}`);
      return response.data;
    } catch (error) {
      console.error('Delete widget failed:', error.message);
      throw new Error(`Failed to delete widget: ${error.message}`);
    }
  },

  getAnalytics: async (dateFilter) => {
    try {
      // Validate date filter
      const validFilters = ['all', 'today', 'week', 'month', 'year'];
      if (dateFilter && !validFilters.includes(dateFilter)) {
        throw new Error('Invalid date filter');
      }
      
      const response = await api.get('/api/dashboard/analytics', {
        params: { dateFilter: dateFilter || 'all' }
      });
      return response.data;
    } catch (error) {
      console.error('Get analytics failed:', error.message);
      throw new Error(`Failed to get analytics: ${error.message}`);
    }
  },
};
