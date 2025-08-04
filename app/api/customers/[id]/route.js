import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const customer = await prisma.customer.findUnique({
      where: { id }
    })
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    
    // Return customer with parsed customFields
    return NextResponse.json({
      ...customer,
      customFields: JSON.parse(customer.customFields)
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, phone, email, customFields } = body
    
    // Get existing customer data
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    })
    
    if (!existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    
    // Prepare update data with only provided fields
    const updateData = {}
    
    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (email !== undefined) updateData.email = email
    if (customFields !== undefined) updateData.customFields = JSON.stringify(customFields)
    
    const customer = await prisma.customer.update({
      where: { id },
      data: updateData
    })
    
    // Return customer with parsed customFields
    return NextResponse.json({
      ...customer,
      customFields: JSON.parse(customer.customFields)
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    await prisma.customer.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 