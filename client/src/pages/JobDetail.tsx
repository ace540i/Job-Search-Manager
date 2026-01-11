import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { jobService } from '../services/api'

export default function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getById(id!),
  })

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  const job = data?.job

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/jobs')}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{job?.position}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Job Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Company</label>
                <p className="text-gray-900">{job?.company?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <p className="text-gray-900">{job?.location || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Type</label>
                  <p className="text-gray-900">{job?.jobType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Work Mode</label>
                  <p className="text-gray-900">{job?.workMode}</p>
                </div>
              </div>
              {job?.jobUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Link</label>
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline block"
                  >
                    View Job Posting
                  </a>
                </div>
              )}
            </div>
          </div>

          {job?.description && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>
          )}

          {job?.notes && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Notes</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Status</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Current Status</label>
                <p className={`badge ${getStatusColor(job?.status || '')} mt-1`}>
                  {job?.status}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>
                <p className={`badge ${getPriorityColor(job?.priority || '')} mt-1`}>
                  {job?.priority}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Dates</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="font-medium text-gray-600">Created</label>
                <p className="text-gray-900">
                  {job?.createdAt && new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
              {job?.applicationDate && (
                <div>
                  <label className="font-medium text-gray-600">Applied</label>
                  <p className="text-gray-900">
                    {new Date(job.applicationDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <label className="font-medium text-gray-600">Last Updated</label>
                <p className="text-gray-900">
                  {job?.updatedAt && new Date(job.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
