import { useState, useEffect } from 'react';
import { jobsService } from '../services/jobs';
import { Job } from '../types/jobs';

export const useJobs = (params?: { search?: string; location?: string }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await jobsService.getPublicJobs(params);
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar vagas');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [params?.search, params?.location]);

  const refetch = () => {
    setLoading(true);
    jobsService.getPublicJobs(params)
      .then(setJobs)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  return {
    jobs,
    loading,
    error,
    refetch,
  };
};