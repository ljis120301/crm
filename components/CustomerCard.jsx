'use client'

import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

export default function CustomerCard({ 
  customer, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}) {
  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={() => onSelect(customer)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-600">{customer.phone}</p>
          {customer.email && (
            <p className="text-sm text-gray-600">{customer.email}</p>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(customer)
            }}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(customer)
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
} 