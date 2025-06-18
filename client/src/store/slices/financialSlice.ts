import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../store';

export interface FinancialReport {
  id: string;
  business: string;
  year: number;
  quarter: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  taxAmount: number;
  taxStatus: 'pending' | 'paid' | 'overdue';
  status: 'pending' | 'approved' | 'rejected';
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

// Async thunks
export const fetchBusinessReports = createAsyncThunk(
  'financial/fetchBusinessReports',
  async (businessId: string) => {
    const response = await axios.get(`/api/financial/business/${businessId}`);
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
    const response = await axios.post('/api/financial/submit', reportData);
    return response.data;
  }
);

export const updateReportStatus = createAsyncThunk(
  'financial/updateStatus',
  async ({ reportId, status }: { reportId: string; status: string }) => {
    const response = await axios.patch(`/api/financial/${reportId}/status`, { status });
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
      // Fetch reports
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
      // Submit report
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
      })
      // Update status
      .addCase(updateReportStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex(report => report.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      .addCase(updateReportStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update report status';
      });
  },
});

export const { clearError } = financialSlice.actions;

// Selectors
export const selectReports = (state: RootState) => state.financial.reports;
export const selectLoading = (state: RootState) => state.financial.loading;
export const selectError = (state: RootState) => state.financial.error;

export default financialSlice.reducer; 