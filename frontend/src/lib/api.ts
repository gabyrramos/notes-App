const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export interface INoteInput {
  title: string;
  content: string;
  isArchived: boolean;
  categoryId: number | null;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface INoteWithCategory extends INoteInput {
  id: number;
  category?: ICategory | null; 
  createdAt: string;
  updatedAt: string;
}


async function apiFetch<T>(
  url: string,
  options?: RequestInit,
  expectedStatus?: number 
): Promise<T> {
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
      if (expectedStatus && response.status === expectedStatus) {
        return {} as T; 
      }

      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      const isExpectedArray = Array.isArray(null as T); 
      return (isExpectedArray ? [] : {}) as T;
    }
    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}

// --- Notes API Functions ---

export const fetchNotes = async (filters?: { isArchived?: boolean | null, categoryId?: number | null }): Promise<INoteWithCategory[]> => {
  let queryString = '';
  const params = new URLSearchParams();

  if (filters?.isArchived !== undefined && filters.isArchived !== null) {
    params.append('archived', String(filters.isArchived));
  }
  if (filters?.categoryId !== undefined && filters.categoryId !== null) {
    params.append('categoryId', String(filters.categoryId));
  }

  if (params.toString()) {
    queryString = `?${params.toString()}`;
  }

  return apiFetch<INoteWithCategory[]>(`/notes${queryString}`);
};

export const createNote = async (note: INoteInput): Promise<INoteWithCategory> => {
  return apiFetch<INoteWithCategory>('/notes', {
    method: 'POST',
    body: JSON.stringify(note),
  });
};

export const deleteNote = async (id: number): Promise<void> => {
  return apiFetch<void>(`/notes/${id}`, { method: 'DELETE' }, 204); 
};

export const toggleArchiveNote = async (id: number): Promise<INoteWithCategory> => {
  return apiFetch<INoteWithCategory>(`/notes/${id}/toggle`, {
    method: 'PATCH', 
    body: JSON.stringify({}), 
  });
};

export const updateNote = async (id: number, data: Partial<INoteInput>): Promise<INoteWithCategory> => {
  return apiFetch<INoteWithCategory>(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// --- Category API Functions ---

export const fetchCategories = async (): Promise<ICategory[]> => {
  return apiFetch<ICategory[]>('/categories'); // Fetch all categories
};

export const createCategory = async (category: { name: string }): Promise<ICategory> => {
  return apiFetch<ICategory>('/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });
};

export const assignCategory = async (noteId: number, categoryId: number): Promise<any> => {
  return apiFetch<any>(`/notes/${noteId}/assign-category/${categoryId}`, {
    method: 'POST',
  });
};

export const unassignCategory = async (noteId: number, categoryId: number): Promise<any> => {
  return apiFetch<any>(`/notes/${noteId}/remove-category/${categoryId}`, {
    method: 'DELETE',
  });
};