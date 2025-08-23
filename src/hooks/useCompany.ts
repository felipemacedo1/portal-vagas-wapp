import { useQuery } from '@tanstack/react-query'
import { jobsService } from '../services/jobs'

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => jobsService.getCompany(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}