import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newsAPI, getImageUrl } from '../../services/api';

export interface News {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  external_link: string | null;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NewsState {
  news: News[];
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  news: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchNews = createAsyncThunk('news/fetchAll', async () => {
  const response = await newsAPI.getAll();
  return response.data;
});

export const fetchNewsById = createAsyncThunk('news/fetchById', async (id: number) => {
  const response = await newsAPI.getById(id);
  return response.data;
});

export const createNews = createAsyncThunk('news/create', async (formData: FormData) => {
  const response = await newsAPI.create(formData);
  return response.data;
});

export const updateNews = createAsyncThunk(
  'news/update',
  async ({ id, formData }: { id: number; formData: FormData }) => {
    const response = await newsAPI.update(id, formData);
    return response.data;
  }
);

export const deleteNews = createAsyncThunk('news/delete', async (id: number) => {
  await newsAPI.delete(id);
  return id;
});

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.map((item: News) => ({
          ...item,
          image: item.image ? getImageUrl(item.image) : null,
        }));
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch news';
      })
      // Create
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        const newNews = {
          ...action.payload,
          image: action.payload.image ? getImageUrl(action.payload.image) : null,
        };
        state.news.unshift(newNews);
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create news';
      })
      // Update
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.news.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.news[index] = {
            ...action.payload,
            image: action.payload.image ? getImageUrl(action.payload.image) : null,
          };
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update news';
      })
      // Delete
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = state.news.filter((n) => n.id !== action.payload);
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete news';
      });
  },
});

export default newsSlice.reducer;

