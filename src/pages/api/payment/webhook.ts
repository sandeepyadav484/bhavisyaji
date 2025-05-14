import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { addCredits } from '../../../services/firestore/credits';

// Verify Razorpay webhook signature
const verifyWebhookSignature = (
  body: string,
  signature: string,
  secret: string
): boolean => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Webhook received:', JSON.stringify(req.body));
    const razorpaySignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!razorpaySignature || !webhookSecret) {
      console.error('Missing signature or webhook secret', { razorpaySignature, webhookSecret });
      return res.status(400).json({ error: 'Missing signature or webhook secret' });
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(
      JSON.stringify(req.body),
      razorpaySignature as string,
      webhookSecret
    );

    if (!isValid) {
      console.error('Invalid signature', { signature: razorpaySignature, secret: webhookSecret });
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { payload } = req.body;

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
} 