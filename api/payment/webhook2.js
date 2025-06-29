const crypto = require('crypto');
const getRawBody = require('raw-body');
const { addCredits } = require('./addCredits');

// Disable body parsing for this API route (Vercel/Next.js style)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Verify Razorpay webhook signature
function verifyWebhookSignature(body, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the raw body for signature verification
    const rawBody = await getRawBody(req);
    const bodyString = rawBody.toString('utf8');
    const body = JSON.parse(bodyString);

    console.log('Webhook received:', bodyString);
    const razorpaySignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!razorpaySignature || !webhookSecret) {
      console.error('Missing signature or webhook secret', { razorpaySignature, webhookSecret });
      return res.status(400).json({ error: 'Missing signature or webhook secret' });
    }

    // Verify webhook signature using the raw body string
    const isValid = verifyWebhookSignature(
      bodyString,
      razorpaySignature,
      webhookSecret
    );

    if (!isValid) {
      console.error('Invalid signature', { signature: razorpaySignature, secret: webhookSecret });
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { payload } = body;
    // Log the full payload for debugging
    console.warn('Webhook payload:', JSON.stringify(payload, null, 2));

    // Try to handle multiple payment statuses
    const paymentEntity = payload && payload.payment && payload.payment.entity;
    const status = paymentEntity && paymentEntity.status;
    const validStatuses = ['authorized', 'captured', 'paid', 'successful'];

    if (paymentEntity && (status === 'captured' || status === 'paid')) {
      const { notes } = paymentEntity;
      const userId = notes.userId;
      const credits = parseInt(notes.credits);
      const paymentId = paymentEntity.id;

      if (!userId || !credits) {
        console.error('Missing user ID or credits', { userId, credits });
        return res.status(400).json({ error: 'Missing user ID or credits' });
      }

      // Idempotency: check if this paymentId has already been processed
      const admin = require('firebase-admin');
      const db = admin.firestore();
      const txRef = db.collection('creditTransactions');
      const existing = await txRef.where('paymentId', '==', paymentId).get();
      if (!existing.empty) {
        console.log('Payment already processed:', paymentId);
        return res.status(200).json({ success: true, message: 'Already processed' });
      }

      // Add credits to user's account
      await addCredits(userId, credits, 'purchase', {
        paymentId,
        orderId: paymentEntity.order_id,
      });

      console.log('Credits added successfully', { userId, credits });
      return res.status(200).json({ success: true });
    }

    console.warn('Unhandled webhook payload or status', JSON.stringify(payload, null, 2));
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};