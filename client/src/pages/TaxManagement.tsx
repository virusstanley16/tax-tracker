import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

interface TaxSummary {
  totalTaxDue: number;
  paidAmount: number;
  pendingAmount: number;
  lastPaymentDate: string;
}

interface PaymentHistory {
  id: string;
  reportId: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

const TaxManagement: React.FC = () => {
  const { user } = useAuth();
  const [taxSummary, setTaxSummary] = useState<TaxSummary>({
    totalTaxDue: 0,
    paidAmount: 0,
    pendingAmount: 0,
    lastPaymentDate: '',
  });
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        setLoading(true);
        // Fetch financial reports for the business
        const response = await axios.get(`/api/financial/business/${user?.businessId}`);
        const reports = response.data;

        // Calculate tax summary
        const totalTaxDue = reports.reduce((sum: number, report: any) => sum + report.taxAmount, 0);
        const paidAmount = reports
          .filter((report: any) => report.taxStatus === 'paid')
          .reduce((sum: number, report: any) => sum + report.taxAmount, 0);
        const pendingAmount = totalTaxDue - paidAmount;

        // Get last payment date
        const lastPayment = reports
          .filter((report: any) => report.taxStatus === 'paid')
          .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

        setTaxSummary({
          totalTaxDue,
          paidAmount,
          pendingAmount,
          lastPaymentDate: lastPayment ? new Date(lastPayment.updatedAt).toLocaleDateString() : 'No payments yet',
        });

        // Transform reports into payment history
        const history = reports.map((report: any) => ({
          id: report._id,
          reportId: report._id,
          amount: report.taxAmount,
          date: new Date(report.updatedAt).toLocaleDateString(),
          status: report.taxStatus === 'paid' ? 'completed' : 'pending',
        }));

        setPaymentHistory(history);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tax data');
        console.error('Error fetching tax data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.businessId) {
      fetchTaxData();
    }
  }, [user?.businessId]);

  const handlePayment = async (reportId: string) => {
    try {
      // Update tax status to paid
      await axios.patch(`/api/financial/${reportId}/tax-status`, {
        taxStatus: 'paid',
      });

      // Refresh tax data
      const response = await axios.get(`/api/financial/business/${user?.businessId}`);
      const reports = response.data;

      // Update tax summary
      const totalTaxDue = reports.reduce((sum: number, report: any) => sum + report.taxAmount, 0);
      const paidAmount = reports
        .filter((report: any) => report.taxStatus === 'paid')
        .reduce((sum: number, report: any) => sum + report.taxAmount, 0);
      const pendingAmount = totalTaxDue - paidAmount;

      setTaxSummary(prev => ({
        ...prev,
        paidAmount,
        pendingAmount,
        lastPaymentDate: new Date().toLocaleDateString(),
      }));

      // Update payment history
      const history = reports.map((report: any) => ({
        id: report._id,
        reportId: report._id,
        amount: report.taxAmount,
        date: new Date(report.updatedAt).toLocaleDateString(),
        status: report.taxStatus === 'paid' ? 'completed' : 'pending',
      }));

      setPaymentHistory(history);
    } catch (err) {
      setError('Failed to process payment');
      console.error('Error processing payment:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tax Management</h1>

      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Tax Due</h3>
          <p className="text-3xl font-bold text-gray-800">${taxSummary.totalTaxDue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Paid Amount</h3>
          <p className="text-3xl font-bold text-green-600">${taxSummary.paidAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Pending Amount</h3>
          <p className="text-3xl font-bold text-red-600">${taxSummary.pendingAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.reportId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.status === 'pending' && (
                      <button
                        onClick={() => handlePayment(payment.reportId)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Pay Now
                      </button>
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

export default TaxManagement; 