import { apiClient } from './api';
import { Job, JobApplication } from '../types/jobs';

export class JobsService {
  // Público
  async getPublicJobs(params?: { search?: string; location?: string }): Promise<Job[]> {
    return apiClient.get<Job[]>('/jobs/public', { params });
  }

  async getPublicJob(id: string): Promise<Job> {
    return apiClient.get<Job>(`/jobs/public/${id}`);
  }

  // Candidate
  async applyToJob(jobId: string): Promise<void> {
    return apiClient.post(`/candidates/applications?jobId=${jobId}`);
  }

  async getCandidateApplications(): Promise<JobApplication[]> {
    return apiClient.get<JobApplication[]>('/candidates/applications');
  }

  // Employer
  async createJob(job: Partial<Job>): Promise<Job> {
    return apiClient.post<Job>('/jobs', job);
  }

  async submitJob(jobId: string): Promise<void> {
    return apiClient.post(`/jobs/${jobId}/submit`);
  }

  async getJobApplications(): Promise<JobApplication[]> {
    return apiClient.get<JobApplication[]>('/jobs/applications');
  }

  async updateApplicationStatus(applicationId: string, status: string): Promise<void> {
    return apiClient.put(`/jobs/applications/${applicationId}/status`, { status });
  }

  // Admin
  async getPendingJobs(): Promise<Job[]> {
    return apiClient.get<Job[]>('/admin/jobs/pending');
  }

  async approveJob(jobId: string): Promise<void> {
    return apiClient.post(`/admin/jobs/${jobId}/approve`);
  }

  async rejectJob(jobId: string): Promise<void> {
    return apiClient.post(`/admin/jobs/${jobId}/reject`);
  }
}

export const jobsService = new JobsService();