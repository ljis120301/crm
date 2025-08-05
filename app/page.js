'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CustomerSearchHeader from '@/components/CustomerSearchHeader'
import CustomerList from '@/components/CustomerList'
import CustomerDetails from '@/components/CustomerDetails'
import NotesSection from '@/components/NotesSection'
import AddCustomerDialog from '@/components/AddCustomerDialog'
import ManageFieldsDialog from '@/components/ManageFieldsDialog'
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([])
  const [fields, setFields] = useState([])
  const [notes, setNotes] = useState([])
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [isManageFieldsOpen, setIsManageFieldsOpen] = useState(false)
  const [isDeleteCustomerOpen, setIsDeleteCustomerOpen] = useState(false)
  const [isDeleteFieldOpen, setIsDeleteFieldOpen] = useState(false)
  const [isDeleteNoteOpen, setIsDeleteNoteOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState(null)
  const [fieldToDelete, setFieldToDelete] = useState(null)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [editingField, setEditingField] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [newNote, setNewNote] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchCustomers()
    fetchFields()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/login')
        return
      }
      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      const data = await response.json()
      const customersData = Array.isArray(data) ? data : []
      setCustomers(customersData)
      
      // Update selectedCustomer if one is currently selected
      if (selectedCustomer) {
        const updatedSelectedCustomer = customersData.find(c => c.id === selectedCustomer.id)
        if (updatedSelectedCustomer) {
          setSelectedCustomer(updatedSelectedCustomer)
        }
      }
    } catch (error) {
      setCustomers([])
    }
  }

  const fetchFields = async () => {
    try {
      const response = await fetch('/api/fields')
      const data = await response.json()
      setFields(data)
    } catch (error) {
    }
  }

  const fetchNotes = async (customerId) => {
    if (!customerId) return
    try {
      const response = await fetch(`/api/notes?customerId=${customerId}`)
      const data = await response.json()
      setNotes(data)
    } catch (error) {
    }
  }

  const handleCustomerSubmit = async (customerData, editingCustomer) => {
    try {
      if (editingCustomer) {
        await fetch(`/api/customers/${editingCustomer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData)
        })
      } else {
        await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData)
        })
      }

      setEditingCustomer(null)
      setIsAddCustomerOpen(false)
      fetchCustomers()
    } catch (error) {
    }
  }

  const handleFieldSubmit = async (fieldData, editingField) => {
    try {
      if (editingField) {
        await fetch(`/api/fields/${editingField.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fieldData)
        })
      } else {
        await fetch('/api/fields', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fieldData)
        })
      }

      setEditingField(null)
      setIsManageFieldsOpen(false)
      fetchFields()
      // Also refresh customers to update their customFields structure
      fetchCustomers()
    } catch (error) {
    }
  }

  const deleteCustomer = async (id) => {
    try {
      await fetch(`/api/customers/${id}`, { method: 'DELETE' })
      fetchCustomers()
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null)
        setNotes([])
      }
      setIsDeleteCustomerOpen(false)
      setCustomerToDelete(null)
    } catch (error) {
    }
  }

  const deleteField = async (id) => {
    try {
      await fetch(`/api/fields/${id}`, { method: 'DELETE' })
      fetchFields()
      // Also refresh customers to update their customFields structure
      fetchCustomers()
      setIsDeleteFieldOpen(false)
      setFieldToDelete(null)
    } catch (error) {
    }
  }

  const editCustomer = (customer) => {
    setEditingCustomer(customer)
    setIsAddCustomerOpen(true)
  }

  const addNote = async () => {
    if (!newNote.trim() || !selectedCustomer) return
    
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNote.trim(),
          customerId: selectedCustomer.id
        })
      })
      
      setNewNote('')
      fetchNotes(selectedCustomer.id)
    } catch (error) {
    }
  }

  const deleteNote = async (noteId) => {
    try {
      await fetch(`/api/notes/${noteId}`, { method: 'DELETE' })
      fetchNotes(selectedCustomer.id)
      setIsDeleteNoteOpen(false)
      setNoteToDelete(null)
    } catch (error) {
    }
  }

  const editField = (field) => {
    setEditingField(field)
    setIsManageFieldsOpen(true)
  }

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer)
    fetchNotes(customer.id)
  }

  const handleCustomerDelete = (customer) => {
    setCustomerToDelete(customer)
    setIsDeleteCustomerOpen(true)
  }

  const handleFieldDelete = (field) => {
    setFieldToDelete(field)
    setIsDeleteFieldOpen(true)
  }

  const handleNoteDelete = (note) => {
    setNoteToDelete(note)
    setIsDeleteNoteOpen(true)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header with user info and logout */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Customer Management System</h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Welcome, {user?.username}</span>
            <span className="sm:hidden">{user?.username}</span>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Sidebar - Search and Customer List */}
        <div className="w-full lg:w-1/3 xl:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
          <CustomerSearchHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onManageFieldsOpen={() => setIsManageFieldsOpen(true)}
            onAddCustomerOpen={() => setIsAddCustomerOpen(true)}
          />

          <CustomerList
            customers={customers}
            selectedCustomer={selectedCustomer}
            searchTerm={searchTerm}
            onCustomerSelect={handleCustomerSelect}
            onCustomerEdit={editCustomer}
            onCustomerDelete={handleCustomerDelete}
          />
        </div>

        {/* Right Side - Customer Details */}
        <div className="flex-1 p-4 sm:p-6">
          <CustomerDetails
            customer={selectedCustomer}
            fields={fields}
            onEdit={editCustomer}
            onDelete={handleCustomerDelete}
          />

          {selectedCustomer && (
            <NotesSection
              notes={notes}
              newNote={newNote}
              onNewNoteChange={setNewNote}
              onAddNote={addNote}
              onDeleteNote={handleNoteDelete}
            />
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AddCustomerDialog
        isOpen={isAddCustomerOpen}
        onOpenChange={setIsAddCustomerOpen}
        editingCustomer={editingCustomer}
        fields={fields}
        onSubmit={handleCustomerSubmit}
      />

      <ManageFieldsDialog
        isOpen={isManageFieldsOpen}
        onOpenChange={setIsManageFieldsOpen}
        fields={fields}
        editingField={editingField}
        onSubmit={handleFieldSubmit}
        onEditField={editField}
        onDeleteField={handleFieldDelete}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteCustomerOpen}
        onOpenChange={setIsDeleteCustomerOpen}
        title="Delete Customer"
        description={`Are you sure you want to delete "${customerToDelete?.name}"? This action cannot be undone.`}
        onConfirm={() => deleteCustomer(customerToDelete?.id)}
        onCancel={() => {
          setIsDeleteCustomerOpen(false)
          setCustomerToDelete(null)
        }}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteFieldOpen}
        onOpenChange={setIsDeleteFieldOpen}
        title="Delete Field"
        description={`Are you sure you want to delete the field "${fieldToDelete?.label}"? This action cannot be undone.`}
        onConfirm={() => deleteField(fieldToDelete?.id)}
        onCancel={() => {
          setIsDeleteFieldOpen(false)
          setFieldToDelete(null)
        }}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteNoteOpen}
        onOpenChange={setIsDeleteNoteOpen}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={() => deleteNote(noteToDelete?.id)}
        onCancel={() => {
          setIsDeleteNoteOpen(false)
          setNoteToDelete(null)
        }}
      />
    </div>
  )
}
