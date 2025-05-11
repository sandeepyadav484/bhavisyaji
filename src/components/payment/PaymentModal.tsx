import React from 'react';
import { CreditPackage } from '../../models/credits';

interface PaymentModalProps {
  open: boolean;
  pkg: CreditPackage | null;
  onClose: () => void;
  onPay: (pkg: CreditPackage) => void;
  loading?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, pkg, onClose, onPay, loading }) => {
  if (!open || !pkg) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <div className="text-lg font-bold text-purple-800 mb-2">Buy {pkg.credits} Credits</div>
        <div className="text-2xl font-extrabold text-yellow-600 mb-2">₹{pkg.price}</div>
        {pkg.discount && (
          <div className="text-green-600 text-xs font-semibold mb-2">Save {pkg.discount}%</div>
        )}
        {pkg.description && (
          <div className="text-xs text-gray-500 mb-4">{pkg.description}</div>
        )}
        <button
          onClick={() => onPay(pkg)}
          disabled={loading}
          className="w-full px-4 py-2 rounded bg-gradient-to-br from-yellow-400 to-pink-500 text-white font-bold shadow hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay with Razorpay'}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal; 