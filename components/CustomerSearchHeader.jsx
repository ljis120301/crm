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
    <div className="p-3 sm:p-4 border-b border-gray-200">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Customer Management</h1>
      
      {/* Search Bar */}
      <div className="relative mb-3 sm:mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={onManageFieldsOpen} className="flex-1 sm:flex-none">
          <Settings className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Fields</span>
          <span className="sm:hidden">Fields</span>
        </Button>

        <Button size="sm" onClick={onAddCustomerOpen} className="flex-1 sm:flex-none">
          <Plus className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Add Customer</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </div>
  )
} 