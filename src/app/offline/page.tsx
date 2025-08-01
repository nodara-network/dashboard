'use client';

import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">You're Offline</h1>
          <p className="text-gray-400 mb-6">
            It looks like you've lost your internet connection. Don't worry, you can still access some features of Nodara.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Available Offline</h2>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Dashboard overview</li>
              <li>• Cached analytics data</li>
              <li>• Device management</li>
              <li>• Task history</li>
            </ul>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Not Available</h2>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Real-time updates</li>
              <li>• New task creation</li>
              <li>• Live analytics</li>
              <li>• Wallet connections</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
        
        <div className="mt-4">
          <Link 
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 