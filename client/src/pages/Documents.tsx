import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService, jobService, Document } from '../services/api'

export default function Documents() {
  const [showModal, setShowModal] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Resume' as 'Resume' | 'Cover Letter' | 'Portfolio' | 'Certificate' | 'Other',
    fileUrl: '',
    job: '',
    description: '',
  })

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: documentService.getAll,
  })

  const { data: jobsData } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: documentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      closeModal()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      documentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: documentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  const openModal = (document?: Document) => {
    if (document) {
      setEditingDocument(document)
      setFormData({
        name: document.name,
        type: document.type,
        fileUrl: document.fileUrl,
        job: typeof document.job === 'object' ? document.job?._id || '' : document.job || '',
        description: document.description || '',
      })
    } else {
      setEditingDocument(null)
      setFormData({
        name: '',
        type: 'Resume',
        fileUrl: '',
        job: '',
        description: '',
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingDocument(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData: any = {
      name: formData.name,
      type: formData.type,
      fileUrl: formData.fileUrl,
      job: formData.job || undefined,
      description: formData.description || undefined,
    }

    if (editingDocument) {
      updateMutation.mutate({ id: editingDocument._id, data: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(id)
    }
  }

  const documents = data?.documents || []
  const jobs = jobsData?.jobs || []

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      Resume: '📄',
      'Cover Letter': '📝',
      Portfolio: '💼',
      Certificate: '🎓',
      Other: '📎',
    }
    return icons[type] || '📎'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Manage your resumes, cover letters, and more</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Upload Document
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : documents.length === 0 ? (
        <div className="card">
          <p className="text-center text-gray-500 py-12">
            No documents yet. Click "Upload Document" to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document: Document) => (
            <div key={document._id} className="card hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(document.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{document.name}</h3>
                      <span className="text-xs text-gray-500">{document.type}</span>
                    </div>
                  </div>
                </div>

                {document.description && (
                  <p className="text-sm text-gray-600">{document.description}</p>
                )}

                {document.job && typeof document.job === 'object' && (
                  <p className="text-sm text-gray-500">
                    🎯 Related to: {document.job.position}
                  </p>
                )}

                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline block"
                >
                  View Document →
                </a>

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => openModal(document)}
                    className="btn btn-secondary flex-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(document._id)}
                    className="btn btn-danger flex-1"
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
                  {editingDocument ? 'Edit Document' : 'Upload Document'}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Document Name *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Document Type *</label>
                  <select
                    className="input"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  >
                    <option value="Resume">Resume</option>
                    <option value="Cover Letter">Cover Letter</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="label">File URL *</label>
                  <input
                    type="url"
                    required
                    className="input"
                    placeholder="https://drive.google.com/..."
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload your file to Google Drive, Dropbox, or similar and paste the shareable link here
                  </p>
                </div>

                <div>
                  <label className="label">Related Job (Optional)</label>
                  <select
                    className="input"
                    value={formData.job}
                    onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                  >
                    <option value="">None</option>
                    {jobs.map((job: any) => (
                      <option key={job._id} value={job._id}>
                        {job.position} at {job.company?.name || 'Company'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingDocument ? 'Update' : 'Upload'} Document
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
