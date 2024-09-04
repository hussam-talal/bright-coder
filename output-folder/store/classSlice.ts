// slices/classSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchClassIdAndTeacherId } from '../lib/CRUD';

interface ClassState {
  classId: number | null;
  teacherId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ClassState = {
  classId: null,
  teacherId: null,
  status: 'idle',
  error: null,
};

export const fetchClassAndTeacher = createAsyncThunk(
  'class/fetchClassAndTeacher',
  async () => {
    const response = await fetchClassIdAndTeacherId();
    return response;
  }
);

const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassAndTeacher.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClassAndTeacher.fulfilled, (state, action: PayloadAction<{ classId: number; teacherId: string }>) => {
        state.status = 'succeeded';
        state.classId = action.payload.classId;
        state.teacherId = action.payload.teacherId;
      })
      .addCase(fetchClassAndTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch data';
      });
  },
});

export default classSlice.reducer;
