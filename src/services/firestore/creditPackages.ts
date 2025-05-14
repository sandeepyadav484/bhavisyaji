import { CreditPackage } from '../../models/credits';

export const creditPackages: CreditPackage[] = [
  {
    id: 'micro-pack',
    name: 'Micro Pack',
    price: 99,
    credits: 10,
    description: 'Perfect for trying out our services',
    paymentLink: 'https://rzp.io/rzp/lyrWd9VS'
  },
  {
    id: 'standard-pack',
    name: 'Standard Pack',
    price: 499,
    credits: 60,
    description: 'Most popular choice for regular users',
    paymentLink: 'https://rzp.io/rzp/5fNpWpos'
  },
  {
    id: 'value-pack',
    name: 'Value Pack',
    price: 999,
    credits: 150,
    description: 'Best value for frequent users',
    paymentLink: 'https://rzp.io/rzp/RGpR3z9z'
  }
];

export const getCreditPackages = async (): Promise<CreditPackage[]> => {
  // In the future, this could fetch from Firestore
  return creditPackages;
}; 