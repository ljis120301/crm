import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const fields = await prisma.fieldDefinition.findMany({
      orderBy: { order: 'asc' }
    })
    
    // Parse options JSON for each field
    const fieldsWithParsedOptions = fields.map(field => ({
      ...field,
      options: field.options ? JSON.parse(field.options) : null
    }))
    
    return NextResponse.json(fieldsWithParsedOptions)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, label, type, required, options, order } = body
    
    if (!name || !label || !type) {
      return NextResponse.json(
        { error: 'Name, label, and type are required' },
        { status: 400 }
      )
    }
    
    // Check if field name already exists
    const existingField = await prisma.fieldDefinition.findUnique({
      where: { name }
    })
    
    if (existingField) {
      return NextResponse.json(
        { error: 'Field name already exists' },
        { status: 400 }
      )
    }
    
    const field = await prisma.fieldDefinition.create({
      data: {
        name,
        label,
        type,
        required: required || false,
        options: options ? JSON.stringify(options) : null,
        order: order || 0
      }
    })
    
    // Return field with parsed options
    return NextResponse.json({
      ...field,
      options: field.options ? JSON.parse(field.options) : null
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 