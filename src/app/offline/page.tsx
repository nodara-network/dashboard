'use client';

import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">You're Offline</h1>
        <p className="text-gray-300 mb-6">
          Don't worry! Nodara works offline too. Some features may be limited, but you can still view cached content.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/dashboard"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Try Dashboard
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-sm text-gray-400">
            Nodara Network - Decentralized Compute Power
          </p>
        </div>
      </div>
    </div>
  );
} 