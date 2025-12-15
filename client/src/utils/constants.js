// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
export const API_ENDPOINTS = {
  ORDERS: `${API_BASE_URL}/api/orders`,
  DASHBOARD_CONFIG: `${API_BASE_URL}/api/dashboard/config`,
  HEALTH: `${API_BASE_URL}/api/health`,
  SEED: `${API_BASE_URL}/api/seed`,
}

// Widget Types
export const WIDGET_TYPES = {
  KPI: 'KPI',
  BAR_CHART: 'BarChart',
  LINE_CHART: 'LineChart',
  AREA_CHART: 'AreaChart',
  SCATTER_CHART: 'ScatterChart',
  PIE_CHART: 'PieChart',
  TABLE: 'Table',
}

// Aggregation Types
export const AGGREGATION_TYPES = {
  SUM: 'Sum',
  AVERAGE: 'Average',
  COUNT: 'Count',
}

// Data Formats
export const DATA_FORMATS = {
  NUMBER: 'Number',
  CURRENCY: 'Currency',
  PERCENTAGE: 'Percentage',
}

// Order Status
export const ORDER_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

// Countries
export const COUNTRIES = [
  'US',
  'Canada',
  'Australia',
  'Singapore',
  'Hong Kong',
]

// Colors
export const COLORS = {
  PRIMARY: '#10b981',
  SECONDARY: '#6366f1',
  ACCENT: '#f59e0b',
  DARK: '#1f2937',
  LIGHT: '#f9fafb',
  BORDER: '#e5e7eb',
  RED: '#ef4444',
  GREEN: '#22c55e',
  BLUE: '#3b82f6',
  YELLOW: '#eab308',
}

// Grid Sizes
export const GRID_SIZES = {
  DESKTOP_COLS: 12,
  TABLET_COLS: 8,
  MOBILE_COLS: 4,
  ROW_HEIGHT: 60,
}

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 767,
  TABLET: 1023,
  DESKTOP: 1024,
}

// Timeout Values
export const TIMEOUTS = {
  TOAST: 3000,
  DEBOUNCE: 300,
  THROTTLE: 500,
}

// Local Storage Keys
export const STORAGE_KEYS = {
  DASHBOARD_CONFIG: 'dashboardConfig',
  USER_PREFERENCES: 'userPreferences',
  SIDEBAR_STATE: 'sidebarOpen',
}

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_INPUT: 'Invalid input provided',
  MISSING_FIELD: 'Please fill the field',
  NETWORK_ERROR: 'Network error. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created',
  UPDATED: 'Successfully updated',
  DELETED: 'Successfully deleted',
  SAVED: 'Successfully saved',
  LOADED: 'Successfully loaded',
}

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\s\-\+\(\)]{10,}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  CURRENCY: /^\d+(\.\d{2})?$/,
}

// Default Values
export const DEFAULT_VALUES = {
  QUANTITY: 1,
  UNIT_PRICE: 0,
  DECIMAL_PLACES: 2,
  PAGE_SIZE: 10,
  WIDGET_WIDTH: 3,
  WIDGET_HEIGHT: 3,
}

// Mock Products
export const MOCK_PRODUCTS = [
  'Fiber Internet 300 Mbps',
  '5G Unlimited Mobile Plan',
  'Fiber Internet 1 Gbps',
  'Business Internet Pro',
  'Premium WiFi Mesh System',
  'Cloud Storage Plus',
  'VPN Professional',
  'Email Protection Suite',
]

// Mock Creators
export const MOCK_CREATORS = [
  'Mr. Michael Harris',
  'Mr. Ryan Cooper',
  'Ms. Olivia Carter',
  'Mr. Lucas Martin',
  'Ms. Emma Thompson',
  'Mr. James Wilson',
  'Ms. Sarah Anderson',
  'Mr. David Brown',
]
