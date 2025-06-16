import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice';
import financialReducer from './slices/financialSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    financial: financialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 