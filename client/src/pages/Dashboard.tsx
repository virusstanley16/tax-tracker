import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Welcome, {user?.name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {user?.role === 'business' 
              ? 'Manage your financial reports and tax submissions here.'
              : 'Monitor and manage business tax submissions here.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 