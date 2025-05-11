// Razorpay integration service

export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('razorpay-script')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
}

export async function createPaymentOrder(amount: number): Promise<{ id: string; amount: number; currency: string }> {
  // TODO: Call your backend to create a Razorpay order and return order details
  throw new Error('createPaymentOrder not implemented');
}

export async function verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
  // TODO: Call your backend to verify payment
  throw new Error('verifyPayment not implemented');
}

export function openRazorpayCheckout(options: any) {
  // options: { key, amount, currency, name, description, order_id, handler, ... }
  // Handler will be called on payment success
  // Make sure to call loadRazorpayScript() before this
  if (!(window as any).Razorpay) {
    throw new Error('Razorpay script not loaded');
  }
  const rzp = new (window as any).Razorpay(options);
  rzp.open();
} 