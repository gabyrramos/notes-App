import { GetServerSideProps } from 'next';
import { useState, useCallback } from 'react';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';
import { fetchNotes, fetchCategories, INoteWithCategory, ICategory } from '../lib/api';

interface HomeProps {
  initialNotes: INoteWithCategory[];
  initialCategories: ICategory[];
  serverError?: string;
}

export default function Home({ initialNotes, initialCategories, serverError }: HomeProps) {
  const [notes, setNotes] = useState<INoteWithCategory[]>(initialNotes);

  const refreshNotes = useCallback(async () => {
    try {
      const updatedNotes = await fetchNotes();
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error refreshing notes:", error);
    }
  }, []);

  if (serverError) {
    return <div className="text-red-500 text-center p-8">Server Error: {serverError}</div>;
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">📝 My Notes</h1>

      <NoteForm onNoteCreated={refreshNotes} />

      <h2 className="text-xl font-semibold mb-4 text-gray-800">Active Notes</h2>
      <div className="grid gap-4">
        {notes.filter(note => !note.isArchived).length === 0 ? (
          <p className="text-center text-gray-600">No active notes found. Create one!</p>
        ) : (
          notes
            .filter(note => !note.isArchived)
            .map((note) => (
            <NoteCard key={note.id} note={note} onNoteAction={refreshNotes} />
          ))
        )}
      </div>

      <h2 className="text-xl font-semibold my-4 text-gray-800">Archived Notes</h2>
      <div className="grid gap-4">
        {notes.filter(note => note.isArchived).length === 0 ? (
          <p className="text-center text-gray-600">No archived notes found.</p>
        ) : (
          notes
            .filter(note => note.isArchived)
            .map((note) => (
            <NoteCard key={note.id} note={note} onNoteAction={refreshNotes} />
          ))
        )}
      </div>
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