'use client';

import { useState, useEffect } from 'react';

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      if ((navigator as NavigatorWithStandalone).standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallPrompt(false);
      }
    } catch (error) {
      console.error('Install prompt error:', error);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  if (isInstalled || !showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-500 rounded-xl p-4 shadow-2xl z-50 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
                      <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/newlogo.jpeg" alt="Nodara" className="w-8 h-8 object-cover rounded" />
              </div>
            <div>
              <h3 className="text-white font-bold text-lg">Install Nodara</h3>
              <p className="text-blue-100 text-sm mt-1">
                Get the full app experience with offline access
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={handleInstallClick}
            className="bg-white hover:bg-gray-100 text-blue-600 px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
} 