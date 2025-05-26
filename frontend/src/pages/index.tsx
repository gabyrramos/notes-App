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

  const [selectedFilterCategoryId, setSelectedFilterCategoryId] = useState<number | ''>('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<INoteWithCategory | null>(null);

  const refreshNotes = useCallback(async (
    currentFilter: NoteFilter = filter,
    currentCategoryId: number | '' = selectedFilterCategoryId
  ) => {
    try {
      let filters: { isArchived?: boolean; categoryId?: number } = {};
      if (currentFilter === 'active') {
        filters.isArchived = false;
      } else if (currentFilter === 'archived') {
        filters.isArchived = true;
      }

      if (currentCategoryId) {
        filters.categoryId = currentCategoryId;
      }
     
      const updatedNotes = await fetchNotes(filters); 
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error refreshing notes:", error);
      alert("Failed to fetch notes. Check console for details."); 
    }
  }, [filter, selectedFilterCategoryId]);

  useEffect(() => {
    refreshNotes(filter, selectedFilterCategoryId);
  }, [filter, selectedFilterCategoryId, refreshNotes]);

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
    refreshNotes(filter, selectedFilterCategoryId); 
  };

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedFilterCategoryId(value === '' ? '' : parseInt(value));
  };

  if (serverError) {
    return <div className="text-red-500 text-center p-8">Server Error: {serverError}</div>;
  }

  return (
    <main className="p-6 md:p-10 max-w-5xl mx-auto font-sans bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800 text-center">📝 My Personalized Notes</h1>

      <div className="mb-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-100"> 
        <NoteForm
          categories={categories}
          onNoteCreated={() => refreshNotes('active', '')}
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setFilter('active')}
          className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 shadow-md ${
            filter === 'active' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
          }`}
        >
          Show Active Notes
        </button>
        <button
          onClick={() => setFilter('archived')}
          className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 shadow-md ${
            filter === 'archived' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
          }`}
        >
          Show Archived Notes
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 shadow-md ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
          }`}
        >
          Show All Notes
        </button>
      </div>

      {/* Category Filter Dropdown */}
      <div className="flex justify-center items-center mb-10">
        <label htmlFor="categoryFilter" className="text-gray-700 text-base font-semibold mr-3">
          Filter by Category:
        </label>
        <select
          id="categoryFilter"
          value={selectedFilterCategoryId}
          onChange={handleCategoryFilterChange}
          className="shadow border border-gray-300 rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* To display notes based on filter */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        {filter === 'active' && 'Active Notes'}
        {filter === 'archived' && 'Archived Notes'}
        {filter === 'all' && 'All Notes'}
        ({notes.length})
      </h2>
 
      <div className="grid grid-cols-1 gap-6"> 
        {notes.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full py-10 text-lg">
            {filter === 'active' && 'No active notes found. Time to create one!'}
            {filter === 'archived' && 'No archived notes found. Go activate some!'}
            {filter === 'all' && 'No notes found. Get started now!'}
          </p>
        ) : (
          notes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onNoteAction={() => refreshNotes(filter, selectedFilterCategoryId)} 
              onEdit={handleEdit} 
            />
          ))
        )}
      </div>

      {/* Edit Note Modal */}
      {isEditModalOpen && noteToEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"> 
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