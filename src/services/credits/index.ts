import { db } from '../../config/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, runTransaction, query, orderBy } from 'firebase/firestore';
import { CreditTransaction, CreditTransactionType, CreditPackage } from '../../models/credits';

const CREDITS_COLLECTION = 'userCredits';
const TRANSACTIONS_COLLECTION = 'creditTransactions';
const PACKAGES_COLLECTION = 'creditPackages';

export async function getCreditBalance(userId: string): Promise<number> {
  const ref = doc(db, CREDITS_COLLECTION, userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().balance : 0;
}

export async function deductCredits(userId: string, amount: number, description?: string): Promise<boolean> {
  const ref = doc(db, CREDITS_COLLECTION, userId);
  const txRef = collection(db, TRANSACTIONS_COLLECTION);
  return await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    let balance = snap.exists() ? snap.data().balance : 0;
    if (balance < amount) return false;
    balance -= amount;
    transaction.set(ref, { balance }, { merge: true });
    const tx: CreditTransaction = {
      id: '',
      userId,
      type: 'deduct',
      amount: -amount,
      balance,
      timestamp: Date.now(),
      description,
    };
    await addDoc(txRef, tx);
    return true;
  });
}

export async function addCredits(userId: string, amount: number, description?: string): Promise<void> {
  const ref = doc(db, CREDITS_COLLECTION, userId);
  const txRef = collection(db, TRANSACTIONS_COLLECTION);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    let balance = snap.exists() ? snap.data().balance : 0;
    balance += amount;
    transaction.set(ref, { balance }, { merge: true });
    const tx: CreditTransaction = {
      id: '',
      userId,
      type: 'purchase',
      amount,
      balance,
      timestamp: Date.now(),
      description,
    };
    await addDoc(txRef, tx);
  });
}

export async function getTransactionHistory(userId: string): Promise<CreditTransaction[]> {
  const txRef = collection(db, TRANSACTIONS_COLLECTION);
  const q = query(txRef, orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs
    .map((doc) => ({ ...doc.data(), id: doc.id } as CreditTransaction))
    .filter((tx) => tx.userId === userId);
}

export async function getCreditPackages(): Promise<CreditPackage[]> {
  const pkgRef = collection(db, PACKAGES_COLLECTION);
  const snap = await getDocs(pkgRef);
  return snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as CreditPackage));
} 