"use client";

import { logoFont } from '@/fonts/logoFont';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient background with blur */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800" />
      
      {/* Gradient line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 group">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8 overflow-hidden rounded-lg transition-transform duration-200 group-hover:scale-110">
                <Image
                  src="/logo.png"
                  alt="Nodara Network"
                  width={32}
                  height={32}
                  className="w-8 h-8 transition-transform duration-200 group-hover:scale-110"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-lg" />
              </div>
              <span className={`text-lg font-semibold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent transition-all duration-200 group-hover:from-cyan-500 group-hover:to-teal-500 font-space ${logoFont}`}>
                NODARA 
              </span>
            </Link>
          </div>

          {/* Dashboard Button */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}