export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary?: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  companyId: string;
  company: Company;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  website?: string;
  verified: boolean;
  employerId: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
  job: Job;
  candidate: Candidate;
}

export interface Candidate {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  resume?: string;
  skills?: string;
}