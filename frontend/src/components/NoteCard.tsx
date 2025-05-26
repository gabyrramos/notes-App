// src/components/NoteCard.tsx
import { INoteWithCategory } from '../lib/api'; 

interface NoteCardProps {
  note: INoteWithCategory;
  onNoteAction: () => void;
}

export default function NoteCard({ note, onNoteAction }: NoteCardProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(dateString));
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      // await deleteNote(note.id);
      // onNoteAction(); // Refresh notes after deletion
      alert("Delete functionality will be added next!"); // Placeholder for now
    }
  };

  const handleToggleArchive = async () => {
  
    // await toggleArchiveNote(note.id);
    // onNoteAction(); // Refresh notes after toggle
    alert("Archive/Unarchive functionality will be added next!"); // Placeholder for now
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
      <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
      {note.category && (
        <p className="text-sm text-gray-600">
          Category: <span className="font-medium text-blue-700">{note.category.name}</span>
        </p>
      )}
      <p className="text-gray-700 mt-2">{note.content}</p>

      <div className="text-xs text-gray-500 mt-2">
        <p>Created: {formatDate(note.createdAt)}</p>
        <p>Last Updated: {formatDate(note.updatedAt)}</p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            note.isArchived ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'
          }`}
        >
          {note.isArchived ? 'Archived' : 'Active'}
        </span>
        <div className="space-x-2">
         
          <button
            onClick={() => { /* Placeholder for Edit */ alert("Edit functionality coming soon!"); }}
            className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleToggleArchive} 
            className="px-3 py-1 bg-gray-500 text-white text-xs rounded-md hover:bg-gray-600 transition-colors"
          >
            {note.isArchived ? 'Unarchive' : 'Archive'}
          </button>
          <button
            onClick={handleDelete} 
            className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}