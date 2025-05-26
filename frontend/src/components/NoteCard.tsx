import { INoteWithCategory, deleteNote, toggleArchiveNote } from '../lib/api';

interface NoteCardProps {
  note: INoteWithCategory;
  onNoteAction: () => void;
  onEdit: (note: INoteWithCategory) => void;
}

export default function NoteCard({ note, onNoteAction, onEdit }: NoteCardProps) {
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
      try {
        await deleteNote(note.id);
        onNoteAction();
      } catch (error) {
        console.error("Error deleting note:", error);
        alert("Failed to delete note. Check console for details.");
      }
    }
  };

  const handleToggleArchive = async () => {
    try {
      await toggleArchiveNote(note.id);
      onNoteAction();
    } catch (error) {
      console.error("Error toggling archive status:", error);
      alert("Failed to toggle note status. Check console for details.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{note.title}</h3>
      {note.category && (
        <p className="text-sm text-gray-600 mb-3">
          Category: <span className="font-medium text-purple-700">{note.category.name}</span>
        </p>
      )}
      <p className="text-gray-700 mt-2 text-justify leading-relaxed">{note.content}</p>

      <div className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-200">
        <p>Created: {formatDate(note.createdAt)}</p>
        <p>Last Updated: {formatDate(note.updatedAt)}</p>
      </div>

      <div className="mt-5 flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold mr-3 ${ 
            note.isArchived ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
          }`}
        >
          {note.isArchived ? 'Archived' : 'Active'}
        </span>
        <div className="flex flex-wrap justify-end gap-2"> 
          <button
            onClick={() => onEdit(note)}
            className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors transform hover:scale-105 shadow-sm"
          >
            Edit
          </button>
          <button
            onClick={handleToggleArchive}
            className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors transform hover:scale-105 shadow-sm"
          >
            {note.isArchived ? 'Unarchive' : 'Archive'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors transform hover:scale-105 shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}