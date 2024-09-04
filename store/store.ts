// store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import classReducer from './classSlice'; // Ensure the path is correct
import appReducer from './appSlice'; // Other reducers

export const store = configureStore({
  reducer: {
    class: classReducer, // Ensure this line is correct
    app: appReducer, // Other reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
