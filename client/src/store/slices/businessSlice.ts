import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Business {
  _id: string;
  name: string;
  type: string;
  registrationNumber: string;
  status: 'active' | 'suspended' | 'deactivated';
  ownerId: {
    _id: string;
    name: string;
    email: string;
  };
  taxStatus: 'paid' | 'pending' | 'overdue';
  lastTaxPaymentDate?: string;
  nextTaxDueDate?: string;
}

interface BusinessState {
  businesses: Business[];
  owners: Array<{ _id: string; name: string; email: string }>;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  businesses: [],
  owners: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchBusinesses = createAsyncThunk(
  'business/fetchBusinesses',
  async () => {
    const response = await axios.get('/api/business');
    return response.data;
  }
);

export const fetchBusinessOwners = createAsyncThunk(
  'business/fetchBusinessOwners',
  async () => {
    const response = await axios.get('/api/business/owners');
    return response.data;
  }
);

export const createBusiness = createAsyncThunk(
  'business/createBusiness',
  async (businessData: Partial<Business>) => {
    const response = await axios.post('/api/business', businessData);
    return response.data;
  }
);

export const updateBusinessStatus = createAsyncThunk(
  'business/updateStatus',
  async ({ id, status }: { id: string; status: Business['status'] }) => {
    const response = await axios.patch(`/api/business/${id}/status`, { status });
    return response.data;
  }
);

export const searchBusinesses = createAsyncThunk(
  'business/searchBusinesses',
  async (query: string) => {
    const response = await axios.get(`/api/business/search?query=${query}`);
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
      // Fetch business owners
      .addCase(fetchBusinessOwners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessOwners.fulfilled, (state, action) => {
        state.loading = false;
        state.owners = action.payload;
      })
      .addCase(fetchBusinessOwners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch business owners';
      })
      // Create business
      .addCase(createBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses.unshift(action.payload);
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create business';
      })
      // Update business status
      .addCase(updateBusinessStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusinessStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.businesses.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
      })
      .addCase(updateBusinessStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update business status';
      })
      // Search businesses
      .addCase(searchBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = action.payload;
      })
      .addCase(searchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search businesses';
      });
  },
});

export const { clearError } = businessSlice.actions;
export default businessSlice.reducer; 