import { configureStore } from '@reduxjs/toolkit';
import businessReducer from './slices/businessSlice';
import taxReducer from './slices/taxSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    business: businessReducer,
    tax: taxReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 