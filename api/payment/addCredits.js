const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

const CREDITS_COLLECTION = 'userCredits';
const TRANSACTIONS_COLLECTION = 'creditTransactions';

async function addCredits(userId, amount, reason, meta = {}) {
  const creditRef = db.collection('credits').doc(userId);
  const creditDoc = await creditRef.get();
  const now = Date.now();
  if (!creditDoc.exists) {
    await creditRef.set({
      balance: amount,
      lastTransaction: {
        amount,
        reason,
        meta,
        timestamp: now,
      },
    });
    return;
  }
  await creditRef.update({
    balance: admin.firestore.FieldValue.increment(amount),
    lastTransaction: {
      amount,
      reason,
      meta,
      timestamp: now,
    },
  });
}

module.exports = { addCredits };