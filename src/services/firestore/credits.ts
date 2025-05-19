import { db } from './firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

const CREDITS_COLLECTION = 'credits';

export async function getCreditBalance(userId: string): Promise<number> {
  const creditDoc = await getDoc(doc(db, CREDITS_COLLECTION, userId));
  if (!creditDoc.exists()) {
    return 0;
  }
  return creditDoc.data().balance || 0;
}

export async function deductCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<boolean> {
  const creditRef = doc(db, CREDITS_COLLECTION, userId);
  const creditDoc = await getDoc(creditRef);

  if (!creditDoc.exists()) {
    return false;
  }

  const currentBalance = creditDoc.data().balance || 0;
  if (currentBalance < amount) {
    return false;
  }

  await updateDoc(creditRef, {
    balance: increment(-amount),
    lastTransaction: {
      amount: -amount,
      reason,
      timestamp: Date.now(),
    },
  });

  return true;
}

export async function addCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<void> {
  const creditRef = doc(db, CREDITS_COLLECTION, userId);
  const creditDoc = await getDoc(creditRef);

  if (!creditDoc.exists()) {
    // Create new credit document if it doesn't exist
    await updateDoc(creditRef, {
      balance: amount,
      lastTransaction: {
        amount,
        reason,
        timestamp: Date.now(),
      },
    });
    return;
  }

  await updateDoc(creditRef, {
    balance: increment(amount),
    lastTransaction: {
      amount,
      reason,
      timestamp: Date.now(),
    },
  });
} 