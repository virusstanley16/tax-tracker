import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface FinancialReport {
  _id: string;
  business: string;
  year: number;
  quarter: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  taxAmount: number;
  taxStatus: 'pending' | 'paid' | 'overdue';
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface FinancialState {
  reports: FinancialReport[];
  loading: boolean;
  error: string | null;
}

const initialState: FinancialState = {
  reports: [],
  loading: false,
  error: null,
};

export const fetchBusinessReports = createAsyncThunk(
  'financial/fetchBusinessReports',
  async (businessId: string) => {
    const response = await axios.get(`http://localhost:5000/api/financial/business/${businessId}`);
    return response.data;
  }
);

export const submitFinancialReport = createAsyncThunk(
  'financial/submitReport',
  async (reportData: {
    business: string;
    year: number;
    quarter: number;
    revenue: number;
    expenses: number;
  }) => {
    const response = await axios.post('http://localhost:5000/api/financial/submit', reportData);
    return response.data;
  }
);

const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchBusinessReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reports';
      })
      .addCase(submitFinancialReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFinancialReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload);
      })
      .addCase(submitFinancialReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit report';
      });
  },
});

export const { clearError } = financialSlice.actions;
export default financialSlice.reducer; 