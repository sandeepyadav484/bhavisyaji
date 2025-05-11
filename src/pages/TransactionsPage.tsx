import React, { useEffect, useState } from 'react';
import { getTransactionHistory } from '../services/credits';
import TransactionHistory from '../components/payment/TransactionHistory';
import { CreditTransaction } from '../models/credits';

const mockUserId = 'user-123'; // Replace with real user id from context/auth

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTransactionHistory(mockUserId)
      .then(setTransactions)
      .catch(() => setError('Failed to load transactions.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-purple-900">Transaction History</h1>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <TransactionHistory transactions={transactions} />
      )}
    </div>
  );
};

export default TransactionsPage; 