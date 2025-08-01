'use client';

import { useState, useEffect } from 'react';

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function PWAStatus() {
  const [isPWA, setIsPWA] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkPWAStatus = () => {
      setIsPWA(window.matchMedia('(display-mode: standalone)').matches);
      setIsStandalone((window.navigator as NavigatorWithStandalone).standalone || window.matchMedia('(display-mode: standalone)').matches);
      setIsOnline(navigator.onLine);
    };

    checkPWAStatus();

    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  if (!isPWA && !isStandalone) return null;

  return (
    <div className="fixed top-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg z-40">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-white text-sm">
          {isStandalone ? 'PWA Mode' : 'Web App'}
        </span>
        {!isOnline && (
          <span className="text-red-400 text-xs">Offline</span>
        )}
      </div>
    </div>
  );
} 