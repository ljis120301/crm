import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    // Parse customFields JSON for each customer
    const customersWithParsedFields = customers.map(customer => ({
      ...customer,
      customFields: JSON.parse(customer.customFields || '{}')
    }))
    
    return NextResponse.json(customersWithParsedFields)
  } catch (error) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, phone, email, customFields } = body
    
    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }
    
    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        email,
        customFields: JSON.stringify(customFields || {})
      }
    })
    
    // Return customer with parsed customFields
    return NextResponse.json({
      ...customer,
      customFields: JSON.parse(customer.customFields)
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 