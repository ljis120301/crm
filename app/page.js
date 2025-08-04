'use client'

import { useState, useEffect } from 'react'
import CustomerSearchHeader from '@/components/CustomerSearchHeader'
import CustomerList from '@/components/CustomerList'
import CustomerDetails from '@/components/CustomerDetails'
import NotesSection from '@/components/NotesSection'
import AddCustomerDialog from '@/components/AddCustomerDialog'
import ManageFieldsDialog from '@/components/ManageFieldsDialog'
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog'

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

  useEffect(() => {
    fetchCustomers()
    fetchFields()
  }, [])

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

  return (
    <div className="h-screen flex">
      {/* Left Sidebar - Search and Customer List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
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
      <div className="flex-1 p-6">
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
