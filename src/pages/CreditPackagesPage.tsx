import React, { useEffect, useState } from 'react';
import { getCreditPackages } from '../services/credits';
import CreditPackageCard from '../components/payment/CreditPackageCard';
import PaymentModal from '../components/payment/PaymentModal';
import { loadRazorpayScript, openRazorpayCheckout, createPaymentOrder } from '../services/payment/razorpay';
import { CreditPackage } from '../models/credits';

const CreditPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [selected, setSelected] = useState<CreditPackage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCreditPackages().then(setPackages).catch(() => setError('Failed to load packages.'));
  }, []);

  const handlePurchase = async (pkg: CreditPackage) => {
    setSelected(pkg);
    setModalOpen(true);
  };

  const handlePay = async (pkg: CreditPackage) => {
    setLoading(true);
    setError(null);
    try {
      await loadRazorpayScript();
      // TODO: Replace with your backend order creation
      const order = await createPaymentOrder(pkg.price * 100); // amount in paise
      openRazorpayCheckout({
        key: 'RAZORPAY_KEY_ID', // TODO: Replace with your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: 'Bhavisyaji',
        description: `Buy ${pkg.credits} credits`,
        order_id: order.id,
        handler: (response: any) => {
          // TODO: Verify payment and add credits
          setModalOpen(false);
        },
        prefill: {},
        theme: { color: '#7c3aed' },
      });
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
      />
    </div>
  );
};

export default CreditPackagesPage; 