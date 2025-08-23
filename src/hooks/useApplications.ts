import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsService } from '../services/jobs'
import { useToast } from '../core/providers/ToastProvider'
import { useAuthStore } from '../core/stores/authStore'

export const useCandidateApplications = (page = 0, size = 10) => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['applications', 'candidate', page, size],
    queryFn: () => jobsService.getCandidateApplications(page, size),
    enabled: user?.role === 'CANDIDATE',
    staleTime: 2 * 60 * 1000,
  })
}

export const useEmployerApplications = (page = 0, size = 10) => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['applications', 'employer', page, size],
    queryFn: () => jobsService.getEmployerApplications(page, size),
    enabled: user?.role === 'EMPLOYER',
    staleTime: 2 * 60 * 1000,
  })
}

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()
  
  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: number; status: string }) =>
      jobsService.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      showSuccess('Status da candidatura atualizado!')
    },
    onError: () => {
      showError('Erro ao atualizar status')
    }
  })
}

export const useApplyToJob = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()
  
  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: number; data?: any }) => 
      jobsService.applyToJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      showSuccess('Candidatura enviada com sucesso!')
    },
    onError: () => {
      showError('Erro ao enviar candidatura')
    }
  })
}