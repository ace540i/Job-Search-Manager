import api from '../lib/api'

// Types
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  resume?: string
}

export interface Job {
  _id: string
  user: string
  company?: Company
  position: string
  location?: string
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance'
  workMode: 'Remote' | 'Hybrid' | 'On-site'
  salary?: {
    min?: number
    max?: number
    currency: string
  }
  status: 'Wishlist' | 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted' | 'Declined'
  priority: 'Low' | 'Medium' | 'High'
  jobUrl?: string
  description?: string
  requirements?: string
  notes?: string
  applicationDate?: string
  responseDate?: string
  followUpDate?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Company {
  _id: string
  user: string
  name: string
  website?: string
  industry?: string
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+'
  location?: string
  description?: string
  logo?: string
  notes?: string
  rating?: number
  createdAt: string
}

export interface Contact {
  _id: string
  user: string
  company?: Company
  name: string
  title?: string
  email?: string
  phone?: string
  linkedin?: string
  notes?: string
  lastContactDate?: string
  createdAt: string
}

export interface Interview {
  _id: string
  user: string
  job: Job | string
  type: 'Phone Screen' | 'Video' | 'On-site' | 'Technical' | 'HR' | 'Panel' | 'Other'
  round: number
  scheduledDate: string
  duration: number
  interviewer?: string
  location?: string
  meetingLink?: string
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled'
  notes?: string
  preparation?: string
  feedback?: string
  outcome: 'Pending' | 'Passed' | 'Failed' | 'Next Round'
  createdAt: string
}

export interface Document {
  _id: string
  user: string
  job?: Job | string
  name: string
  type: 'Resume' | 'Cover Letter' | 'Portfolio' | 'Certificate' | 'Other'
  fileUrl: string
  notes?: string
  uploadDate: string
  createdAt: string
}

export interface Stats {
  totalJobs: number
  activeApplications: number
  upcomingInterviews: number
  responseRate: number
  jobsByStatus: Array<{ _id: string; count: number }>
  recentJobs: Job[]
}

// Auth Service
export const authService = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/auth/update', data)
    return response.data
  },
}

// Job Service
export const jobService = {
  getAll: async (params?: { status?: string; priority?: string; search?: string }) => {
    const response = await api.get<{ success: boolean; count: number; jobs: Job[] }>('/jobs', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; job: Job }>(`/jobs/${id}`)
    return response.data
  },

  create: async (data: Partial<Job>) => {
    const response = await api.post('/jobs', data)
    return response.data
  },

  update: async (id: string, data: Partial<Job>) => {
    const response = await api.put(`/jobs/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/jobs/${id}`)
    return response.data
  },
}

// Company Service
export const companyService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; count: number; companies: Company[] }>('/companies')
    return response.data
  },

  create: async (data: Partial<Company>) => {
    const response = await api.post('/companies', data)
    return response.data
  },

  update: async (id: string, data: Partial<Company>) => {
    const response = await api.put(`/companies/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/companies/${id}`)
    return response.data
  },
}

// Contact Service
export const contactService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; count: number; contacts: Contact[] }>('/contacts')
    return response.data
  },

  create: async (data: Partial<Contact>) => {
    const response = await api.post('/contacts', data)
    return response.data
  },

  update: async (id: string, data: Partial<Contact>) => {
    const response = await api.put(`/contacts/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/contacts/${id}`)
    return response.data
  },
}

// Interview Service
export const interviewService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; count: number; interviews: Interview[] }>('/interviews')
    return response.data
  },

  create: async (data: Partial<Interview>) => {
    const response = await api.post('/interviews', data)
    return response.data
  },

  update: async (id: string, data: Partial<Interview>) => {
    const response = await api.put(`/interviews/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/interviews/${id}`)
    return response.data
  },
}

// Document Service
export const documentService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; count: number; documents: Document[] }>('/documents')
    return response.data
  },

  create: async (data: Partial<Document>) => {
    const response = await api.post('/documents', data)
    return response.data
  },

  update: async (id: string, data: Partial<Document>) => {
    const response = await api.put(`/documents/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/documents/${id}`)
    return response.data
  },
}

// Stats Service
export const statsService = {
  getStats: async () => {
    const response = await api.get<{ success: boolean; stats: Stats }>('/stats')
    return response.data
  },
}
