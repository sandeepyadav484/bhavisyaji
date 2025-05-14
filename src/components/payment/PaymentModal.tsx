import React, { useEffect, useRef, useState } from 'react';
import { CreditPackage } from '../../models/credits';
import { getCreditBalance } from '../../services/credits';

interface PaymentModalProps {
  open: boolean;
  pkg: CreditPackage | null;
  onClose: () => void;
  onPay: (pkg: CreditPackage) => void;
  loading?: boolean;
  userId: string;
  initialBalance: number;
}

const POLL_INTERVAL = 3000; // 3 seconds

const PaymentModal: React.FC<PaymentModalProps> = ({ open, pkg, onClose, onPay, loading, userId, initialBalance }) => {
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [newBalance, setNewBalance] = useState(initialBalance);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!open) {
      setPaymentInProgress(false);
      setPaymentSuccess(false);
      setNewBalance(initialBalance);
      if (pollRef.current) clearInterval(pollRef.current);
    }
  }, [open, initialBalance]);

  // Poll for balance after payment
  useEffect(() => {
    if (paymentInProgress && userId) {
      pollRef.current = setInterval(async () => {
        const balance = await getCreditBalance(userId);
        if (balance > initialBalance) {
          setPaymentInProgress(false);
          setPaymentSuccess(true);
          setNewBalance(balance);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }, POLL_INTERVAL);
      return () => {
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }
  }, [paymentInProgress, userId, initialBalance]);

  const handlePay = async () => {
    setPaymentInProgress(true);
    await onPay(pkg!);
    // Payment link opens in new tab, polling starts
  };

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
        {paymentSuccess ? (
          <div className="text-green-700 font-bold text-center my-4">
            Payment successful!<br />
            <span className="text-2xl">🎉</span><br />
            New Balance: <span className="text-yellow-600">{newBalance}</span> credits
          </div>
        ) : paymentInProgress ? (
          <div className="text-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
            Waiting for payment confirmation...<br />
            Please complete the payment in the new tab.
          </div>
        ) : (
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full px-4 py-2 rounded bg-gradient-to-br from-yellow-400 to-pink-500 text-white font-bold shadow hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentModal; 