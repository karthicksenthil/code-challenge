 
import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import type { EnergyAccount, CreditCardDetails } from '../types';
import { apiService } from '../services/api.service';

interface PaymentModalProps {
  account: EnergyAccount;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ account, onClose, onSuccess }) => {
  const [cardDetails, setCardDetails] = useState<CreditCardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!cardDetails.cardholderName.trim()) {
      setError('Cardholder name is required');
      return false;
    }
    if (cardDetails.cardNumber.length < 13) {
      setError('Invalid card number');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      setError('Expiry date must be in MM/YY format');
      return false;
    }
    if (cardDetails.cvv.length !== 3) {
      setError('CVV must be 3 digits');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await apiService.processPayment({
        accountId: account.id,
        amount: account.balance,
        cardNumber: cardDetails.cardNumber,
        cardDetails
      });

      if (response.success) {
        setShowSuccess(true);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while processing your payment.');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    onSuccess();
    onClose();
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned;
  };

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your payment of ${account.balance.toFixed(2)} has been processed successfully.
          </p>
          <button
            onClick={handleClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Make a Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">{account.address}</p>
          <p className="text-lg font-bold text-red-600">Amount Due: ${account.balance.toFixed(2)}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cardholder Name</label>
            <input
              type="text"
              value={cardDetails.cardholderName}
              onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              maxLength={16}
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1234567890123456"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                maxLength={5}
                value={cardDetails.expiryDate}
                onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: formatExpiryDate(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YY"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="text"
                maxLength={3}
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg disabled:bg-gray-400 transition-colors"
          >
            {isProcessing ? 'Processing...' : `Pay $${account.balance.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};