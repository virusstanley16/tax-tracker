import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Business } from '../../types/business';

interface BusinessState {
  businesses: Business[];
  currentBusiness: Business | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  businesses: [],
  currentBusiness: null,
  loading: false,
  error: null,
};

export const registerBusiness = createAsyncThunk(
  'business/register',
  async (businessData: Omit<Business, '_id'>) => {
    const response = await axios.post('http://localhost:5000/api/business/register', businessData);
    return response.data;
  }
);

export const fetchBusinesses = createAsyncThunk(
  'business/fetchAll',
  async () => {
    const response = await axios.get('http://localhost:5000/api/business');
    return response.data;
  }
);

export const fetchBusinessById = createAsyncThunk(
  'business/fetchById',
  async (id: string) => {
    const response = await axios.get(`http://localhost:5000/api/business/${id}`);
    return response.data;
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Business
      .addCase(registerBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses.push(action.payload);
      })
      .addCase(registerBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register business';
      })
      // Fetch All Businesses
      .addCase(fetchBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = action.payload;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch businesses';
      })
      // Fetch Business by ID
      .addCase(fetchBusinessById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBusiness = action.payload;
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch business';
      });
  },
});

export const { clearError } = businessSlice.actions;
export default businessSlice.reducer; 