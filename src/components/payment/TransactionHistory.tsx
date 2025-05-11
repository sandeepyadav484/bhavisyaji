import React from 'react';
import { CreditTransaction } from '../../models/credits';

interface TransactionHistoryProps {
  transactions: CreditTransaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => (
  <div className="bg-white rounded-xl shadow p-4 mt-4">
    <div className="font-bold text-lg mb-2 text-purple-800">Transaction History</div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="py-2 pr-4">Date</th>
            <th className="py-2 pr-4">Type</th>
            <th className="py-2 pr-4">Amount</th>
            <th className="py-2 pr-4">Balance</th>
            <th className="py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b last:border-0">
              <td className="py-2 pr-4">{new Date(tx.timestamp).toLocaleString()}</td>
              <td className="py-2 pr-4 capitalize">{tx.type}</td>
              <td className="py-2 pr-4">{tx.amount > 0 ? '+' : ''}{tx.amount}</td>
              <td className="py-2 pr-4">{tx.balance}</td>
              <td className="py-2">{tx.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TransactionHistory; 