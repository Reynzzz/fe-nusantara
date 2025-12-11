import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aboutAPI, getImageUrl } from '../../services/api';

export interface Value {
  icon: string;
  title: string;
  description: string;
}

export interface Management {
  position: string;
  name: string;
  photo_url?: string | null;
}

export interface AboutContent {
  id: number;
  hero_title: string;
  hero_tagline: string;
  history_title: string;
  history_text: string;
  history_image_url: string | null;
  vision_title: string;
  vision_text: string;
  mission_title: string;
  mission_text: string;
  values: Value[];
  management: Management[];
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AboutState {
  content: AboutContent | null;
  loading: boolean;
  error: string | null;
}

const initialState: AboutState = {
  content: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAbout = createAsyncThunk('about/fetch', async () => {
  const response = await aboutAPI.get();
  return response.data;
});

export const updateAbout = createAsyncThunk('about/update', async (formData: FormData) => {
  const response = await aboutAPI.update(formData);
  return response.data;
});

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        state.loading = false;
        state.content = {
          ...action.payload,
          history_image_url: action.payload.history_image_url
            ? getImageUrl(action.payload.history_image_url)
            : null,
          management: (action.payload.management || []).map((member: Management) => ({
            ...member,
            photo_url: member?.photo_url ? getImageUrl(member.photo_url) : null,
          })),
        };
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch about content';
      })
      // Update
      .addCase(updateAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAbout.fulfilled, (state, action) => {
        state.loading = false;
        state.content = {
          ...action.payload,
          history_image_url: action.payload.history_image_url
            ? getImageUrl(action.payload.history_image_url)
            : null,
          management: (action.payload.management || []).map((member: Management) => ({
            ...member,
            photo_url: member?.photo_url ? getImageUrl(member.photo_url) : null,
          })),
        };
      })
      .addCase(updateAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update about content';
      });
  },
});

export default aboutSlice.reducer;

