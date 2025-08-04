'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  if (confirm('A new version of Nodara is available. Would you like to update?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });

          navigator.serviceWorker.addEventListener('controllerchange', () => {});
          navigator.serviceWorker.addEventListener('message', (event) => {});

        } catch (error) {
          console.error('SW registration failed:', error);
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', registerSW);
      } else {
        registerSW();
      }
    }
  }, []);

  return null;
} 