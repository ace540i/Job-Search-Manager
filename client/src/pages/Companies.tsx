import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companyService, Company } from '../services/api'

export default function Companies() {
  const [showModal, setShowModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    website: string
    industry: string
    size: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+' | ''
    location: string
    description: string
    notes: string
    rating: string
  }>({
    name: '',
    website: '',
    industry: '',
    size: '',
    location: '',
    description: '',
    notes: '',
    rating: '',
  })

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: companyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      closeModal()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      companyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: companyService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })

  const openModal = (company?: Company) => {
    console.log('openModal called', company)
    if (company) {
      setEditingCompany(company)
      setFormData({
        name: company.name,
        website: company.website || '',
        industry: company.industry || '',
        size: company.size || '',
        location: company.location || '',
        description: company.description || '',
        notes: company.notes || '',
        rating: company.rating?.toString() || '',
      })
    } else {
      setEditingCompany(null)
      setFormData({
        name: '',
        website: '',
        industry: '',
        size: '',
        location: '',
        description: '',
        notes: '',
        rating: '',
      })
    }
    console.log('Setting showModal to true')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCompany(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData: any = {
      name: formData.name,
      website: formData.website || undefined,
      industry: formData.industry || undefined,
      size: formData.size || undefined,
      location: formData.location || undefined,
      description: formData.description || undefined,
      notes: formData.notes || undefined,
      rating: formData.rating ? Number(formData.rating) : undefined,
    }

    if (editingCompany) {
      updateMutation.mutate({ id: editingCompany._id, data: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteMutation.mutate(id)
    }
  }

  const companies = data?.companies || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">Manage companies you're interested in</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Add Company
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : companies.length === 0 ? (
        <div className="card">
          <p className="text-center text-gray-500 py-12">
            No companies yet. Click "Add Company" to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company: Company) => (
            <div key={company._id} className="card hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                  {company.rating && (
                    <span className="text-yellow-500">★ {company.rating}</span>
                  )}
                </div>
                
                {company.industry && (
                  <p className="text-sm text-gray-600">{company.industry}</p>
                )}
                
                {company.location && (
                  <p className="text-sm text-gray-500">📍 {company.location}</p>
                )}
                
                {company.size && (
                  <p className="text-sm text-gray-500">👥 {company.size} employees</p>
                )}
                
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                )}

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => openModal(company)}
                    className="btn btn-secondary flex-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(company._id)}
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
                  {editingCompany ? 'Edit Company' : 'Add Company'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Company Name *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="label">Website</label>
                  <input
                    type="url"
                    className="input"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Industry</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="label">Company Size</label>
                    <select
                      className="input"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value as any })
                      }
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="501-1000">501-1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Location</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="label">Notes</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="label">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="input"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingCompany ? 'Update' : 'Create'} Company
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-secondary flex-1"
                  >
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
