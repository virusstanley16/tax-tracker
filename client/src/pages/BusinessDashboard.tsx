import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  totalTaxPaid: number;
  pendingTaxAmount: number;
  recentReports: {
    year: number;
    quarter: number;
    revenue: number;
    expenses: number;
    taxAmount: number;
  }[];
}

const BusinessDashboard: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary>({
    totalRevenue: 0,
    totalExpenses: 0,
    totalTaxPaid: 0,
    pendingTaxAmount: 0,
    recentReports: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.businessProfile?._id) {
        setError('Business profile not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/financial/business/${user.businessProfile._id}`);
        const reports = response.data;

        // Calculate summary
        const totalRevenue = reports.reduce((sum: number, report: any) => sum + report.revenue, 0);
        const totalExpenses = reports.reduce((sum: number, report: any) => sum + report.expenses, 0);
        const totalTaxPaid = reports
          .filter((report: any) => report.taxStatus === 'paid')
          .reduce((sum: number, report: any) => sum + report.taxAmount, 0);
        const pendingTaxAmount = reports
          .filter((report: any) => report.taxStatus !== 'paid')
          .reduce((sum: number, report: any) => sum + report.taxAmount, 0);

        // Get recent reports (last 4 quarters)
        const recentReports = reports
          .sort((a: any, b: any) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.quarter - a.quarter;
          })
          .slice(0, 4);

        setSummary({
          totalRevenue,
          totalExpenses,
          totalTaxPaid,
          pendingTaxAmount,
          recentReports,
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch financial data');
        console.error('Error fetching financial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.businessProfile?._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Prepare chart data
  const revenueExpenseData = {
    labels: summary.recentReports.map(report => `Q${report.quarter} ${report.year}`),
    datasets: [
      {
        label: 'Revenue',
        data: summary.recentReports.map(report => report.revenue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Expenses',
        data: summary.recentReports.map(report => report.expenses),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const taxData = {
    labels: ['Paid', 'Pending'],
    datasets: [
      {
        data: [summary.totalTaxPaid, summary.pendingTaxAmount],
        backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
      },
    ],
  };

  const quarterlyTaxData = {
    labels: summary.recentReports.map(report => `Q${report.quarter} ${report.year}`),
    datasets: [
      {
        label: 'Tax Amount',
        data: summary.recentReports.map(report => report.taxAmount),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Business Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800">${summary.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-gray-800">${summary.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Tax Paid</h3>
          <p className="text-3xl font-bold text-green-600">${summary.totalTaxPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Pending Tax</h3>
          <p className="text-3xl font-bold text-red-600">${summary.pendingTaxAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Revenue vs Expenses</h3>
          <div className="h-80">
            <Line
              data={revenueExpenseData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Tax Distribution Doughnut Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Tax Distribution</h3>
          <div className="h-80">
            <Doughnut
              data={taxData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Quarterly Tax Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Quarterly Tax Amount</h3>
          <div className="h-80">
            <Bar
              data={quarterlyTaxData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard; 