import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { membersAPI, getImageUrl } from '../../services/api';

export interface Member {
  id: number;
  name: string;
  photo: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface MemberState {
  members: Member[];
  loading: boolean;
  error: string | null;
}

const initialState: MemberState = {
  members: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchMembers = createAsyncThunk('members/fetchAll', async () => {
  const response = await membersAPI.getAll();
  return response.data;
});

export const fetchMemberById = createAsyncThunk('members/fetchById', async (id: number) => {
  const response = await membersAPI.getById(id);
  return response.data;
});

export const createMember = createAsyncThunk('members/create', async (formData: FormData) => {
  const response = await membersAPI.create(formData);
  return response.data;
});

export const updateMember = createAsyncThunk(
  'members/update',
  async ({ id, formData }: { id: number; formData: FormData }) => {
    const response = await membersAPI.update(id, formData);
    return response.data;
  }
);

export const deleteMember = createAsyncThunk('members/delete', async (id: number) => {
  await membersAPI.delete(id);
  return id;
});

const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.map((item: Member) => ({
          ...item,
          photo: item.photo ? getImageUrl(item.photo) : null,
        }));
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch members';
      })
      // Create
      .addCase(createMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.loading = false;
        const newMember = {
          ...action.payload,
          photo: action.payload.photo ? getImageUrl(action.payload.photo) : null,
        };
        state.members.unshift(newMember);
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create member';
      })
      // Update
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.members.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.members[index] = {
            ...action.payload,
            photo: action.payload.photo ? getImageUrl(action.payload.photo) : null,
          };
        }
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update member';
      })
      // Delete
      .addCase(deleteMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members = state.members.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete member';
      });
  },
});

export default memberSlice.reducer;
