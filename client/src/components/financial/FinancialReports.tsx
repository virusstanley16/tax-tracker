import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinessReports } from '../../features/financial/financialSlice';
import type { RootState } from '../../store';
import type { AppDispatch } from '../../store';
import { useAuth } from '../../contexts/AuthContext';

const FinancialReports: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { reports, loading, error } = useSelector((state: RootState) => state.financial);

  useEffect(() => {
    if (user?.businessProfile) {
      dispatch(fetchBusinessReports(user.businessProfile));
    }
  }, [dispatch, user?.businessProfile]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!reports || reports.length === 0) {
    return <div>No financial reports found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Financial Reports</h1>
      <div className="grid gap-6">
        {reports.map((report) => (
          <div key={report._id} className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Year</p>
                <p className="font-semibold">{report.year}</p>
              </div>
              <div>
                <p className="text-gray-600">Quarter</p>
                <p className="font-semibold">{report.quarter}</p>
              </div>
              <div>
                <p className="text-gray-600">Revenue</p>
                <p className="font-semibold">${report.revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Expenses</p>
                <p className="font-semibold">${report.expenses.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Net Income</p>
                <p className="font-semibold">${report.netIncome.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Tax Amount</p>
                <p className="font-semibold">${report.taxAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold capitalize">{report.status}</p>
              </div>
              <div>
                <p className="text-gray-600">Tax Status</p>
                <p className="font-semibold capitalize">{report.taxStatus}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialReports; 