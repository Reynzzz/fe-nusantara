import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoriesAPI } from '../../services/api';

export interface Category {
    id: number;
    name: string;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
}

interface CategoriesState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoriesState = {
    categories: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
    const response = await categoriesAPI.getAll();
    return response.data;
});

export const createCategory = createAsyncThunk('categories/create', async (name: string) => {
    const response = await categoriesAPI.create(name);
    return response.data;
});

export const updateCategory = createAsyncThunk(
    'categories/update',
    async ({ id, name }: { id: number; name: string }) => {
        const response = await categoriesAPI.update(id, name);
        return response.data;
    }
);

export const deleteCategory = createAsyncThunk('categories/delete', async (id: number) => {
    await categoriesAPI.delete(id);
    return id;
});

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch categories';
            })
            // Create
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create category';
            })
            // Update
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update category';
            })
            // Delete
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter((c) => c.id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete category';
            });
    },
});

export default categoriesSlice.reducer;
