import React, { useEffect, useState } from 'react';
import { getCreditPackages, getCreditBalance } from '../services/credits';
import CreditPackageCard from '../components/payment/CreditPackageCard';
import PaymentModal from '../components/payment/PaymentModal';
import { initiatePayment } from '../services/payment/razorpay';
import { CreditPackage } from '../models/credits';
import { useUser } from '../contexts/UserContext';

const CreditPackagesPage: React.FC = () => {
  const { user } = useUser();
  const userId = user?.uid || '';
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [selected, setSelected] = useState<CreditPackage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    getCreditPackages().then(setPackages).catch(() => setError('Failed to load packages.'));
    if (userId) {
      getCreditBalance(userId).then(setBalance);
    }
  }, [userId]);

  const handlePurchase = async (pkg: CreditPackage) => {
    setSelected(pkg);
    setModalOpen(true);
  };

  const handlePay = async (pkg: CreditPackage) => {
    setLoading(true);
    setError(null);
    try {
      await initiatePayment(pkg, userId);
      // Don't close modal, let polling handle it
    } catch (err: any) {
      setError(err.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-purple-900">Buy Credits</h1>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <CreditPackageCard key={pkg.id} pkg={pkg} onPurchase={handlePurchase} />
        ))}
      </div>
      <PaymentModal
        open={modalOpen}
        pkg={selected}
        onClose={() => setModalOpen(false)}
        onPay={handlePay}
        loading={loading}
        userId={userId}
        initialBalance={balance}
      />
    </div>
  );
};

export default CreditPackagesPage; 