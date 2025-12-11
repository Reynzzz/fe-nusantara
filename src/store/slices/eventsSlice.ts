import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { eventsAPI, getImageUrl } from '../../services/api';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchEvents = createAsyncThunk('events/fetchAll', async () => {
  const response = await eventsAPI.getAll();
  return response.data;
});

export const fetchEventById = createAsyncThunk('events/fetchById', async (id: number) => {
  const response = await eventsAPI.getById(id);
  return response.data;
});

export const createEvent = createAsyncThunk('events/create', async (formData: FormData) => {
  const response = await eventsAPI.create(formData);
  return response.data;
});

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, formData }: { id: number; formData: FormData }) => {
    const response = await eventsAPI.update(id, formData);
    return response.data;
  }
);

export const deleteEvent = createAsyncThunk('events/delete', async (id: number) => {
  await eventsAPI.delete(id);
  return id;
});

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.map((event: Event) => ({
          ...event,
          image: event.image ? getImageUrl(event.image) : null,
        }));
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch events';
      })
      // Create
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        const newEvent = {
          ...action.payload,
          image: action.payload.image ? getImageUrl(action.payload.image) : null,
        };
        state.events.unshift(newEvent);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create event';
      })
      // Update
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = {
            ...action.payload,
            image: action.payload.image ? getImageUrl(action.payload.image) : null,
          };
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update event';
      })
      // Delete
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete event';
      });
  },
});

export default eventsSlice.reducer;

