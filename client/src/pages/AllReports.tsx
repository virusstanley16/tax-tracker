import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';

interface Report {
  id: string;
  business: {
    name: string;
    ownerName: string;
  };
  year: number;
  quarter: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  taxAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const AllReports: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    quarter: 'all',
    status: 'all',
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/financial');
        setReports(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch reports');
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleStatusUpdate = async (reportId: string, newStatus: 'approved' | 'rejected') => {
    try {
      await axios.patch(`/api/financial/${reportId}/status`, {
        status: newStatus,
      });

      // Update local state
      setReports(reports.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      ));
    } catch (err) {
      setError('Failed to update report status');
      console.error('Error updating report status:', err);
    }
  };

  const filteredReports = reports.filter(report => {
    if (filters.year !== 'all' && report.year.toString() !== filters.year) return false;
    if (filters.quarter !== 'all' && report.quarter.toString() !== filters.quarter) return false;
    if (filters.status !== 'all' && report.status !== filters.status) return false;
    return true;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Reports</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Years</option>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quarter</label>
            <select
              value={filters.quarter}
              onChange={(e) => setFilters(prev => ({ ...prev, quarter: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Quarters</option>
              <option value="1">Q1</option>
              <option value="2">Q2</option>
              <option value="3">Q3</option>
              <option value="4">Q4</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Income</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.business.name}</div>
                    <div className="text-sm text-gray-500">{report.business.ownerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Q{report.quarter} {report.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${report.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${report.expenses.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${report.netIncome.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${report.taxAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'approved' ? 'bg-green-100 text-green-800' :
                      report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(report.id, 'approved')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(report.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllReports; 