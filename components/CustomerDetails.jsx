'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Phone, Mail, Edit, Trash2 } from 'lucide-react'

export default function CustomerDetails({ 
  customer, 
  fields, 
  onEdit, 
  onDelete 
}) {
  if (!customer) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Customer Selected</h2>
          <p className="text-gray-500">
            Select a customer from the list to view their details
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="w-6 h-6" />
                {customer.name}
              </CardTitle>
              <CardDescription>
                Customer Details
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onEdit(customer)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => onDelete(customer)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-600">{customer.phone}</p>
              </div>
            </div>

            {customer.email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">{customer.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Custom Fields */}
          {Object.keys(customer.customFields).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="grid gap-3">
                {Object.entries(customer.customFields).map(([key, value]) => {
                  const field = fields.find(f => f.name === key)
                  return (
                    <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {field?.label?.charAt(0) || key.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{field?.label || key}</p>
                        <p className="text-gray-600">{value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium">Created</p>
                <p>{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium">Last Updated</p>
                <p>{new Date(customer.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 