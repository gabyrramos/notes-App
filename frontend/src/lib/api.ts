export interface ICategory {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface INote {
  id: number;
  title: string;
  content: string;
  isArchived: boolean;
  categoryId: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface INoteWithCategory extends Omit<INote, 'categoryId'> {
  category: ICategory | null;
}

export type INoteInput = Omit<INote, 'id' | 'createdAt' | 'updatedAt'>;

export type ICategoryInput = Omit<ICategory, 'id' | 'createdAt' | 'updatedAt'>;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.error('NEXT_PUBLIC_API_BASE_URL is not defined. Please set it in your .env.local file.');
}

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  if (!API_BASE_URL) throw new Error("API Base URL not configured.");

  const fullUrl = `${API_BASE_URL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorText;
      } catch (parseError) {
        errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null as T;
    }

    const data: T = await response.json();
    return data;
  } catch (error: any) {
    console.error("API Call Error:", error.message || error);
    throw error;
  }
}

export const fetchNotes = async (
  filters?: { isArchived?: boolean; categoryId?: number | string | null }
): Promise<INoteWithCategory[]> => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.isArchived !== undefined) {
      params.append('isArchived', String(filters.isArchived));
    }
    if (filters.categoryId !== undefined && filters.categoryId !== null) {
      params.append('categoryId', String(filters.categoryId));
    }
  }
  const queryString = params.toString();
  return apiFetch<INoteWithCategory[]>(`/api/notes${queryString ? `?${queryString}` : ''}`);
};

export const createNote = async (noteData: INoteInput): Promise<INoteWithCategory> => {
  return apiFetch<INoteWithCategory>(`/api/notes`, {
    method: 'POST',
    body: JSON.stringify(noteData),
  });
};

export const updateNote = async (noteId: number, noteData: Partial<INoteInput>): Promise<INoteWithCategory> => {
  return apiFetch<INoteWithCategory>(`/api/notes/${noteId}`, {
    method: 'PUT',
    body: JSON.stringify(noteData),
  });
};

export const deleteNote = async (noteId: number): Promise<void> => {
  return apiFetch<void>(`/api/notes/${noteId}`, {
    method: 'DELETE',
  });
};

export const toggleArchiveNote = async (noteId: number, isArchived: boolean): Promise<INoteWithCategory> => {
  return apiFetch<INoteWithCategory>(`/api/notes/${noteId}/archive`, {
    method: 'PATCH',
    body: JSON.stringify({ isArchived }),
  });
};

export const fetchCategories = async (): Promise<ICategory[]> => {
  return apiFetch<ICategory[]>(`/api/categories`);
};

export const createCategory = async (categoryData: ICategoryInput): Promise<ICategory> => {
  return apiFetch<ICategory>(`/api/categories`, {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  return apiFetch<void>(`/api/categories/${categoryId}`, {
    method: 'DELETE',
  });
};

export const assignCategoryToNote = async (noteId: number, categoryId: number | null): Promise<INoteWithCategory> => {
  return updateNote(noteId, { categoryId: categoryId });
};