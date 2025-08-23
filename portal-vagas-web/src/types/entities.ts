// Base types
export interface BaseEntity {
  id: number
  createdAt: string
  updatedAt: string
}

// User and Auth
export interface User extends BaseEntity {
  email: string
  role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE'
  isActive: boolean
  lastLoginAt?: string
}

export interface Candidate extends BaseEntity {
  userId: number
  user: User
  fullName?: string
  phone?: string
  skills?: string
  experience?: string
  cvUrl?: string
  profileCompleteness: number
}

export interface Company extends BaseEntity {
  name: string
  description?: string
  website?: string
  address?: string
  phone?: string
  verified: boolean
  userId: number
  user: User
}

export interface Job extends BaseEntity {
  title: string
  description: string
  requirements?: string
  location: string
  remote: boolean
  salaryMin?: number
  salaryMax?: number
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
  companyId: number
  company: Company
  applicationsCount: number
}

export interface Application extends BaseEntity {
  candidateId: number
  candidate: Candidate
  jobId: number
  job: Job
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INTERVIEW'
  coverLetter?: string
  resumeUrl?: string
  appliedAt: string
}

// API Response types
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// Statistics
export interface DashboardStats {
  candidate: {
    totalApplications: number
    pendingApplications: number
    approvedApplications: number
    profileCompleteness: number
  }
  employer: {
    totalJobs: number
    activeJobs: number
    totalApplications: number
    pendingApplications: number
  }
  admin: {
    pendingJobs: number
    unverifiedCompanies: number
    totalUsers: number
    todayApprovals: number
  }
}