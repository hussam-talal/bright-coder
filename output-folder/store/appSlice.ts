// store/appSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  classId: number | null;
  teacherId: string | null;
}

const initialState: AppState = {
  classId: null,
  teacherId: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setClassId: (state, action: PayloadAction<number>) => {
      state.classId = action.payload;
    },
    setTeacherId: (state, action: PayloadAction<string>) => {
      state.teacherId = action.payload;
    },
  },
});

export const { setClassId, setTeacherId } = appSlice.actions;
export default appSlice.reducer;
