const VAPID_PUBLIC_KEY = 'YOUR_PUBLIC_VAPID_KEY_HERE'; // <-- Replace with your real key

// Convert base64 public key to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array(Array.from({ length: rawData.length }, (_, i) => rawData.charCodeAt(i)));
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  return await Notification.requestPermission();
}

export async function subscribeUserToPush(): Promise<PushSubscription | null> {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      // TODO: Send subscription to your backend for storage
      return subscription;
    } catch (err) {
      console.error('Push subscription error:', err);
      return null;
    }
  }
  return null;
}

// For local testing: show a notification
export function showLocalNotification(title: string, options?: NotificationOptions) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, options);
    });
  }
} 