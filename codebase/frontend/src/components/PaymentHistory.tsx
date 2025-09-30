 
import React from 'react';
import type { Payment } from '../types';

interface PaymentHistoryProps {
  payments: Payment[];
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Payment History</h2>
        <div className="text-center text-gray-500 py-12">
          No payments yet. Make your first payment to see it here!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg">Payment Reference Number: {payment.id}</p>
                <p className="text-sm text-gray-600">Account Id: {payment.accountId}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(payment.date).toLocaleString('en-AU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">${payment.amount.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Card •••• {payment.last4}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  Completed
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};