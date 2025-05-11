import React from 'react';
import { CreditPackage } from '../../models/credits';

interface CreditPackageCardProps {
  pkg: CreditPackage;
  onPurchase: (pkg: CreditPackage) => void;
}

const CreditPackageCard: React.FC<CreditPackageCardProps> = ({ pkg, onPurchase }) => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2 border border-yellow-200">
    <div className="text-lg font-bold text-purple-800">{pkg.name}</div>
    <div className="text-2xl font-extrabold text-yellow-600">{pkg.credits} Credits</div>
    <div className="text-gray-600">₹{pkg.price}</div>
    {pkg.discount && (
      <div className="text-green-600 text-xs font-semibold">Save {pkg.discount}%</div>
    )}
    {pkg.description && (
      <div className="text-xs text-gray-500 text-center">{pkg.description}</div>
    )}
    <button
      onClick={() => onPurchase(pkg)}
      className="mt-2 px-4 py-2 rounded bg-gradient-to-br from-yellow-400 to-pink-500 text-white font-bold shadow hover:scale-105 transition-transform"
    >
      Buy Now
    </button>
  </div>
);

export default CreditPackageCard; 