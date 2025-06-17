import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Business {
  _id: string;
  name: string;
  registrationNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  businessType: string;
  taxCategory: string;
  status: string;
  registrationDate: string;
}

interface BusinessState {
  businesses: Business[];
  selectedBusiness: Business | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  businesses: [],
  selectedBusiness: null,
  loading: false,
  error: null,
};

export const fetchBusinesses = createAsyncThunk(
  'business/fetchBusinesses',
  async () => {
    const response = await axios.get('/api/businesses');
    return response.data;
  }
);

export const createBusiness = createAsyncThunk(
  'business/createBusiness',
  async (businessData: Omit<Business, '_id'>) => {
    const response = await axios.post('/api/businesses', businessData);
    return response.data;
  }
);

export const updateBusiness = createAsyncThunk(
  'business/updateBusiness',
  async ({ id, data }: { id: string; data: Partial<Business> }) => {
    const response = await axios.put(`/api/businesses/${id}`, data);
    return response.data;
  }
);

export const deleteBusiness = createAsyncThunk(
  'business/deleteBusiness',
  async (id: string) => {
    await axios.delete(`/api/businesses/${id}`);
    return id;
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setSelectedBusiness: (state, action) => {
      state.selectedBusiness = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch businesses
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
      // Create business
      .addCase(createBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses.push(action.payload);
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create business';
      })
      // Update business
      .addCase(updateBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.businesses.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update business';
      })
      // Delete business
      .addCase(deleteBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = state.businesses.filter(b => b._id !== action.payload);
      })
      .addCase(deleteBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete business';
      });
  },
});

export const { setSelectedBusiness, clearError } = businessSlice.actions;
export default businessSlice.reducer; 