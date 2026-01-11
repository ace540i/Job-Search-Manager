import { useState, ChangeEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobService, Job } from '../services/api'
import { Link } from 'react-router-dom'
import JobModal from '../components/JobModal'

export default function Jobs() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobService.getAll(filters),
  })

  const deleteMutation = useMutation({
    mutationFn: jobService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      alert('Job deleted successfully')
    },
  })

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingJob(null)
  }

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600 mt-1">Track and manage your job applications</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          + Add Job
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              className="input"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="Wishlist">Wishlist</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              className="input"
              value={filters.priority}
              onChange={handleFilterChange}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              name="search"
              className="input"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.jobs?.map((job) => (
            <div key={job._id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <Link to={`/jobs/${job._id}`} className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                    {job.position}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    {job.company?.name || 'No company'}
                  </p>
                </div>
                <span className={`badge ${getPriorityColor(job.priority)}`}>
                  {job.priority}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">📍 {job.location || 'Remote'}</p>
                <p className="text-sm text-gray-600">💼 {job.jobType}</p>
                <p className="text-sm text-gray-600">🏠 {job.workMode}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className={`badge ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(job)}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data?.jobs?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No jobs found. Add your first job to get started!</p>
        </div>
      )}

      {isModalOpen && (
        <JobModal
          job={editingJob}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Wishlist: 'bg-gray-100 text-gray-800',
    Applied: 'bg-blue-100 text-blue-800',
    Interview: 'bg-yellow-100 text-yellow-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Accepted: 'bg-green-100 text-green-800',
    Declined: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    Low: 'bg-gray-100 text-gray-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  }
  return colors[priority] || 'bg-gray-100 text-gray-800'
}
