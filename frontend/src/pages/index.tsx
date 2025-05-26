// src/pages/index.tsx
import { GetServerSideProps } from 'next';
import { useState, useCallback, useEffect } from 'react'; 
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';
import { fetchNotes, fetchCategories, INoteWithCategory, ICategory } from '../lib/api';

interface HomeProps {
  initialNotes: INoteWithCategory[];
  initialCategories: ICategory[]; 
  serverError?: string;
}

type NoteFilter = 'active' | 'archived' | 'all';

export default function Home({ initialNotes, initialCategories, serverError }: HomeProps) {
  const [notes, setNotes] = useState<INoteWithCategory[]>(initialNotes);
  const [filter, setFilter] = useState<NoteFilter>('active'); 
  const [categories, setCategories] = useState<ICategory[]>(initialCategories); 

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<INoteWithCategory | null>(null);

  const refreshNotes = useCallback(async (currentFilter: NoteFilter = filter) => {
    try {
      let filters: { isArchived?: boolean } = {};
      if (currentFilter === 'active') {
        filters.isArchived = false;
      } else if (currentFilter === 'archived') {
        filters.isArchived = true;
      }
      const updatedNotes = await fetchNotes(filters); 
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error refreshing notes:", error);
      alert("Failed to fetch notes. Check console for details."); 
    }
  }, [filter]); 

  useEffect(() => {
    refreshNotes(filter); 
  }, [filter, refreshNotes]);


  const handleEdit = (note: INoteWithCategory) => {
    setNoteToEdit(note);
    setIsEditModalOpen(true);
  };


  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setNoteToEdit(null); 
  };

  
  const handleNoteUpdated = () => {
    handleCloseEditModal(); 
    refreshNotes(filter); 
  };

  if (serverError) {
    return <div className="text-red-500 text-center p-8">Server Error: {serverError}</div>;
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">📝 My Notes</h1>

      {/* Note Form  */}
      <NoteForm
        categories={categories} 
        onNoteCreated={() => refreshNotes('active')}
      /> 

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilter('active')}
          className={`py-2 px-4 rounded-md text-sm font-medium ${
            filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Show Active Notes
        </button>
        <button
          onClick={() => setFilter('archived')}
          className={`py-2 px-4 rounded-md text-sm font-medium ${
            filter === 'archived' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Show Archived Notes
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`py-2 px-4 rounded-md text-sm font-medium ${
            filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Show All Notes
        </button>
      </div>

      {/* To display notes based on filter */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {filter === 'active' && 'Active Notes'}
        {filter === 'archived' && 'Archived Notes'}
        {filter === 'all' && 'All Notes'}
        ({notes.length})
      </h2>
      <div className="grid gap-4">
        {notes.length === 0 ? (
          <p className="text-center text-gray-600">
            {filter === 'active' && 'No active notes found. Create one!'}
            {filter === 'archived' && 'No archived notes found.'}
            {filter === 'all' && 'No notes found. Create one!'}
          </p>
        ) : (
          notes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onNoteAction={() => refreshNotes(filter)} 
              onEdit={handleEdit} 
            />
          ))
        )}
      </div>

    
      {isEditModalOpen && noteToEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Edit Note</h2>
            <NoteForm
              noteToEdit={noteToEdit} 
              categories={categories} 
              onNoteUpdated={handleNoteUpdated} 
              onCancel={handleCloseEditModal} 
            />
          </div>
        </div>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const [notesData, categoriesData] = await Promise.all([
      fetchNotes(),
      fetchCategories()
    ]);

    return {
      props: {
        initialNotes: notesData,
        initialCategories: categoriesData,
      },
    };
  } catch (error: any) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        initialNotes: [],
        initialCategories: [], 
        serverError: error.message || "Failed to load initial data.",
      },
    };
  }
};