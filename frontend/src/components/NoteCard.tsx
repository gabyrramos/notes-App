import { toggleArchiveNote, deleteNote, INoteWithCategory } from '../lib/api';

interface Props {
  note: INoteWithCategory;
  onNoteAction: () => void;
}

export default function NoteCard({ note, onNoteAction }: Props) {
  const handleArchive = async () => {
    try {
      await toggleArchiveNote(note.id, !note.isArchived);
      onNoteAction();
    } catch (error) {
      console.error("Failed to archive/unarchive note:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(note.id);
      onNoteAction();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded border-l-4 border-blue-500">
      <h2 className="text-lg font-semibold text-gray-700">{note.title}</h2>
      {note.category && (
        <p className="text-sm text-blue-600 mb-1">Category: {note.category.name}</p>
      )}
      <p className="text-gray-600 mb-2">{note.content}</p>
      <p className={`text-sm ${note.isArchived ? 'text-orange-500' : 'text-green-500'}`}>
        {note.isArchived ? 'Archived' : 'Active'}
      </p>
      <div className="flex gap-4 mt-2 text-sm">
        <button onClick={handleArchive} className="text-blue-600 hover:underline">
          {note.isArchived ? 'Unarchive' : 'Archive'}
        </button>
        <button onClick={handleDelete} className="text-red-600 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
}