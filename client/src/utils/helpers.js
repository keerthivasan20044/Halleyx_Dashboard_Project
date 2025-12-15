import { REGEX_PATTERNS, BREAKPOINTS } from './constants'

// Validation Helpers
export const validateEmail = (email) => REGEX_PATTERNS.EMAIL.test(email)
export const validatePhone = (phone) => REGEX_PATTERNS.PHONE.test(phone)
export const validateZipCode = (zip) => REGEX_PATTERNS.ZIP_CODE.test(zip)
export const validateCurrency = (value) => REGEX_PATTERNS.CURRENCY.test(String(value))

// String Helpers
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
export const truncate = (str, length = 50) => str.length > length ? str.substring(0, length) + '...' : str
export const formatName = (firstName, lastName) => `${firstName} ${lastName}`.trim()

// Number Helpers
export const formatCurrency = (value, decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export const formatNumber = (value, decimals = 2) => {
  return parseFloat(value).toFixed(decimals)
}

export const formatPercentage = (value) => {
  return `${(value * 100).toFixed(1)}%`
}

// Date Helpers
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  
  return formatDate(date)
}

// Array Helpers
export const sortArray = (arr, key, direction = 'asc') => {
  return [...arr].sort((a, b) => {
    if (direction === 'desc') return String(b[key]).localeCompare(String(a[key]))
    return String(a[key]).localeCompare(String(b[key]))
  })
}

export const filterArray = (arr, key, value) => {
  return arr.filter(item => String(item[key]).toLowerCase().includes(String(value).toLowerCase()))
}

export const groupArray = (arr, key) => {
  return arr.reduce((groups, item) => {
    const group = String(item[key])
    if (!groups[group]) groups[group] = []
    groups[group].push(item)
    return groups
  }, {})
}

export const paginateArray = (arr, page = 1, pageSize = 10) => {
  const start = (page - 1) * pageSize
  return arr.slice(start, start + pageSize)
}

// Object Helpers
export const omit = (obj, keys) => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key]
    return result
  }, {})
}

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

// Local Storage Helpers
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Storage read error:', error)
    return defaultValue
  }
}

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Storage write error:', error)
    return false
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Storage remove error:', error)
    return false
  }
}

// Responsive Helpers
export const getGridCols = () => {
  const width = window.innerWidth
  if (width < BREAKPOINTS.MOBILE) return 4
  if (width < BREAKPOINTS.DESKTOP) return 8
  return 12
}

export const isMobileSize = () => window.innerWidth <= BREAKPOINTS.MOBILE
export const isTabletSize = () => window.innerWidth >= BREAKPOINTS.MOBILE && window.innerWidth < BREAKPOINTS.DESKTOP
export const isDesktopSize = () => window.innerWidth >= BREAKPOINTS.DESKTOP

// Debounce & Throttle
export const debounce = (func, delay = 300) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const throttle = (func, delay = 500) => {
  let lastCall = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// Calculation Helpers
export const calculateTotal = (quantity, unitPrice) => {
  return parseFloat((quantity * unitPrice).toFixed(2))
}

export const calculateAverage = (arr) => {
  if (arr.length === 0) return 0
  return arr.reduce((sum, val) => sum + val, 0) / arr.length
}

export const calculateSum = (arr) => {
  return arr.reduce((sum, val) => sum + val, 0)
}

export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return 0
  return ((newValue - oldValue) / oldValue) * 100
}

// Error Handling
export const handleError = (error, defaultMessage = 'An error occurred') => {
  if (error.response?.data?.message) return error.response.data.message
  if (error.message) return error.message
  return defaultMessage
}

// UUID Helper
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Retry Helper
export const retry = async (func, attempts = 3, delay = 1000) => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await func()
    } catch (error) {
      if (i === attempts - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// Fetch with Timeout
export const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId))
}
