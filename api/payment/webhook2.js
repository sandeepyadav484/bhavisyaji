const crypto = require('crypto');
const getRawBody = require('raw-body');
const { addCredits } = require('../../bhavisyaji/src/services/firestore/credits');

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

    // Handle payment.authorized event
    if (payload && payload.payment && payload.payment.entity.status === 'authorized') {
      const { notes } = payload.payment.entity;
      const userId = notes.userId;
      const credits = parseInt(notes.credits);

      if (!userId || !credits) {
        console.error('Missing user ID or credits', { userId, credits });
        return res.status(400).json({ error: 'Missing user ID or credits' });
      }

      // Add credits to user's account
      await addCredits(userId, credits, 'purchase', {
        paymentId: payload.payment.entity.id,
        orderId: payload.payment.entity.order_id,
      });

      console.log('Credits added successfully', { userId, credits });
      return res.status(200).json({ success: true });
    }

    console.warn('Unhandled webhook payload or status', { payload });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};