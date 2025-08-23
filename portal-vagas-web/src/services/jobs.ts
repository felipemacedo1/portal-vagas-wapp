import { api } from './api'
import type { Job, JobFilters, PageResponse, Application } from '../types/entities'

export const jobsService = {
  // Public endpoints
  async getPublicJobs(filters: JobFilters = {}): Promise<PageResponse<Job>> {
    const params = new URLSearchParams()
    
    if (filters.title) params.append('title', filters.title)
    if (filters.location) params.append('location', filters.location)
    if (filters.remote !== undefined) params.append('remote', filters.remote.toString())
    if (filters.page !== undefined) params.append('page', filters.page.toString())
    if (filters.size !== undefined) params.append('size', filters.size.toString())
    
    const response = await api.get(`/jobs/public?${params}`)
    return response.data
  },

  async getPublicJob(id: string): Promise<Job> {
    const response = await api.get(`/jobs/public/${id}`)
    return response.data
  },

  // Candidate endpoints
  async applyToJob(jobId: number, data?: { coverLetter?: string }): Promise<Application> {
    const response = await api.post(`/candidates/applications?jobId=${jobId}`, data)
    return response.data
  },

  async getCandidateApplications(page = 0, size = 10): Promise<PageResponse<Application>> {
    const response = await api.get(`/candidates/applications?page=${page}&size=${size}`)
    return response.data
  },

  // Employer endpoints
  async getEmployerJobs(page = 0, size = 10): Promise<PageResponse<Job>> {
    const response = await api.get(`/jobs?page=${page}&size=${size}`)
    return response.data
  },

  async createJob(jobData: Partial<Job>): Promise<Job> {
    const response = await api.post('/jobs', jobData)
    return response.data
  },

  async updateJob(id: number, jobData: Partial<Job>): Promise<Job> {
    const response = await api.put(`/jobs/${id}`, jobData)
    return response.data
  },

  async deleteJob(id: number): Promise<void> {
    await api.delete(`/jobs/${id}`)
  },

  async submitJob(id: number): Promise<Job> {
    const response = await api.post(`/jobs/${id}/submit`)
    return response.data
  },

  async getJobApplications(jobId: number, page = 0, size = 10): Promise<PageResponse<Application>> {
    const response = await api.get(`/jobs/${jobId}/applications?page=${page}&size=${size}`)
    return response.data
  },

  async getEmployerApplications(page = 0, size = 10): Promise<PageResponse<Application>> {
    const response = await api.get(`/jobs/applications?page=${page}&size=${size}`)
    return response.data
  },

  async updateApplicationStatus(applicationId: number, status: string): Promise<Application> {
    const response = await api.put(`/jobs/applications/${applicationId}/status`, { status })
    return response.data
  },

  // Admin endpoints
  async getPendingJobs(page = 0, size = 10): Promise<PageResponse<Job>> {
    const response = await api.get(`/admin/jobs/pending?page=${page}&size=${size}`)
    return response.data
  },

  async approveJob(id: number): Promise<Job> {
    const response = await api.post(`/admin/jobs/${id}/approve`)
    return response.data
  },

  async rejectJob(id: number, reason?: string): Promise<Job> {
    const response = await api.post(`/admin/jobs/${id}/reject`, { reason })
    return response.data
  },

  // Statistics
  async getDashboardStats(): Promise<any> {
    const response = await api.get('/dashboard/stats')
    return response.data
  },

  async getJobStats(jobId: number): Promise<any> {
    const response = await api.get(`/jobs/${jobId}/stats`)
    return response.data
  }
}