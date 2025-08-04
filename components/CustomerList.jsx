'use client'

import CustomerCard from './CustomerCard'

export default function CustomerList({ 
  customers, 
  selectedCustomer, 
  searchTerm, 
  onCustomerSelect, 
  onCustomerEdit, 
  onCustomerDelete 
}) {
  // Filter customers based on search term
  const filteredCustomers = Array.isArray(customers) ? customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : []

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">
          Customers ({filteredCustomers.length})
        </h2>
        <div className="space-y-2">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              isSelected={selectedCustomer?.id === customer.id}
              onSelect={onCustomerSelect}
              onEdit={onCustomerEdit}
              onDelete={onCustomerDelete}
            />
          ))}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No customers found matching your search.' : 'No customers yet. Add your first customer!'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 