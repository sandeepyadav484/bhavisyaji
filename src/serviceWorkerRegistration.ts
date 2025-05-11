export function register(config?: { onUpdate?: () => void; onSuccess?: () => void }) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL || ''}/service-worker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          if (registration.waiting) {
            config?.onUpdate?.();
          }
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New content is available
                    config?.onUpdate?.();
                  } else {
                    // Content cached for offline use
                    config?.onSuccess?.();
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
} 