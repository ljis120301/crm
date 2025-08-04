import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/notes - Get all notes for a customer
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }
    
    const notes = await prisma.note.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(notes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes', details: error.message }, { status: 500 })
  }
}

// POST /api/notes - Create a new note
export async function POST(request) {
  try {
    const { content, customerId } = await request.json()
    
    if (!content || !customerId) {
      return NextResponse.json({ error: 'Content and customer ID are required' }, { status: 400 })
    }
    
    const note = await prisma.note.create({
      data: {
        content,
        customerId
      }
    })
    
    return NextResponse.json(note)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note', details: error.message }, { status: 500 })
  }
} 