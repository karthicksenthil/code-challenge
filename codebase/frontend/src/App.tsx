 
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { type EnergyAccount, type Payment } from './types';
import { AccountCard } from './components/AccountCard';
import { PaymentModal } from './components/PaymentModal';
import { PaymentHistory } from './components/PaymentHistory';
import { apiService } from './services/api.service';

type ViewType = 'accounts' | 'history';
type EnergyFilterType = 'ALL' | 'ELECTRICITY' | 'GAS' ;

const App: React.FC = () => {
  const [accounts, setAccounts] = useState<EnergyAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<EnergyAccount[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<EnergyAccount | null>(null);
  const [energyFilter, setEnergyFilter] = useState<EnergyFilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('accounts');

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [accounts, energyFilter, searchQuery]);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentHistory = async () => {
    try {
      const history = await apiService.getPaymentHistory();
      setPayments(history);
    } catch (error) {
      console.error('Failed to load payment history:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...accounts];

    if (energyFilter !== 'ALL') {
      filtered = filtered.filter(a => a.type === energyFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.address.toLowerCase().includes(query) ||
        a.id.toLowerCase().includes(query)
      );
    }

    setFilteredAccounts(filtered);
  };

  const handlePaymentSuccess = () => {
    loadAccounts();
    loadPaymentHistory();
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    if (view === 'history') {
      loadPaymentHistory();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Energy Accounts</h1>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewChange('accounts')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'accounts' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Accounts
              </button>
              <button
                onClick={() => handleViewChange('history')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'history' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Payment History
              </button>
            </div>
          </div>

          {/* Filters - Only show on accounts view */}
          {currentView === 'accounts' && (
            <>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by address or account number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {(['ALL', 'ELECTRICITY', 'GAS' ] as EnergyFilterType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setEnergyFilter(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      energyFilter === type 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        {currentView === 'accounts' ? (
          <div>
            {filteredAccounts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No accounts found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              filteredAccounts.map(account => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onPayment={() => setSelectedAccount(account)}
                />
              ))
            )}
          </div>
        ) : (
          <PaymentHistory payments={payments} />
        )}
      </div>

      {/* Payment Modal */}
      {selectedAccount && (
        <PaymentModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default App;