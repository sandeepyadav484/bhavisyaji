import React from 'react';

interface CreditBalanceProps {
  balance: number;
  onTopUp?: () => void;
}

const CreditBalance: React.FC<CreditBalanceProps> = ({ balance, onTopUp }) => (
  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full shadow text-yellow-800 font-semibold">
    <span>Credits: {balance}</span>
    {onTopUp && (
      <button
        onClick={onTopUp}
        className="ml-2 px-2 py-1 rounded bg-gradient-to-br from-yellow-400 to-pink-500 text-white text-xs font-bold shadow hover:scale-105 transition-transform"
      >
        Top Up
      </button>
    )}
  </div>
);

export default CreditBalance; 