const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)),
  });
}

const db = admin.firestore();
db.settings({ databaseId: 'prod' });

const CREDITS_COLLECTION = 'userCredits';
const TRANSACTIONS_COLLECTION = 'creditTransactions';

async function addCredits(userId, amount, description, meta = {}) {
  // Idempotency check: if meta.paymentId is provided, ensure we haven't already credited for this payment
  if (meta.paymentId) {
    const txRef = db.collection(TRANSACTIONS_COLLECTION);
    const existing = await txRef.where('paymentId', '==', meta.paymentId).get();
    if (!existing.empty) {
      console.log('Idempotency: Payment already processed in addCredits:', meta.paymentId);
      return;
    }
  }

  const ref = db.collection(CREDITS_COLLECTION).doc(userId);
  const txRef = db.collection(TRANSACTIONS_COLLECTION);
  await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(ref);
    let balance = snap.exists ? snap.data().balance : 0;
    balance += amount;
    transaction.set(ref, { balance }, { merge: true });
    const tx = {
      userId,
      type: 'purchase',
      amount,
      balance,
      timestamp: Date.now(),
      description,
      ...meta,
    };
    await txRef.add(tx);
  });
}

module.exports = { addCredits };