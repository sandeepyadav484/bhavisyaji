export type CreditTransactionType = 'purchase' | 'deduct' | 'refund';

export interface CreditTransaction {
  id: string;
  userId: string;
  type: CreditTransactionType;
  amount: number;
  balance: number;
  timestamp: number;
  description?: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  discount?: number; // percent
  description?: string;
} 