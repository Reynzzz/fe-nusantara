import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { homeAPI, getImageUrl } from '../../services/api';

export interface HomeContent {
    id: number;
    hero_title: string;
    hero_tagline: string;
    bg_video: string | null;
    about_image: string | null;
    cta_image: string | null;
    createdAt?: string;
    updatedAt?: string;
}

interface HomeState {
    content: HomeContent | null;
    loading: boolean;
    error: string | null;
}

const initialState: HomeState = {
    content: null,
    loading: false,
    error: null,
};

// Async thunks
export const fetchHomeContent = createAsyncThunk('home/fetch', async () => {
    const response = await homeAPI.get();
    return response.data;
});

export const updateHomeContent = createAsyncThunk('home/update', async (formData: FormData) => {
    const response = await homeAPI.update(formData);
    return response.data;
});

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchHomeContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHomeContent.fulfilled, (state, action) => {
                state.loading = false;
                state.content = {
                    ...action.payload,
                    bg_video: action.payload.bg_video ? getImageUrl(action.payload.bg_video) : null,
                    about_image: action.payload.about_image ? getImageUrl(action.payload.about_image) : null,
                    cta_image: action.payload.cta_image ? getImageUrl(action.payload.cta_image) : null,
                };
            })
            .addCase(fetchHomeContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch home content';
            })
            // Update
            .addCase(updateHomeContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateHomeContent.fulfilled, (state, action) => {
                state.loading = false;
                state.content = {
                    ...action.payload,
                    bg_video: action.payload.bg_video ? getImageUrl(action.payload.bg_video) : null,
                    about_image: action.payload.about_image ? getImageUrl(action.payload.about_image) : null,
                    cta_image: action.payload.cta_image ? getImageUrl(action.payload.cta_image) : null,
                };
            })
            .addCase(updateHomeContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update home content';
            });
    },
});

export default homeSlice.reducer;
