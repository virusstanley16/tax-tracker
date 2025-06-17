import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

interface Business {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  address: string;
  phone: string;
  businessType: string;
  status: 'active' | 'inactive' | 'suspended';
  registeredBy: {
    name: string;
    email: string;
  };
  registeredAt: string;
}

const Businesses: React.FC = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    businessType: 'all',
  });

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/business');
        setBusinesses(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch businesses');
        console.error('Error fetching businesses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const handleStatusUpdate = async (businessId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      await axios.patch(`/api/business/${businessId}/status`, {
        status: newStatus,
      });

      // Update local state
      setBusinesses(businesses.map(business => 
        business.id === businessId ? { ...business, status: newStatus } : business
      ));
    } catch (err) {
      setError('Failed to update business status');
      console.error('Error updating business status:', err);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    if (filters.status !== 'all' && business.status !== filters.status) return false;
    if (filters.businessType !== 'all' && business.businessType !== filters.businessType) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        business.name.toLowerCase().includes(searchLower) ||
        business.ownerName.toLowerCase().includes(searchLower) ||
        business.email.toLowerCase().includes(searchLower)
      );
    }
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
      <h1 className="text-3xl font-bold mb-8">Businesses</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search by name, owner, or email..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
            <select
              value={filters.businessType}
              onChange={(e) => setFilters(prev => ({ ...prev, businessType: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="retail">Retail</option>
              <option value="service">Service</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="technology">Technology</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Businesses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBusinesses.map((business) => (
                <tr key={business.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{business.name}</div>
                    <div className="text-sm text-gray-500">{business.ownerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{business.email}</div>
                    <div className="text-sm text-gray-500">{business.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {business.businessType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      business.status === 'active' ? 'bg-green-100 text-green-800' :
                      business.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {business.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{business.registeredBy.name}</div>
                    <div className="text-sm text-gray-500">{business.registeredBy.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      {business.status !== 'active' && (
                        <button
                          onClick={() => handleStatusUpdate(business.id, 'active')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Activate
                        </button>
                      )}
                      {business.status !== 'suspended' && (
                        <button
                          onClick={() => handleStatusUpdate(business.id, 'suspended')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Suspend
                        </button>
                      )}
                      {business.status !== 'inactive' && (
                        <button
                          onClick={() => handleStatusUpdate(business.id, 'inactive')}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
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

export default Businesses; 