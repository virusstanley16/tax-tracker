import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';

interface FinancialReport {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
}

const FinancialReports = () => {
  const [filter, setFilter] = useState('all');
  const [reports, setReports] = useState<FinancialReport[]>([]); // TODO: Fetch from API

  const filterOptions = [
    { value: 'all', label: 'All Reports' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter(report => report.status === filter);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Financial Reports</h1>
          <div className="flex items-center space-x-4">
            <Select
              options={filterOptions}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-48"
            />
            <Button onClick={() => window.location.href = '/submit-report'}>
              Submit New Report
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${report.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${report.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                      ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${report.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {/* TODO: Implement view details */}}
                    >
                      View Details
                    </Button>
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

export default FinancialReports; 