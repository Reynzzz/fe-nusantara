import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getImageUrl, milestonesAPI } from '@/services/api';

export interface Milestone {
  id: number;
  year: string;
  title: string;
  description: string;
  achievements: string[];
  image: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface MilestoneState {
  items: Milestone[];
  loading: boolean;
  error: string | null;
}

const initialState: MilestoneState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMilestones = createAsyncThunk('milestones/fetchAll', async () => {
  const response = await milestonesAPI.getAll();
  return response.data;
});

export const createMilestone = createAsyncThunk('milestones/create', async (formData: FormData) => {
  const response = await milestonesAPI.create(formData);
  return response.data;
});

export const updateMilestone = createAsyncThunk(
  'milestones/update',
  async ({ id, formData }: { id: number; formData: FormData }) => {
    const response = await milestonesAPI.update(id, formData);
    return response.data;
  }
);

export const deleteMilestone = createAsyncThunk('milestones/delete', async (id: number) => {
  await milestonesAPI.delete(id);
  return id;
});

const milestoneSlice = createSlice({
  name: 'milestones',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMilestones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilestones.fulfilled, (state, action: PayloadAction<Milestone[]>) => {
        state.loading = false;
        state.items = action.payload.map((item) => ({
          ...item,
          image: item.image ? getImageUrl(item.image) : null,
        }));
      })
      .addCase(fetchMilestones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch milestones';
      })
      .addCase(createMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMilestone.fulfilled, (state, action) => {
        state.loading = false;
        const item = action.payload;
        state.items.unshift({
          ...item,
          image: item.image ? getImageUrl(item.image) : null,
        });
      })
      .addCase(createMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create milestone';
      })
      .addCase(updateMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMilestone.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((item) => item.id === action.payload.id);
        if (idx !== -1) {
          const item = action.payload;
          state.items[idx] = {
            ...item,
            image: item.image ? getImageUrl(item.image) : null,
          };
        }
      })
      .addCase(updateMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update milestone';
      })
      .addCase(deleteMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMilestone.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete milestone';
      });
  },
});

export default milestoneSlice.reducer;


