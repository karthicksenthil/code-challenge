 
import React from 'react';
import { CreditCard, Zap, Flame } from 'lucide-react';
import { type EnergyAccount } from '../types';

interface AccountCardProps {
  account: EnergyAccount;
  onPayment: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onPayment }) => {
  const getBalanceColor = (balance: number): string => {
    if (balance > 0) return 'text-red-600';
    if (balance < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getEnergyIcon = () => {
    switch (account.type) {
      case 'ELECTRICITY':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'GAS':
        return <Flame className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-10 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-3">
          {getEnergyIcon()}
          <div>
            <h3 className="font-semibold text-lg">{account.id}</h3>
            <p className="text-sm text-gray-600">{account.type}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Balance</p>
          <p className={`text-2xl font-bold ${getBalanceColor(account.balance)}`}>
            ${Math.abs(account.balance).toFixed(2)}
          </p>
          {account.balance < 0 && <p className="text-xs text-green-600">Credit</p>}
          {account.balance > 0 && <p className="text-xs text-red-600">Due</p>}
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{account.address}</p>
      
      {account.balance > 0 && (
        <button
          onClick={onPayment}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          Make a Payment
        </button>
      )}
    </div>
  );
};