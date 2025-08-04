'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Trash2 } from 'lucide-react'

export default function NotesSection({ 
  notes, 
  newNote, 
  onNewNoteChange, 
  onAddNote, 
  onDeleteNote 
}) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Notes
        </CardTitle>
        <CardDescription>
          Add and manage notes about this customer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note Form */}
        <div className="space-y-2">
          <Label htmlFor="newNote">Add Note</Label>
          <div className="flex gap-2">
            <Textarea
              id="newNote"
              placeholder="Enter a note about this customer..."
              value={newNote}
              onChange={(e) => onNewNoteChange(e.target.value)}
              className="flex-1"
              rows={3}
            />
            <Button 
              onClick={onAddNote}
              disabled={!newNote.trim()}
              className="self-end"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          <h4 className="font-medium">Recent Notes</h4>
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteNote(note)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No notes yet. Add your first note above.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 