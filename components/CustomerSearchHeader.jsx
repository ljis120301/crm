'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Settings, Plus, Search } from 'lucide-react'

export default function CustomerSearchHeader({ 
  searchTerm, 
  onSearchChange, 
  onManageFieldsOpen, 
  onAddCustomerOpen 
}) {
  return (
    <div className="p-4 border-b border-gray-200">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onManageFieldsOpen}>
          <Settings className="w-4 h-4 mr-2" />
          Fields
        </Button>

        <Button size="sm" onClick={onAddCustomerOpen}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>
    </div>
  )
} 