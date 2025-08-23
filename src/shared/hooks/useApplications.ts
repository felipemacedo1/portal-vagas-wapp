import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../core/stores/appStore'
import { jobsService } from '../../services/jobs'
import { useToast } from '../../core/providers/ToastProvider'
import { useAuthStore } from '../../core/stores/authStore'
import type { Application, PageResponse } from '../../types/entities'

export const applicationsKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationsKeys.all, 'list'] as const,
  candidate: (page?: number) => [...applicationsKeys.lists(), 'candidate', page] as const,
  employer: (page?: number) => [...applicationsKeys.lists(), 'employer', page] as const,
  job: (jobId: number) => [...applicationsKeys.all, 'job', jobId] as const,
}

export const useCandidateApplications = (page = 0, size = 10) => {
  const { applications, setApplications, setApplicationsLoading } = useAppStore()
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: applicationsKeys.candidate(page),
    queryFn: async () => {
      setApplicationsLoading(true)
      try {
        const response = await jobsService.getCandidateApplications(page, size)
        if (page === 0) {
          setApplications(response.content)
        }
        return response
      } finally {
        setApplicationsLoading(false)
      }
    },
    enabled: user?.role === 'CANDIDATE',
    staleTime: 2 * 60 * 1000,
  })
}

export const useEmployerApplications = (page = 0, size = 10) => {
  const { applications, setApplications, setApplicationsLoading } = useAppStore()
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: applicationsKeys.employer(page),
    queryFn: async () => {
      setApplicationsLoading(true)
      try {
        const response = await jobsService.getEmployerApplications(page, size)
        if (page === 0) {
          setApplications(response.content)
        }
        return response
      } finally {
        setApplicationsLoading(false)
      }
    },
    enabled: user?.role === 'EMPLOYER',
    staleTime: 2 * 60 * 1000,
  })
}

export const useJobApplications = (jobId: number) => {
  return useQuery({
    queryKey: applicationsKeys.job(jobId),
    queryFn: () => jobsService.getJobApplications(jobId),
    enabled: !!jobId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient()
  const { updateApplication } = useAppStore()
  const { showSuccess, showError } = useToast()
  
  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: number; status: string }) =>
      jobsService.updateApplicationStatus(applicationId, status),
    onSuccess: (updatedApplication) => {
      // Update all related caches
      queryClient.invalidateQueries({ queryKey: applicationsKeys.lists() })
      queryClient.invalidateQueries({ 
        queryKey: applicationsKeys.job(updatedApplication.jobId) 
      })
      
      // Update store
      updateApplication(updatedApplication.id, updatedApplication)
      
      showSuccess('Status da candidatura atualizado!')
    },
    onError: (error: any) => {
      showError('Erro ao atualizar status', error.response?.data?.message)
    }
  })
}

// Custom hook for application statistics
export const useApplicationStats = () => {
  const { applications } = useAppStore()
  
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'PENDING').length,
    approved: applications.filter(app => app.status === 'APPROVED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
    interview: applications.filter(app => app.status === 'INTERVIEW').length,
  }
  
  return stats
}

// Real-time notifications hook
export const useApplicationNotifications = () => {
  const { user } = useAuthStore()
  const { addNotification } = useAppStore()
  const queryClient = useQueryClient()
  
  // This would integrate with WebSocket or Server-Sent Events
  // For now, we'll simulate with polling
  useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      // Mock notification check
      return []
    },
    enabled: !!user,
    refetchInterval: 30 * 1000, // Check every 30 seconds
    onSuccess: (notifications) => {
      notifications.forEach((notification: any) => {
        addNotification({
          type: 'info',
          message: notification.message
        })
        
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: applicationsKeys.all })
      })
    }
  })
}