import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contactService, companyService, Contact } from '../services/api'

export default function Contacts() {
  const [showModal, setShowModal] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    linkedin: '',
    company: '',
    notes: '',
    lastContactDate: '',
  })

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: contactService.getAll,
  })

  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: contactService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      closeModal()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      contactService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: contactService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })

  const openModal = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact)
      setFormData({
        name: contact.name,
        title: contact.title || '',
        email: contact.email || '',
        phone: contact.phone || '',
        linkedin: contact.linkedin || '',
        company: typeof contact.company === 'object' ? contact.company?._id || '' : contact.company || '',
        notes: contact.notes || '',
        lastContactDate: contact.lastContactDate ? new Date(contact.lastContactDate).toISOString().split('T')[0] : '',
      })
    } else {
      setEditingContact(null)
      setFormData({
        name: '',
        title: '',
        email: '',
        phone: '',
        linkedin: '',
        company: '',
        notes: '',
        lastContactDate: '',
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingContact(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData: any = {
      name: formData.name,
      title: formData.title || undefined,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      linkedin: formData.linkedin || undefined,
      company: formData.company || undefined,
      notes: formData.notes || undefined,
      lastContactDate: formData.lastContactDate || undefined,
    }

    if (editingContact) {
      updateMutation.mutate({ id: editingContact._id, data: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteMutation.mutate(id)
    }
  }

  const contacts = data?.contacts || []
  const companies = companiesData?.companies || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your professional contacts</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Add Contact
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : contacts.length === 0 ? (
        <div className="card">
          <p className="text-center text-gray-500 py-12">
            No contacts yet. Click "Add Contact" to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact: Contact) => (
            <div key={contact._id} className="card hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">{contact.name}</h3>
                
                {contact.title && (
                  <p className="text-sm text-gray-600">{contact.title}</p>
                )}
                
                {contact.company && typeof contact.company === 'object' && (
                  <p className="text-sm text-gray-500">🏢 {contact.company.name}</p>
                )}
                
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline block">
                    ✉️ {contact.email}
                  </a>
                )}
                
                {contact.phone && (
                  <p className="text-sm text-gray-500">📞 {contact.phone}</p>
                )}
                
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline block"
                  >
                    💼 LinkedIn
                  </a>
                )}

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => openModal(contact)}
                    className="btn btn-secondary flex-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact._id)}
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
                  {editingContact ? 'Edit Contact' : 'Add Contact'}
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
                  <label className="label">Name *</label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Title</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="label">Company</label>
                    <select
                      className="input"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    >
                      <option value="">Select company</option>
                      {companies.map((company: any) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Phone</label>
                    <input
                      type="tel"
                      className="input"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="label">Last Contact Date</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.lastContactDate}
                      onChange={(e) =>
                        setFormData({ ...formData, lastContactDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="label">LinkedIn URL</label>
                  <input
                    type="url"
                    className="input"
                    value={formData.linkedin}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedin: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="label">Notes</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingContact ? 'Update' : 'Create'} Contact
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
