import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsService } from '../services/jobs'
import { useToast } from '../core/providers/ToastProvider'
import { useAuthStore } from '../core/stores/authStore'
import type { JobFilters } from '../types/jobs'

export const useJobs = (filters: JobFilters = {}) => {
  return useQuery({
    queryKey: ['jobs', 'public', filters],
    queryFn: () => jobsService.getPublicJobs(filters),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsService.getPublicJob(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export const useEmployerJobs = (page = 0, size = 10) => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['jobs', 'employer', page, size],
    queryFn: () => jobsService.getEmployerJobs(page, size),
    enabled: user?.role === 'EMPLOYER',
    staleTime: 2 * 60 * 1000,
  })
}

export const usePendingJobs = (page = 0, size = 10) => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['jobs', 'pending', page, size],
    queryFn: () => jobsService.getPendingJobs(page, size),
    enabled: user?.role === 'ADMIN',
    staleTime: 1 * 60 * 1000,
  })
}

export const useApproveJob = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()
  
  return useMutation({
    mutationFn: jobsService.approveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', 'pending'] })
      showSuccess('Vaga aprovada com sucesso!')
    },
    onError: () => {
      showError('Erro ao aprovar vaga')
    }
  })
}

export const useRejectJob = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => 
      jobsService.rejectJob(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', 'pending'] })
      showSuccess('Vaga rejeitada.')
    },
    onError: () => {
      showError('Erro ao rejeitar vaga')
    }
  })
}