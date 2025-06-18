import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { submitFinancialReport } from '../store/slices/financialSlice';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

interface ReportFormData {
  year: string;
  quarter: string;
  revenue: string;
  expenses: string;
}

const SubmitReport = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ReportFormData>({
    year: new Date().getFullYear().toString(),
    quarter: '1',
    revenue: '',
    expenses: '',
  });

  const quarters = [
    { value: '1', label: 'Q1 (Jan - Mar)' },
    { value: '2', label: 'Q2 (Apr - Jun)' },
    { value: '3', label: 'Q3 (Jul - Sep)' },
    { value: '4', label: 'Q4 (Oct - Dec)' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user?.businessProfile?._id) {
        throw new Error('Business profile not found');
      }

      const reportData = {
        business: user.businessProfile._id,
        year: parseInt(formData.year),
        quarter: parseInt(formData.quarter),
        revenue: parseFloat(formData.revenue),
        expenses: parseFloat(formData.expenses),
      };

      await dispatch(submitFinancialReport(reportData)).unwrap();
      navigate('/financial-reports');
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Submit Financial Report</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <Select
                options={years}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
                className="bg-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quarter
              </label>
              <Select
                options={quarters}
                value={formData.quarter}
                onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                required
                className="bg-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Revenue
            </label>
            <Input
              type="number"
              value={formData.revenue}
              onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
              required
              min="0"
              step="0.01"
              placeholder="Enter total revenue"
              className="bg-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expenses
            </label>
            <Input
              type="number"
              value={formData.expenses}
              onChange={(e) => setFormData({ ...formData, expenses: e.target.value })}
              required
              min="0"
              step="0.01"
              placeholder="Enter total expenses"
              className="bg-black"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/financial-reports')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport; 