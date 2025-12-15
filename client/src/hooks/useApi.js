import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { handleError } from '../utils/helpers'

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(url, options)
      setData(response.data)
    } catch (err) {
      setError(handleError(err, 'Failed to fetch data'))
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export const useApiMutation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = useCallback(async (method, url, data = null, options = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const config = { ...options }
      let response
      
      if (method === 'get') response = await axios.get(url, config)
      else if (method === 'post') response = await axios.post(url, data, config)
      else if (method === 'put') response = await axios.put(url, data, config)
      else if (method === 'delete') response = await axios.delete(url, config)
      else throw new Error('Invalid method')
      
      return response.data
    } catch (err) {
      const errorMsg = handleError(err, 'Operation failed')
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { mutate, loading, error }
}
