import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../core/stores/appStore'
import { jobsService } from '../../services/jobs'
import { useToast } from '../../core/providers/ToastProvider'
import type { Job, JobFilters, PageResponse } from '../../types/entities'

// Query keys for better cache management
export const jobsKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobsKeys.all, 'list'] as const,
  list: (filters: JobFilters) => [...jobsKeys.lists(), filters] as const,
  details: () => [...jobsKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobsKeys.details(), id] as const,
  stats: () => [...jobsKeys.all, 'stats'] as const,
}

export const useJobs = (filters: JobFilters = {}) => {
  const { setJobs, setJobsLoading } = useAppStore()
  
  return useQuery({
    queryKey: jobsKeys.list(filters),
    queryFn: async () => {
      setJobsLoading(true)
      try {
        const response = await jobsService.getPublicJobs(filters)
        setJobs(response.content)
        return response
      } finally {
        setJobsLoading(false)
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useJob = (id: string) => {
  const { setCurrentJob } = useAppStore()
  
  return useQuery({
    queryKey: jobsKeys.detail(id),
    queryFn: async () => {
      const job = await jobsService.getPublicJob(id)
      setCurrentJob(job)
      return job
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useCreateJob = () => {
  const queryClient = useQueryClient()
  const { addJob } = useAppStore()
  const { showSuccess, showError } = useToast()
  
  return useMutation({
    mutationFn: jobsService.createJob,
    onSuccess: (newJob) => {
      // Update cache
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() })
      
      // Update store
      addJob(newJob)
      
      showSuccess('Vaga criada com sucesso!')
    },
    onError: (error: any) => {
      showError('Erro ao criar vaga', error.response?.data?.message)
    }
  })
}

export const useUpdateJob = () => {
  const queryClient = useQueryClient()
  const { updateJob } = useAppStore()
  const { showSuccess, showError } = useToast()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Job> }) => 
      jobsService.updateJob(id, data),
    onSuccess: (updatedJob) => {
      // Update cache
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() })
      queryClient.setQueryData(
        jobsKeys.detail(updatedJob.id.toString()), 
        updatedJob
      )
      
      // Update store
      updateJob(updatedJob.id, updatedJob)
      
      showSuccess('Vaga atualizada com sucesso!')
    },
    onError: (error: any) => {
      showError('Erro ao atualizar vaga', error.response?.data?.message)
    }
  })
}

export const useDeleteJob = () => {
  const queryClient = useQueryClient()
  const { removeJob } = useAppStore()
  const { showSuccess, showError } = useToast()
  
  return useMutation({
    mutationFn: jobsService.deleteJob,
    onSuccess: (_, deletedId) => {
      // Update cache
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() })
      queryClient.removeQueries({ queryKey: jobsKeys.detail(deletedId.toString()) })
      
      // Update store
      removeJob(deletedId)
      
      showSuccess('Vaga excluída com sucesso!')
    },
    onError: (error: any) => {
      showError('Erro ao excluir vaga', error.response?.data?.message)
    }
  })
}

export const useApplyToJob = () => {
  const queryClient = useQueryClient()
  const { addApplication } = useAppStore()
  const { showSuccess, showError } = useToast()
  
  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: number; data?: any }) => 
      jobsService.applyToJob(jobId, data),
    onSuccess: (application) => {
      // Update applications cache
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      
      // Update store
      addApplication(application)
      
      showSuccess('Candidatura enviada com sucesso!')
    },
    onError: (error: any) => {
      showError('Erro ao enviar candidatura', error.response?.data?.message)
    }
  })
}

// Custom hook for employer jobs
export const useEmployerJobs = () => {
  const { jobs, jobsLoading } = useAppStore()
  
  const query = useQuery({
    queryKey: ['jobs', 'employer'],
    queryFn: jobsService.getEmployerJobs,
    staleTime: 2 * 60 * 1000,
  })
  
  return {
    ...query,
    jobs: query.data?.content || jobs,
    loading: query.isLoading || jobsLoading
  }
}