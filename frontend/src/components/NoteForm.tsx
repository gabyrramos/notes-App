import { useState, useEffect } from 'react';
import { createNote, updateNote, createCategory, ICategory, INoteWithCategory } from '../lib/api';

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
  const [isArchived, setIsArchived] = useState(noteToEdit?.isArchived || false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState<ICategory[]>(initialCategories);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert('Title and description are required!');
      return;
    }

    try {
      let categoryIdToUse = selectedCategoryId;

      if (showNewCategoryInput && newCategoryName.trim() !== '') {
        const newCat = await createCategory({ name: newCategoryName.trim() });
        categoryIdToUse = newCat.id;
        setCategories([...categories, newCat]);
        setNewCategoryName('');
        setShowNewCategoryInput(false);
      } else if (selectedCategoryId === null) {
        categoryIdToUse = null;
      }

      const noteData = {
        title,
        content,
        categoryId: categoryIdToUse,
        isArchived,
      };

      if (noteToEdit) {
        await updateNote(noteToEdit.id, noteData);
        if (onNoteUpdated) onNoteUpdated();
        alert('Note updated successfully!');
      } else {
        await createNote(noteData);
        setTitle('');
        setContent('');
        setSelectedCategoryId(null);
        setIsArchived(false);
        if (onNoteCreated) onNoteCreated();
        alert('Note created successfully!');
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Check console for details.");
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'create_new') {
      setShowNewCategoryInput(true);
      setSelectedCategoryId(null);
    } else if (value === '') {
      setSelectedCategoryId(null);
      setShowNewCategoryInput(false);
    }
    else {
      setSelectedCategoryId(parseInt(value));
      setShowNewCategoryInput(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-xl mx-auto">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter note description..."
          rows={5}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          required
        ></textarea>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={selectedCategoryId !== null ? selectedCategoryId.toString() : ''}
          onChange={handleCategoryChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        >
          <option value="">-- Select Category (Optional) --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
          <option value="create_new">-- Create New Category --</option>
        </select>
      </div>

      {showNewCategoryInput && (
        <div className="mt-4">
          <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700">
            New Category Name
          </label>
          <input
            type="text"
            id="newCategory"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter new category name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isArchived"
          checked={isArchived}
          onChange={(e) => setIsArchived(e.target.checked)}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor="isArchived" className="ml-2 block text-sm text-gray-900">
          Archive Note
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {noteToEdit ? 'Update Note' : 'Create Note'}
        </button>
      </div>
    </form>
  );
}