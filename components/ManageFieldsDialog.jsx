'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

export default function ManageFieldsDialog({ 
  isOpen, 
  onOpenChange, 
  fields, 
  editingField, 
  onSubmit, 
  onEditField, 
  onDeleteField 
}) {
  const fieldForm = useForm({
    defaultValues: {
      name: '',
      label: '',
      type: '',
      required: false,
      options: ''
    }
  })

  const handleSubmit = async (data) => {
    try {
      const fieldData = {
        name: data.name,
        label: data.label,
        type: data.type,
        required: data.required,
        options: data.type === 'select' ? data.options.split(',').map(opt => opt.trim()) : null,
        order: fields.length
      }

      await onSubmit(fieldData, editingField)
      fieldForm.reset()
    } catch (error) {
      console.error('Error submitting field:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Custom Fields</DialogTitle>
          <DialogDescription>
            Add or edit custom fields for customer records
          </DialogDescription>
        </DialogHeader>
        <Form {...fieldForm}>
          <form onSubmit={fieldForm.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={fieldForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., customer_id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={fieldForm.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Label</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Customer ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={fieldForm.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="textarea">Text Area</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {fieldForm.watch('type') === 'select' && (
              <FormField
                control={fieldForm.control}
                name="options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Options (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="Option 1, Option 2, Option 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={fieldForm.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Required field</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {editingField ? 'Update Field' : 'Add Field'}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Current Fields</h3>
          <div className="space-y-2">
            {fields.map((field) => (
              <div key={field.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="font-medium">{field.label}</p>
                  <p className="text-sm text-gray-500">{field.type}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditField(field)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteField(field)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 