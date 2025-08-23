import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Job, Application, Company, DashboardStats } from '../../types/entities'

interface AppState {
  // Jobs
  jobs: Job[]
  currentJob: Job | null
  jobsLoading: boolean
  
  // Applications
  applications: Application[]
  applicationsLoading: boolean
  
  // Companies
  companies: Company[]
  currentCompany: Company | null
  
  // Statistics
  stats: DashboardStats | null
  
  // UI State
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
    timestamp: number
  }>
  
  // Actions
  setJobs: (jobs: Job[]) => void
  addJob: (job: Job) => void
  updateJob: (id: number, updates: Partial<Job>) => void
  removeJob: (id: number) => void
  setCurrentJob: (job: Job | null) => void
  setJobsLoading: (loading: boolean) => void
  
  setApplications: (applications: Application[]) => void
  addApplication: (application: Application) => void
  updateApplication: (id: number, updates: Partial<Application>) => void
  setApplicationsLoading: (loading: boolean) => void
  
  setCompanies: (companies: Company[]) => void
  setCurrentCompany: (company: Company | null) => void
  
  setStats: (stats: DashboardStats) => void
  
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>()(
  immer((set, get) => ({
    // Initial state
    jobs: [],
    currentJob: null,
    jobsLoading: false,
    
    applications: [],
    applicationsLoading: false,
    
    companies: [],
    currentCompany: null,
    
    stats: null,
    
    notifications: [],
    
    // Jobs actions
    setJobs: (jobs) => set((state) => {
      state.jobs = jobs
    }),
    
    addJob: (job) => set((state) => {
      state.jobs.unshift(job)
    }),
    
    updateJob: (id, updates) => set((state) => {
      const index = state.jobs.findIndex(job => job.id === id)
      if (index !== -1) {
        Object.assign(state.jobs[index], updates)
      }
    }),
    
    removeJob: (id) => set((state) => {
      state.jobs = state.jobs.filter(job => job.id !== id)
    }),
    
    setCurrentJob: (job) => set((state) => {
      state.currentJob = job
    }),
    
    setJobsLoading: (loading) => set((state) => {
      state.jobsLoading = loading
    }),
    
    // Applications actions
    setApplications: (applications) => set((state) => {
      state.applications = applications
    }),
    
    addApplication: (application) => set((state) => {
      state.applications.unshift(application)
      // Update job applications count
      const job = state.jobs.find(j => j.id === application.jobId)
      if (job) {
        job.applicationsCount += 1
      }
    }),
    
    updateApplication: (id, updates) => set((state) => {
      const index = state.applications.findIndex(app => app.id === id)
      if (index !== -1) {
        Object.assign(state.applications[index], updates)
      }
    }),
    
    setApplicationsLoading: (loading) => set((state) => {
      state.applicationsLoading = loading
    }),
    
    // Companies actions
    setCompanies: (companies) => set((state) => {
      state.companies = companies
    }),
    
    setCurrentCompany: (company) => set((state) => {
      state.currentCompany = company
    }),
    
    // Stats actions
    setStats: (stats) => set((state) => {
      state.stats = stats
    }),
    
    // Notifications actions
    addNotification: (notification) => set((state) => {
      const id = Date.now().toString()
      state.notifications.push({
        ...notification,
        id,
        timestamp: Date.now()
      })
    }),
    
    removeNotification: (id) => set((state) => {
      state.notifications = state.notifications.filter(n => n.id !== id)
    }),
    
    clearNotifications: () => set((state) => {
      state.notifications = []
    })
  }))
)