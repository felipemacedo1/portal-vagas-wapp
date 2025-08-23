export interface Job {
  id: number
  title: string
  description: string
  requirements?: string
  salaryMin?: number
  salaryMax?: number
  location: string
  remote: boolean
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
  company: Company
  createdAt: string
  updatedAt: string
}

export interface Company {
  id: number
  name: string
  description?: string
  website?: string
  verified: boolean
}

export interface JobFilters {
  title?: string
  location?: string
  remote?: boolean
  page?: number
  size?: number
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}