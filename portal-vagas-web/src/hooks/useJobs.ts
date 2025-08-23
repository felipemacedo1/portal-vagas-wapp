import { useQuery } from '@tanstack/react-query'
import { jobsService } from '../services/jobs'
import { JobFilters } from '../types/jobs'

export const useJobs = (filters: JobFilters = {}) => {
  return useQuery({
    queryKey: ['jobs', 'public', filters],
    queryFn: () => jobsService.getPublicJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsService.getPublicJob(id),
    enabled: !!id,
  })
}