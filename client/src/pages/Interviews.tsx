import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { interviewService, jobService, Interview } from '../services/api'

export default function Interviews() {
  const [showModal, setShowModal] = useState(false)
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null)
  const [formData, setFormData] = useState({
    job: '',
    type: 'Video' as 'Phone Screen' | 'Video' | 'On-site' | 'Technical' | 'HR' | 'Panel' | 'Other',
    round: '1',
    scheduledDate: '',
    duration: '60',
    interviewer: '',
    location: '',
    meetingLink: '',
    status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled',
    notes: '',
    preparation: '',
    feedback: '',
    outcome: 'Pending' as 'Pending' | 'Passed' | 'Failed' | 'Next Round',
  })

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['interviews'],
    queryFn: interviewService.getAll,
  })

  const { data: jobsData } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: interviewService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      closeModal()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      interviewService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: interviewService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
    },
  })

  const openModal = (interview?: Interview) => {
    if (interview) {
      setEditingInterview(interview)
      setFormData({
        job: typeof interview.job === 'object' ? interview.job?._id || '' : interview.job || '',
        type: interview.type,
        round: interview.round?.toString() || '1',
        scheduledDate: new Date(interview.scheduledDate).toISOString().slice(0, 16),
        duration: interview.duration?.toString() || '60',
        interviewer: interview.interviewer || '',
        location: interview.location || '',
        meetingLink: interview.meetingLink || '',
        status: interview.status,
        notes: interview.notes || '',
        preparation: interview.preparation || '',
        feedback: interview.feedback || '',
        outcome: interview.outcome,
      })
    } else {
      setEditingInterview(null)
      setFormData({
        job: '',
        type: 'Video',
        round: '1',
        scheduledDate: '',
        duration: '60',
        interviewer: '',
        location: '',
        meetingLink: '',
        status: 'Scheduled',
        notes: '',
        preparation: '',
        feedback: '',
        outcome: 'Pending',
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingInterview(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData: any = {
      job: formData.job,
      type: formData.type,
      round: Number(formData.round),
      scheduledDate: formData.scheduledDate,
      duration: Number(formData.duration),
      interviewer: formData.interviewer || undefined,
      location: formData.location || undefined,
      meetingLink: formData.meetingLink || undefined,
      status: formData.status,
      notes: formData.notes || undefined,
      preparation: formData.preparation || undefined,
      feedback: formData.feedback || undefined,
      outcome: formData.outcome,
    }

    if (editingInterview) {
      updateMutation.mutate({ id: editingInterview._id, data: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      deleteMutation.mutate(id)
    }
  }

  const interviews = data?.interviews || []
  const jobs = jobsData?.jobs || []

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Scheduled: 'bg-blue-100 text-blue-800',
      Completed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
      Rescheduled: 'bg-yellow-100 text-yellow-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600 mt-1">Track your interview schedule</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Schedule Interview
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : interviews.length === 0 ? (
        <div className="card">
          <p className="text-center text-gray-500 py-12">
            No interviews scheduled. Click "Schedule Interview" to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview: Interview) => (
            <div key={interview._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {typeof interview.job === 'object' ? interview.job?.position : 'Interview'}
                    </h3>
                    <span className={`badge ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📅 {new Date(interview.scheduledDate).toLocaleString()}</p>
                    <p>🎯 {interview.type} - Round {interview.round}</p>
                    <p>⏱️ Duration: {interview.duration} minutes</p>
                    {interview.interviewer && <p>👤 Interviewer: {interview.interviewer}</p>}
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        🔗 Join Meeting
                      </a>
                    )}
                    {interview.location && <p>📍 {interview.location}</p>}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(interview)}
                    className="btn btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(interview._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingInterview ? 'Edit Interview' : 'Schedule Interview'}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Job *</label>
                  <select
                    required
                    className="input"
                    value={formData.job}
                    onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                  >
                    <option value="">Select job</option>
                    {jobs.map((job: any) => (
                      <option key={job._id} value={job._id}>
                        {job.position} at {job.company?.name || 'Company'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Interview Type *</label>
                    <select
                      className="input"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    >
                      <option value="Phone Screen">Phone Screen</option>
                      <option value="Video">Video</option>
                      <option value="On-site">On-site</option>
                      <option value="Technical">Technical</option>
                      <option value="HR">HR</option>
                      <option value="Panel">Panel</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Round</label>
                    <input
                      type="number"
                      min="1"
                      className="input"
                      value={formData.round}
                      onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Scheduled Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      className="input"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Duration (minutes)</label>
                    <input
                      type="number"
                      min="15"
                      className="input"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Interviewer Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.interviewer}
                    onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Meeting Link</label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://zoom.us/..."
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Location</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Status</label>
                    <select
                      className="input"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Rescheduled">Rescheduled</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Outcome</label>
                    <select
                      className="input"
                      value={formData.outcome}
                      onChange={(e) => setFormData({ ...formData, outcome: e.target.value as any })}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Passed">Passed</option>
                      <option value="Failed">Failed</option>
                      <option value="Next Round">Next Round</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Preparation Notes</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={formData.preparation}
                    onChange={(e) => setFormData({ ...formData, preparation: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Notes</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Feedback</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingInterview ? 'Update' : 'Schedule'} Interview
                  </button>
                  <button type="button" onClick={closeModal} className="btn btn-secondary flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Scheduled: 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Rescheduled: 'bg-yellow-100 text-yellow-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
