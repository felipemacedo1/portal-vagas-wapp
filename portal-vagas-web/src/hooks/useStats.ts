import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import { useAuthStore } from '../core/stores/authStore'

export const useCandidateStats = () => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['stats', 'candidate'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats/candidate')
      return response.data
    },
    enabled: user?.role === 'CANDIDATE',
    staleTime: 5 * 60 * 1000,
  })
}

export const useEmployerStats = () => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['stats', 'employer'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats/employer')
      return response.data
    },
    enabled: user?.role === 'EMPLOYER',
    staleTime: 5 * 60 * 1000,
  })
}

export const useAdminStats = () => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['stats', 'admin'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats/admin')
      return response.data
    },
    enabled: user?.role === 'ADMIN',
    staleTime: 2 * 60 * 1000,
  })
}