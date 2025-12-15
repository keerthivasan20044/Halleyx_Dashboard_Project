import { REGEX_PATTERNS, BREAKPOINTS } from './constants'

// Validation Helpers
export const validateEmail = (email) => {
  try {
    return email && typeof email === 'string' && REGEX_PATTERNS.EMAIL.test(email)
  } catch (error) {
    console.error('Email validation error:', error)
    return false
  }
}

export const validatePhone = (phone) => {
  try {
    return phone && typeof phone === 'string' && REGEX_PATTERNS.PHONE.test(phone)
  } catch (error) {
    console.error('Phone validation error:', error)
    return false
  }
}

export const validateZipCode = (zip) => {
  try {
    return zip && REGEX_PATTERNS.ZIP_CODE.test(String(zip))
  } catch (error) {
    console.error('Zip code validation error:', error)
    return false
  }
}

export const validateCurrency = (value) => {
  try {
    return value !== null && value !== undefined && REGEX_PATTERNS.CURRENCY.test(String(value))
  } catch (error) {
    console.error('Currency validation error:', error)
    return false
  }
}

// String Helpers
export const capitalize = (str) => {
  try {
    if (!str || typeof str !== 'string') return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  } catch (error) {
    console.error('Capitalize error:', error)
    return str || ''
  }
}

export const truncate = (str, length = 50) => {
  try {
    if (!str || typeof str !== 'string') return ''
    return str.length > length ? str.substring(0, length) + '...' : str
  } catch (error) {
    console.error('Truncate error:', error)
    return str || ''
  }
}

export const formatName = (firstName, lastName) => {
  try {
    const first = firstName && typeof firstName === 'string' ? firstName : ''
    const last = lastName && typeof lastName === 'string' ? lastName : ''
    return `${first} ${last}`.trim()
  } catch (error) {
    console.error('Format name error:', error)
    return ''
  }
}

// Number Helpers
export const formatCurrency = (value, decimals = 2) => {
  try {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return '$0.00'
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(numValue)
  } catch (error) {
    console.error('Format currency error:', error)
    return '$0.00'
  }
}

export const formatNumber = (value, decimals = 2) => {
  try {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return '0'
    return numValue.toFixed(decimals)
  } catch (error) {
    console.error('Format number error:', error)
    return '0'
  }
}

export const formatPercentage = (value) => {
  try {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return '0.0%'
    return `${(numValue * 100).toFixed(1)}%`
  } catch (error) {
    console.error('Format percentage error:', error)
    return '0.0%'
  }
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
  try {
    if (!obj || typeof obj !== 'object') return {}
    if (!Array.isArray(keys)) return { ...obj }
    
    const result = { ...obj }
    keys.forEach(key => {
      if (typeof key === 'string' && key in result) {
        delete result[key]
      }
    })
    return result
  } catch (error) {
    console.error('Omit error:', error)
    return obj || {}
  }
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
    if (!key || typeof key !== 'string') {
      console.error('Invalid storage key:', key)
      return defaultValue
    }
    
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage not available')
      return defaultValue
    }
    
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Storage read error:', error)
    return defaultValue
  }
}

export const setToStorage = (key, value) => {
  try {
    if (!key || typeof key !== 'string') {
      console.error('Invalid storage key:', key)
      return false
    }
    
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage not available')
      return false
    }
    
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Storage write error:', error)
    return false
  }
}

export const removeFromStorage = (key) => {
  try {
    if (!key || typeof key !== 'string') {
      console.error('Invalid storage key:', key)
      return false
    }
    
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage not available')
      return false
    }
    
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
  try {
    const qty = parseFloat(quantity) || 0
    const price = parseFloat(unitPrice) || 0
    return parseFloat((qty * price).toFixed(2))
  } catch (error) {
    console.error('Calculate total error:', error)
    return 0
  }
}

export const calculateAverage = (arr) => {
  try {
    if (!Array.isArray(arr) || arr.length === 0) return 0
    const validNumbers = arr.filter(val => typeof val === 'number' && !isNaN(val))
    if (validNumbers.length === 0) return 0
    return validNumbers.reduce((sum, val) => sum + val, 0) / validNumbers.length
  } catch (error) {
    console.error('Calculate average error:', error)
    return 0
  }
}

export const calculateSum = (arr) => {
  try {
    if (!Array.isArray(arr)) return 0
    return arr.reduce((sum, val) => {
      const num = parseFloat(val)
      return sum + (isNaN(num) ? 0 : num)
    }, 0)
  } catch (error) {
    console.error('Calculate sum error:', error)
    return 0
  }
}

export const calculatePercentageChange = (oldValue, newValue) => {
  try {
    const oldVal = parseFloat(oldValue) || 0
    const newVal = parseFloat(newValue) || 0
    if (oldVal === 0) return newVal === 0 ? 0 : 100
    return ((newVal - oldVal) / oldVal) * 100
  } catch (error) {
    console.error('Calculate percentage change error:', error)
    return 0
  }
}

// Error Handling
export const handleError = (error, defaultMessage = 'An error occurred') => {
  try {
    if (!error) return defaultMessage
    
    // Sanitize error messages to prevent XSS
    const sanitizeMessage = (msg) => {
      if (typeof msg !== 'string') return defaultMessage
      return msg.replace(/<[^>]*>/g, '').substring(0, 200)
    }
    
    if (error.response?.data?.message) {
      return sanitizeMessage(error.response.data.message)
    }
    if (error.message) {
      return sanitizeMessage(error.message)
    }
    if (typeof error === 'string') {
      return sanitizeMessage(error)
    }
    
    return defaultMessage
  } catch (err) {
    console.error('Error handling failed:', err)
    return defaultMessage
  }
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
  try {
    // Validate URL to prevent SSRF
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided')
    }
    
    // Basic URL validation
    try {
      new URL(url, window.location.origin)
    } catch {
      throw new Error('Malformed URL')
    }
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    return fetch(url, { 
      ...options, 
      signal: controller.signal,
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      }
    })
      .finally(() => clearTimeout(timeoutId))
  } catch (error) {
    console.error('Fetch with timeout error:', error)
    return Promise.reject(error)
  }
}
