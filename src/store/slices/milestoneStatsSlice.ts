import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { milestoneStatsAPI } from '@/services/api';

export interface MilestoneStats {
  id: number;
  event_tahunan: string;
  perhargaan: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MilestoneStatsState {
  data: MilestoneStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: MilestoneStatsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchMilestoneStats = createAsyncThunk('milestoneStats/fetch', async () => {
  const response = await milestoneStatsAPI.get();
  return response.data;
});

export const updateMilestoneStats = createAsyncThunk(
  'milestoneStats/update',
  async (data: { event_tahunan: string; perhargaan: string }) => {
    const response = await milestoneStatsAPI.update(data);
    return response.data;
  }
);

const milestoneStatsSlice = createSlice({
  name: 'milestoneStats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMilestoneStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilestoneStats.fulfilled, (state, action: PayloadAction<MilestoneStats>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMilestoneStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch milestone stats';
      })
      .addCase(updateMilestoneStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMilestoneStats.fulfilled, (state, action: PayloadAction<MilestoneStats>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateMilestoneStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update milestone stats';
      });
  },
});

export default milestoneStatsSlice.reducer;

