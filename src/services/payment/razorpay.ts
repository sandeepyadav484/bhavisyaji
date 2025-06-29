// Razorpay integration service

import { CreditPackage } from '../../models/credits';

// Initialize Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpay = (): Promise<void> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};

export const createOrder = async (pkg: CreditPackage, userId: string): Promise<string> => {
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: pkg.price * 100, // Convert to paise
        currency: 'INR',
        receipt: `order_${pkg.id}_${Date.now()}`,
        notes: {
          packageId: pkg.id,
          credits: pkg.credits,
          userId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    return data.orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const initiatePayment = async (pkg: CreditPackage, userId: string, userPhone?: string, userName?: string): Promise<void> => {
  try {
    await loadRazorpay();
    const orderId = await createOrder(pkg, userId);

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || '', // Set your Razorpay key here or via env
      amount: pkg.price * 100,
      currency: 'INR',
      name: 'Bhavishyaji',
      description: pkg.name,
      order_id: orderId,
      prefill: {
        name: userName || '',
        contact: userPhone || '',
      },
      notes: {
        userId,
        packageId: pkg.id,
        credits: pkg.credits,
      },
      theme: {
        color: '#F37254',
      },
      handler: function (response: any) {
        // Optionally, you can verify payment here or just rely on webhook
        // alert('Payment successful!');
      },
      modal: {
        ondismiss: function () {
          // Optionally handle modal close
        },
      },
    };
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw error;
  }
};

interface PaymentVerification {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  packageId: string;
}

export const verifyPayment = async (paymentData: PaymentVerification): Promise<void> => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Payment verification failed');
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}; 