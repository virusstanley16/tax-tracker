import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Payment {
  _id: string;
  business: string;
  tax: string;
  amount: number;
  paymentDate: string;
  dueDate: string;
  status: string;
  paymentMethod: string;
  referenceNumber: string;
  latePaymentFee: number;
  notes?: string;
  period: {
    start: string;
    end: string;
  };
}

interface PaymentState {
  payments: Payment[];
  selectedPayment: Payment | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  selectedPayment: null,
  loading: false,
  error: null,
};

export const fetchPayments = createAsyncThunk(
  'payment/fetchPayments',
  async () => {
    const response = await axios.get('/api/payments');
    return response.data;
  }
);

export const createPayment = createAsyncThunk(
  'payment/createPayment',
  async (paymentData: Omit<Payment, '_id'>) => {
    const response = await axios.post('/api/payments', paymentData);
    return response.data;
  }
);

export const updatePayment = createAsyncThunk(
  'payment/updatePayment',
  async ({ id, data }: { id: string; data: Partial<Payment> }) => {
    const response = await axios.put(`/api/payments/${id}`, data);
    return response.data;
  }
);

export const deletePayment = createAsyncThunk(
  'payment/deletePayment',
  async (id: string) => {
    await axios.delete(`/api/payments/${id}`);
    return id;
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setSelectedPayment: (state, action) => {
      state.selectedPayment = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch payments';
      })
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create payment';
      })
      // Update payment
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update payment';
      })
      // Delete payment
      .addCase(deletePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = state.payments.filter(p => p._id !== action.payload);
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete payment';
      });
  },
});

export const { setSelectedPayment, clearError } = paymentSlice.actions;
export default paymentSlice.reducer; 