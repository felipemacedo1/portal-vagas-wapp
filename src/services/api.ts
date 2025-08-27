import axios from 'axios'
import { authService } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Lista de endpoints públicos que não precisam de token
const publicEndpoints = [
  '/api/public/jobs',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh'
]

// Request interceptor para adicionar token apenas quando necessário
api.interceptors.request.use((config) => {
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    config.url?.startsWith(endpoint)
  )
  
  if (!isPublicEndpoint) {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  
  return config
})

// Response interceptor para renovar token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Normalize backend error messages for UI
    try {
      const r = error?.response
      const backendMsg = r?.data?.message || r?.data?.error || r?.data?.details || r?.data?.title
      const normalized = backendMsg || error?.message || 'Erro inesperado ao comunicar com a API'
      error.userMessage = normalized
      if (r?.data && typeof r.data === 'object' && !r.data.message) {
        r.data.message = normalized
      }
    } catch {}

    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const response = await authService.refresh(refreshToken)
          authService.storeAuth(response)
          
          originalRequest.headers.Authorization = `Bearer ${response.accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          authService.logout()
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      } else {
        authService.logout()
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)
