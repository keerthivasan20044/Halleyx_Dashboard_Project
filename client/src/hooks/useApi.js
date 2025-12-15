import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { handleError } from '../utils/helpers'

// Create axios instance with security headers
const createSecureAxios = () => {
  const instance = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
  })

  // Add CSRF token to requests
  instance.interceptors.request.use((config) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken
    }
    return config
  })

  return instance
}

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!url || typeof url !== 'string') {
      setError('Invalid URL provided')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const secureAxios = createSecureAxios()
      const response = await secureAxios.get(url, {
        ...options,
        validateStatus: (status) => status < 500 // Don't reject on 4xx errors
      })
      
      if (response.status >= 400) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      setData(response.data)
    } catch (err) {
      const errorMessage = handleError(err, 'Failed to fetch data')
      setError(errorMessage)
      console.error('API fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    if (url) {
      fetchData()
    }
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export const useApiMutation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = useCallback(async (method, url, data = null, options = {}) => {
    // Validate inputs
    if (!method || typeof method !== 'string') {
      throw new Error('Invalid HTTP method')
    }
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL')
    }

    const validMethods = ['get', 'post', 'put', 'delete', 'patch']
    if (!validMethods.includes(method.toLowerCase())) {
      throw new Error(`Unsupported HTTP method: ${method}`)
    }

    try {
      setLoading(true)
      setError(null)
      
      const secureAxios = createSecureAxios()
      const config = {
        ...options,
        validateStatus: (status) => status < 500
      }
      
      let response
      const normalizedMethod = method.toLowerCase()
      
      if (normalizedMethod === 'get') {
        response = await secureAxios.get(url, config)
      } else if (normalizedMethod === 'post') {
        response = await secureAxios.post(url, data, config)
      } else if (normalizedMethod === 'put') {
        response = await secureAxios.put(url, data, config)
      } else if (normalizedMethod === 'patch') {
        response = await secureAxios.patch(url, data, config)
      } else if (normalizedMethod === 'delete') {
        response = await secureAxios.delete(url, config)
      }
      
      if (response.status >= 400) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return response.data
    } catch (err) {
      const errorMsg = handleError(err, 'Operation failed')
      setError(errorMsg)
      console.error('API mutation error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { mutate, loading, error }
}
