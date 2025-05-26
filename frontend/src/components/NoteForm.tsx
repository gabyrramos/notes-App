// src/components/NoteForm.tsx
import React, { useState, useEffect } from 'react';
import { createNote, updateNote, fetchCategories, createCategory, INoteInput, ICategory, INoteWithCategory } from '../lib/api';

interface NoteFormProps {
  categories: ICategory[]; 
  onNoteCreated?: () => void; 
  noteToEdit?: INoteWithCategory; 
  onNoteUpdated?: () => void; 
  onCancel?: () => void; 
}

export default function NoteForm({
  categories: initialCategories, 
  onNoteCreated,
  noteToEdit,
  onNoteUpdated,
  onCancel,
}: NoteFormProps) {
  const [title, setTitle] = useState(noteToEdit?.title || '');
  const [content, setContent] = useState(noteToEdit?.content || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    noteToEdit?.category?.id || null
  );

  console.log("NoteForm received initialCategories:", initialCategories);
  const [isArchived, setIsArchived] = useState(noteToEdit?.isArchived || false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState<ICategory[]>(initialCategories); 
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);


  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setSelectedCategoryId(noteToEdit.category?.id || null);
      setIsArchived(noteToEdit.isArchived);
    } else {
      setTitle('');
      setContent('');
      setSelectedCategoryId(null);
      setIsArchived(false);
    }
    setNewCategoryName('');
    setShowNewCategoryInput(false);
  }, [noteToEdit]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const newCat = await createCategory({ name: newCategoryName.trim() });
      setCategories((prev) => [...prev, newCat]);
      setSelectedCategoryId(newCat.id); 
      setNewCategoryName('');
      setShowNewCategoryInput(false);
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Check console for details.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Title and Content cannot be empty.');
      return;
    }

    const noteData: INoteInput = {
      title,
      content,
      isArchived,
      categoryId: selectedCategoryId,
    };

    try {
      if (noteToEdit) {
        // --- EDIT  ---
        await updateNote(noteToEdit.id, noteData);
        alert('Note updated successfully!');
        if (onNoteUpdated) onNoteUpdated(); 
      } else {
        // --- CREATE  ---
        await createNote(noteData);
        alert('Note created successfully!');
        setTitle('');
        setContent('');
        setSelectedCategoryId(null);
        setIsArchived(false);
        if (onNoteCreated) onNoteCreated(); 
      }
    } catch (error) {
      console.error(noteToEdit ? "Error updating note:" : "Error creating note:", error);
      alert(noteToEdit ? "Failed to update note. Check console." : "Failed to create note. Check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg shadow-md mb-6">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
          Title:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Note title"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
          Content:
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
          placeholder="Note content"
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
          Category:
        </label>
        <select
          id="category"
          value={selectedCategoryId || ''}
          onChange={(e) => {
            if (e.target.value === 'create_new') {
              setShowNewCategoryInput(true);
              setSelectedCategoryId(null);
            } else {
              setShowNewCategoryInput(false);
              setSelectedCategoryId(e.target.value ? parseInt(e.target.value) : null);
            }
          }}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">-- Select Category (Optional) --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
          <option value="create_new">-- Create New Category --</option>
        </select>

        {showNewCategoryInput && (
          <div className="mt-2 flex items-center">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={handleCreateCategory}
              className="ml-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {noteToEdit && ( 
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isArchived"
            checked={isArchived}
            onChange={(e) => setIsArchived(e.target.checked)}
            className="mr-2 leading-tight"
          />
          <label htmlFor="isArchived" className="text-sm text-gray-700">
            Archive Note
          </label>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {noteToEdit ? 'Update Note' : 'Add Note'}
        </button>
        {noteToEdit && onCancel && ( 
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}