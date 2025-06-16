import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

interface FinancialReport {
  _id: string;
  business: string;
  year: number;
  quarter: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  taxAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  taxStatus: 'pending' | 'paid' | 'overdue';
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface FinancialState {
  reports: FinancialReport[];
  loading: boolean;
  error: string | null;
  currentReport: FinancialReport | null;
}

const initialState: FinancialState = {
  reports: [],
  loading: false,
  error: null,
  currentReport: null,
};

// Async thunks
export const submitFinancialReport = createAsyncThunk(
  'financial/submitReport',
  async (reportData: Partial<FinancialReport>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/financial/submit', reportData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Error submitting report');
    }
  }
);

export const fetchFinancialReports = createAsyncThunk(
  'financial/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/financial');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Error fetching reports');
    }
  }
);

export const fetchBusinessReports = createAsyncThunk(
  'financial/fetchBusinessReports',
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/financial/business/${businessId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Error fetching business reports');
    }
  }
);

export const updateReportStatus = createAsyncThunk(
  'financial/updateStatus',
  async ({ reportId, status }: { reportId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/financial/${reportId}/status`, { status });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Error updating report status');
    }
  }
);

export const updateTaxStatus = createAsyncThunk(
  'financial/updateTaxStatus',
  async ({ reportId, taxStatus }: { reportId: string; taxStatus: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/financial/${reportId}/tax-status`, { taxStatus });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Error updating tax status');
    }
  }
);

const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentReport: (state, action) => {
      state.currentReport = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Report
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
        state.error = action.payload as string;
      })
      // Fetch Reports
      .addCase(fetchFinancialReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancialReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchFinancialReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Business Reports
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
        state.error = action.payload as string;
      })
      // Update Report Status
      .addCase(updateReportStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex(report => report._id === action.payload._id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      .addCase(updateReportStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Tax Status
      .addCase(updateTaxStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaxStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex(report => report._id === action.payload._id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      .addCase(updateTaxStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentReport } = financialSlice.actions;

// Selectors
export const selectFinancialReports = (state: RootState) => state.financial.reports;
export const selectFinancialLoading = (state: RootState) => state.financial.loading;
export const selectFinancialError = (state: RootState) => state.financial.error;
export const selectCurrentReport = (state: RootState) => state.financial.currentReport;

export default financialSlice.reducer; 