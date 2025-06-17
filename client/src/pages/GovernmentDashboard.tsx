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

interface DashboardSummary {
  totalBusinesses: number;
  activeBusinesses: number;
  totalTaxCollected: number;
  pendingTaxAmount: number;
  recentReports: {
    year: number;
    quarter: number;
    totalRevenue: number;
    totalTax: number;
    businessCount: number;
  }[];
  businessTypes: {
    type: string;
    count: number;
  }[];
}

const GovernmentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary>({
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalTaxCollected: 0,
    pendingTaxAmount: 0,
    recentReports: [],
    businessTypes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [businessesResponse, reportsResponse] = await Promise.all([
          axios.get('/api/business'),
          axios.get('/api/financial'),
        ]);

        const businesses = businessesResponse.data;
        const reports = reportsResponse.data;

        // Calculate summary
        const totalBusinesses = businesses.length;
        const activeBusinesses = businesses.filter((b: any) => b.status === 'active').length;
        const totalTaxCollected = reports
          .filter((r: any) => r.taxStatus === 'paid')
          .reduce((sum: number, r: any) => sum + r.taxAmount, 0);
        const pendingTaxAmount = reports
          .filter((r: any) => r.taxStatus !== 'paid')
          .reduce((sum: number, r: any) => sum + r.taxAmount, 0);

        // Group reports by quarter
        const quarterlyData = reports.reduce((acc: any, report: any) => {
          const key = `${report.year}-Q${report.quarter}`;
          if (!acc[key]) {
            acc[key] = {
              year: report.year,
              quarter: report.quarter,
              totalRevenue: 0,
              totalTax: 0,
              businessCount: new Set(),
            };
          }
          acc[key].totalRevenue += report.revenue;
          acc[key].totalTax += report.taxAmount;
          acc[key].businessCount.add(report.business);
          return acc;
        }, {});

        // Convert to array and sort
        const recentReports = Object.values(quarterlyData)
          .map((data: any) => ({
            ...data,
            businessCount: data.businessCount.size,
          }))
          .sort((a: any, b: any) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.quarter - a.quarter;
          })
          .slice(0, 4);

        // Count business types
        const businessTypes = businesses.reduce((acc: any, business: any) => {
          const type = business.businessType;
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const businessTypesArray = Object.entries(businessTypes).map(([type, count]) => ({
          type,
          count,
        }));

        setSummary({
          totalBusinesses,
          activeBusinesses,
          totalTaxCollected,
          pendingTaxAmount,
          recentReports,
          businessTypes: businessTypesArray,
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  // Prepare chart data
  const revenueTaxData = {
    labels: summary.recentReports.map(report => `Q${report.quarter} ${report.year}`),
    datasets: [
      {
        label: 'Total Revenue',
        data: summary.recentReports.map(report => report.totalRevenue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Total Tax',
        data: summary.recentReports.map(report => report.totalTax),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const businessTypeData = {
    labels: summary.businessTypes.map(item => item.type),
    datasets: [
      {
        data: summary.businessTypes.map(item => item.count),
        backgroundColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(153, 102, 255)',
        ],
      },
    ],
  };

  const businessCountData = {
    labels: summary.recentReports.map(report => `Q${report.quarter} ${report.year}`),
    datasets: [
      {
        label: 'Active Businesses',
        data: summary.recentReports.map(report => report.businessCount),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Government Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Businesses</h3>
          <p className="text-3xl font-bold text-gray-800">{summary.totalBusinesses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Active Businesses</h3>
          <p className="text-3xl font-bold text-green-600">{summary.activeBusinesses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Tax Collected</h3>
          <p className="text-3xl font-bold text-gray-800">${summary.totalTaxCollected.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Pending Tax</h3>
          <p className="text-3xl font-bold text-red-600">${summary.pendingTaxAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue vs Tax Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Revenue vs Tax Collection</h3>
          <div className="h-80">
            <Line
              data={revenueTaxData}
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

        {/* Business Types Doughnut Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Business Types Distribution</h3>
          <div className="h-80">
            <Doughnut
              data={businessTypeData}
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

        {/* Active Businesses Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Active Businesses per Quarter</h3>
          <div className="h-80">
            <Bar
              data={businessCountData}
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

export default GovernmentDashboard; 