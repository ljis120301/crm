import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    
    await prisma.note.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Note deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
} 