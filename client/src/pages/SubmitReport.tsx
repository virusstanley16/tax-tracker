import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

interface ReportFormData {
  type: string;
  amount: string;
  date: string;
  description: string;
  attachments: File[];
}

const SubmitReport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ReportFormData>({
    type: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    attachments: [],
  });

  const reportTypes = [
    { value: 'income', label: 'Income Report' },
    { value: 'expense', label: 'Expense Report' },
    { value: 'tax', label: 'Tax Report' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement report submission logic
    navigate('/financial-reports');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        attachments: Array.from(e.target.files),
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Submit Financial Report</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="Report Type"
            options={reportTypes}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          />

          <Input
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            min="0"
            step="0.01"
            className='bg-black my-2'
          />

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className='bg-black my-2'
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-black"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              // className='bg-black my-2'
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload supporting documents (PDF, images, etc.)
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/financial-reports')}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Report</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport; 