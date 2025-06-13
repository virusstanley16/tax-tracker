import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Tax {
  _id: string;
  name: string;
  description: string;
  rate: number;
  frequency: string;
  dueDate: number;
  category: string;
  minimumAmount: number;
  latePaymentPenalty: number;
  isActive: boolean;
}

interface TaxState {
  taxes: Tax[];
  selectedTax: Tax | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaxState = {
  taxes: [],
  selectedTax: null,
  loading: false,
  error: null,
};

export const fetchTaxes = createAsyncThunk(
  'tax/fetchTaxes',
  async () => {
    const response = await axios.get('/api/taxes');
    return response.data;
  }
);

export const createTax = createAsyncThunk(
  'tax/createTax',
  async (taxData: Omit<Tax, '_id'>) => {
    const response = await axios.post('/api/taxes', taxData);
    return response.data;
  }
);

export const updateTax = createAsyncThunk(
  'tax/updateTax',
  async ({ id, data }: { id: string; data: Partial<Tax> }) => {
    const response = await axios.put(`/api/taxes/${id}`, data);
    return response.data;
  }
);

export const deleteTax = createAsyncThunk(
  'tax/deleteTax',
  async (id: string) => {
    await axios.delete(`/api/taxes/${id}`);
    return id;
  }
);

const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {
    setSelectedTax: (state, action) => {
      state.selectedTax = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch taxes
      .addCase(fetchTaxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxes.fulfilled, (state, action) => {
        state.loading = false;
        state.taxes = action.payload;
      })
      .addCase(fetchTaxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch taxes';
      })
      // Create tax
      .addCase(createTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTax.fulfilled, (state, action) => {
        state.loading = false;
        state.taxes.push(action.payload);
      })
      .addCase(createTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create tax';
      })
      // Update tax
      .addCase(updateTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTax.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.taxes.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.taxes[index] = action.payload;
        }
      })
      .addCase(updateTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update tax';
      })
      // Delete tax
      .addCase(deleteTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTax.fulfilled, (state, action) => {
        state.loading = false;
        state.taxes = state.taxes.filter(t => t._id !== action.payload);
      })
      .addCase(deleteTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete tax';
      });
  },
});

export const { setSelectedTax, clearError } = taxSlice.actions;
export default taxSlice.reducer; 