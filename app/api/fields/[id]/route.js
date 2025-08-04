import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, label, type, required, options, order } = body
    
    if (!name || !label || !type) {
      return NextResponse.json(
        { error: 'Name, label, and type are required' },
        { status: 400 }
      )
    }
    
    // Check if field name already exists (excluding current field)
    const existingField = await prisma.fieldDefinition.findFirst({
      where: {
        name,
        id: { not: id }
      }
    })
    
    if (existingField) {
      return NextResponse.json(
        { error: 'Field name already exists' },
        { status: 400 }
      )
    }
    
    const field = await prisma.fieldDefinition.update({
      where: { id },
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
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    await prisma.fieldDefinition.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Field deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 