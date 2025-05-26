// src/components/NoteForm.tsx
import { useState, useEffect } from 'react'; // Import useEffect
import { createNote, INoteInput, ICategory, fetchCategories, createCategory as apiCreateCategory } from '../lib/api';

interface NoteFormProps {
  onNoteCreated: () => void;
}

export default function NoteForm({ onNoteCreated }: NoteFormProps) {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState<boolean>(false); 
  const [newCategoryName, setNewCategoryName] = useState<string>(''); 


  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories for form:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []); 

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new-category') {
      setShowNewCategoryInput(true); 
      setSelectedCategoryId(''); 
    } else {
      setShowNewCategoryInput(false); 
      setSelectedCategoryId(value);
    }
  };

  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }
    try {
      const createdCategory = await apiCreateCategory({ name: newCategoryName });
      console.log('New category created:', createdCategory);
      setNewCategoryName('');
      setShowNewCategoryInput(false); 
      await loadCategories(); 
      setSelectedCategoryId(String(createdCategory.id));
    } catch (error) {
      console.error("Failed to create new category:", error);
      alert("Failed to create category. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const noteData: INoteInput = {
        title,
        content,
        isArchived: false,
        categoryId: selectedCategoryId ? parseInt(selectedCategoryId, 10) : null,
      };
      await createNote(noteData);
      setTitle('');
      setContent('');
      setSelectedCategoryId('');
      onNoteCreated(); 
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Note</h2>
      <input
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
      />

      {/* Category Selection Dropdown */}
      <select
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedCategoryId}
        onChange={handleCategoryChange} 
      >
        <option value="">-- Select Category (Optional) --</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
        <option value="new-category">-- Create New Category --</option> {/* New option */}
      </select>

      {/* Conditional New Category Input */}
      {showNewCategoryInput && (
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <button
            type="button" 
            onClick={handleCreateNewCategory}
            className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Create
          </button>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Add Note
      </button>
    </form>
  );
}