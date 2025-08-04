'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PhoneInput } from '@/components/ui/phone-input'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

export default function AddCustomerDialog({ 
  isOpen, 
  onOpenChange, 
  editingCustomer, 
  fields, 
  onSubmit 
}) {
  // Create default values function that includes all custom fields
  const getCustomerFormDefaults = (customer = null) => {
    const defaults = {
      name: customer?.name || '',
      phone: customer?.phone || '',
      email: customer?.email || ''
    }
    
    // Add all custom fields with default values
    fields.forEach(field => {
      defaults[field.name] = customer?.customFields?.[field.name] || ''
    })
    
    return defaults
  }

  const customerForm = useForm({
    defaultValues: getCustomerFormDefaults(editingCustomer)
  })

  // Update form values when editingCustomer or fields change
  useEffect(() => {
    const defaults = getCustomerFormDefaults(editingCustomer)
    customerForm.reset(defaults)
  }, [editingCustomer, fields, customerForm])

  const handleSubmit = async (data) => {
    try {
      const customFields = {}
      fields.forEach(field => {
        // Include all custom fields, even if empty, to preserve existing data
        customFields[field.name] = data[field.name] || ''
      })

      const customerData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        customFields
      }

      await onSubmit(customerData, editingCustomer)
      customerForm.reset(getCustomerFormDefaults())
    } catch (error) {
      console.error('Error submitting customer:', error)
    }
  }

  const renderFieldInput = (field) => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea 
            value={customerForm.watch(field.name) || ''}
            onChange={(e) => customerForm.setValue(field.name, e.target.value)}
            onBlur={customerForm.register(field.name).onBlur}
          />
        )
      case 'select':
        return (
          <Select 
            value={customerForm.watch(field.name) || ''} 
            onValueChange={(value) => customerForm.setValue(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'phone':
        return (
          <PhoneInput 
            placeholder="(555) 123-4567"
            value={customerForm.watch(field.name) || ''}
            onChange={(value) => customerForm.setValue(field.name, value)}
          />
        )
      default:
        return (
          <Input 
            value={customerForm.watch(field.name) || ''}
            onChange={(e) => customerForm.setValue(field.name, e.target.value)}
            onBlur={customerForm.register(field.name).onBlur}
          />
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </DialogTitle>
          <DialogDescription>
            Enter customer information below
          </DialogDescription>
        </DialogHeader>
        <Form {...customerForm}>
          <form onSubmit={customerForm.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={customerForm.control}
              name="name"
              rules={editingCustomer ? {} : { required: 'Name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name {!editingCustomer && '*'}</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={customerForm.control}
              name="phone"
              rules={editingCustomer ? {} : { required: 'Phone is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone {!editingCustomer && '*'}</FormLabel>
                  <FormControl>
                    <PhoneInput 
                      placeholder="(555) 123-4567" 
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={customerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {fields.map((field) => (
              <FormField
                key={field.id}
                control={customerForm.control}
                name={field.name}
                rules={field.required ? { required: `${field.label} is required` } : {}}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>
                      {field.label} {field.required && '*'}
                    </FormLabel>
                    <FormControl>
                      {renderFieldInput(field)}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            
            <Button type="submit" className="w-full">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 