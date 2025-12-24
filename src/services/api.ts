const API_BASE_URL = import.meta.env.BASE_URL||'http://localhost:3000/api';




// Helper function untuk fetch API
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Events API
export const eventsAPI = {
  getAll: () => apiRequest('/events'),
  getById: (id: number) => apiRequest(`/events/${id}`),
  create: (formData: FormData) => {
    return fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  },
  update: (id: number, formData: FormData) => {
    return fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      body: formData,
    }).then(res => res.json());
  },
  delete: (id: number) => apiRequest(`/events/${id}`, { method: 'DELETE' }),
};

// News API
export const newsAPI = {
  getAll: () => apiRequest('/news'),
  getById: (id: number) => apiRequest(`/news/${id}`),
  create: (formData: FormData) => {
    return fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  },
  update: (id: number, formData: FormData) => {
    return fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'PUT',
      body: formData,
    }).then(res => res.json());
  },
  delete: (id: number) => apiRequest(`/news/${id}`, { method: 'DELETE' }),
};

// Products API
export const productsAPI = {
  getAll: (category?: string) => {
    const query = category ? `?category=${category}` : '';
    return apiRequest(`/products${query}`);
  },
  getById: (id: number) => apiRequest(`/products/${id}`),
  create: (formData: FormData) => {
    return fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  },
  update: (id: number, formData: FormData) => {
    return fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      body: formData,
    }).then(res => res.json());
  },
  delete: (id: number) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

// About API
export const aboutAPI = {
  get: () => apiRequest('/about'),
  update: (formData: FormData) => {
    return fetch(`${API_BASE_URL}/about`, {
      method: 'PUT',
      body: formData,
    }).then(res => res.json());
  },
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiRequest('/categories'),
  create: (name: string) => apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  }),
  update: (id: number, name: string) => apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  }),
  delete: (id: number) => apiRequest(`/categories/${id}`, { method: 'DELETE' }),
};

// Gallery API
export const galleryAPI = {
  getAll: () => apiRequest('/gallery'),
  getById: (id: number) => apiRequest(`/gallery/${id}`),
  create: (formData: FormData) => {
    return fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  },
  update: (id: number, formData: FormData) => {
    return fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      body: formData,
    }).then(res => res.json());
  },
  delete: (id: number) => apiRequest(`/gallery/${id}`, { method: 'DELETE' }),
};

// Milestones API
export const milestonesAPI = {
  getAll: () => apiRequest('/milestones'),
  getById: (id: number) => apiRequest(`/milestones/${id}`),
  create: (formData: FormData) => {
    return fetch(`${API_BASE_URL}/milestones`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  },
  update: (id: number, formData: FormData) => {
    return fetch(`${API_BASE_URL}/milestones/${id}`, {
      method: 'PUT',
      body: formData,
    }).then(res => res.json());
  },
  delete: (id: number) => apiRequest(`/milestones/${id}`, { method: 'DELETE' }),
};

// Home API
export const homeAPI = {
  get: () => apiRequest('/home'),
  update: (formData: FormData) => {
    return fetch(`${API_BASE_URL}/home`, {
      method: 'PUT',
      body: formData,
    }).then(res => res.json());
  },
};

// Helper untuk mendapatkan full image URL
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${baseUrl}${imagePath}`;
};

