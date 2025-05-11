import React from 'react';
import { Link } from 'react-router-dom';
import CreditBalance from '../payment/CreditBalance';

const mockBalance = 10; // TODO: Replace with real balance from context/service

const Header: React.FC = () => (
  <header className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 shadow">
    <Link to="/" className="text-2xl font-bold text-yellow-300 tracking-wide">Bhavisyaji</Link>
    <div className="flex items-center gap-4">
      <CreditBalance balance={mockBalance} onTopUp={() => window.location.href = '/buy-credits'} />
      <Link to="/transactions" className="text-sm text-white hover:underline">Transactions</Link>
    </div>
  </header>
);

export default Header; 