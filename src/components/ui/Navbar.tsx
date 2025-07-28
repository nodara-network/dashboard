"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { logoFont } from '@/fonts/logoFont';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useWallet } from '@/contexts/WalletContext';
import { 
  ChartBarIcon,
  DevicePhoneMobileIcon,
  CubeTransparentIcon,
  ServerIcon,
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
  WalletIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';


interface NavItem {
  name: string;
  href: string;
  description: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
}

const navigation: NavItem[] = [
  {
    name: 'Services',
    href: '/services',
    description: 'Browse and request services from the network',
    icon: CubeTransparentIcon,
  },
  {
    name: 'Devices',
    href: '/devices',
    description: 'View active nodes and their status',
    icon: DevicePhoneMobileIcon,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    description: 'Network statistics and performance metrics',
    icon: ChartBarIcon,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    description: 'Create and manage distributed compute tasks',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Node Dashboard',
    href: '/node-dashboard',
    description: 'Manage your node and earnings',
    icon: ServerIcon,
  },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();

  const {
    wallet,
    walletAddress,
    isConnecting,
    availableWallets,
    connectWallet,
    disconnectWallet,
    showWalletModal,
    setShowWalletModal
  } = useWallet();

  const isWalletConnected = useMemo(() => !!wallet?.publicKey, [wallet?.publicKey]);
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setShowWalletModal(false);
  }, [pathname, setShowWalletModal]);

  const handleProfileMenuToggle = useCallback(() => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  }, [isProfileMenuOpen]);

  const formatAddress = useCallback((address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }, []);

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-7">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 group relative
                    ${isActive
                      ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
                      : 'text-gray-600 dark:text-gray-300 '
                    }
                  `}
                  title={item.description}
                >
                  <item.icon 
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />
                  <span>{item.name}</span>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">

            {/* Wallet Connect Button */}
            <button
              onClick={() => isWalletConnected ? disconnectWallet() : setShowWalletModal(true)}
              disabled={isConnecting}
              className={`
                hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 border disabled:opacity-50
                ${isWalletConnected
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                  : 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-200 dark:hover:bg-cyan-900/50'
                }
              `}
            >
              <WalletIcon className="w-4 h-4" />
              <span>
                {isConnecting ? 'Connecting...' : isWalletConnected ? 'Connected' : 'Connect Wallet'}
              </span>
            </button>
             
            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={handleProfileMenuToggle}
                className={`
                  flex items-center space-x-2 p-2 rounded-lg transition-all duration-200
                  ${isProfileMenuOpen
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                title="User profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 flex items-center justify-center">
                  <UserCircleIcon className="w-5 h-5 text-white" />
                </div>
                <ChevronDownIcon 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isProfileMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 flex items-center justify-center">
                        <UserCircleIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                                               <p className="text-sm font-medium text-gray-900 dark:text-white">
                         {isWalletConnected ? 'User' : 'Not Connected'}
                       </p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">
                         {isWalletConnected && walletAddress ? formatAddress(walletAddress) : 'Connect wallet to continue'}
                       </p>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Status */}
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Wallet Status</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isWalletConnected 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {isWalletConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                    
                   </div>

                   {/* Menu Items */}
                   <div className="py-1">
                     <button
                       onClick={() => isWalletConnected ? disconnectWallet() : setShowWalletModal(true)}
                       disabled={isConnecting}
                       className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                     >
                       <WalletIcon className="w-4 h-4" />
                       <span>
                         {isConnecting ? 'Connecting...' : isWalletConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
                       </span>
                     </button>
                    
                    <Link
                      href="/profile"
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <UserCircleIcon className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <CogIcon className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                    <button
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>



            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">
                {isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              </span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`
          md:hidden absolute top-full left-0 right-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg
          border-b border-gray-200 dark:border-gray-800 transition-all duration-200 overflow-hidden
          ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0'}
        `}
      >
        <div className="space-y-1 px-4 pb-3 pt-2">
          <button
            onClick={() => isWalletConnected ? disconnectWallet() : setShowWalletModal(true)}
            disabled={isConnecting}
            className={`
              w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium
              transition-all duration-200 border mb-2 disabled:opacity-50
              ${isWalletConnected
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                : 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800'
              }
            `}
          >
            <WalletIcon className="w-5 h-5" />
            <span>
              {isConnecting ? 'Connecting...' : isWalletConnected ? 'Connected' : 'Connect Wallet'}
            </span>
          </button>

          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                title={item.description}
              >
                <item.icon 
                  className={`w-5 h-5 ${
                    isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Mobile Profile Menu Items */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <Link
              href="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <UserCircleIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <span>Profile Settings</span>
            </Link>
            
            <Link
              href="/settings"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <CogIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur effect matching navbar */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-lg"
            onClick={() => setShowWalletModal(false)}
          />
          
          {/* Modal with theme matching */}
          <div className="relative bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-8 w-full max-w-lg mx-4">
            {/* Header with gradient accent */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  Connect Wallet
                </h3>
                <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" />
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                className="p-3 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200 group"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </button>
            </div>

            {/* 2x2 Grid Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Phantom */}
              <div className="relative">
                <button
                  onClick={() => connectWallet('Phantom')}
                  disabled={isConnecting || !availableWallets.includes('Phantom')}
                  className={`
                    group relative flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 w-full
                    ${availableWallets.includes('Phantom')
                      ? 'bg-cyan-100/50 dark:bg-cyan-900/20 border border-cyan-200/70 dark:border-cyan-700/50 hover:bg-cyan-200/70 dark:hover:bg-cyan-900/30 hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105'
                      : 'bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <img 
                    src="/phantom.svg" 
                    alt="Phantom" 
                    className="w-16 h-16 object-contain rounded-full mb-3 group-hover:scale-110 transition-transform duration-200"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Phantom</span>
                  {!availableWallets.includes('Phantom') && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Not installed</span>
                  )}
                  {isConnecting && (
                    <div className="absolute top-2 right-2 w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
                {!availableWallets.includes('Phantom') && (
                  <a 
                    href="https://phantom.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-2 left-2 text-cyan-500 hover:text-cyan-600 text-xs font-medium"
                  >
                    Install
                  </a>
                )}
              </div>

              {/* Solflare */}
              <div className="relative">
                <button
                  onClick={() => connectWallet('Solflare')}
                  disabled={isConnecting || !availableWallets.includes('Solflare')}
                  className={`
                    group relative flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 w-full
                    ${availableWallets.includes('Solflare')
                      ? 'bg-cyan-100/50 dark:bg-cyan-900/20 border border-cyan-200/70 dark:border-cyan-700/50 hover:bg-cyan-200/70 dark:hover:bg-cyan-900/30 hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105'
                      : 'bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <img 
                    src="/solflare.png" 
                    alt="Solflare" 
                    className="w-16 h-16 object-contain rounded-full mb-3 group-hover:scale-110 transition-transform duration-200"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Solflare</span>
                  {!availableWallets.includes('Solflare') && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Not installed</span>
                  )}
                  {isConnecting && (
                    <div className="absolute top-2 right-2 w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
                {!availableWallets.includes('Solflare') && (
                  <a 
                    href="https://solflare.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-2 left-2 text-cyan-500 hover:text-cyan-600 text-xs font-medium"
                  >
                    Install
                  </a>
                )}
              </div>

              {/* Backpack */}
              <div className="relative">
                <button
                  onClick={() => connectWallet('Backpack')}
                  disabled={isConnecting || !availableWallets.includes('Backpack')}
                  className={`
                    group relative flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 w-full
                    ${availableWallets.includes('Backpack')
                      ? 'bg-cyan-100/50 dark:bg-cyan-900/20 border border-cyan-200/70 dark:border-cyan-700/50 hover:bg-cyan-200/70 dark:hover:bg-cyan-900/30 hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105'
                      : 'bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <img 
                    src="/backpack.png" 
                    alt="Backpack" 
                    className="w-16 h-16 object-contain rounded-full mb-3 group-hover:scale-110 transition-transform duration-200"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Backpack</span>
                  {!availableWallets.includes('Backpack') && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Not installed</span>
                  )}
                  {isConnecting && (
                    <div className="absolute top-2 right-2 w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
                {!availableWallets.includes('Backpack') && (
                  <a 
                    href="https://www.backpack.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-2 left-2 text-cyan-500 hover:text-cyan-600 text-xs font-medium"
                  >
                    Install
                  </a>
                )}
              </div>

              {/* Empty slot for future wallet */}
              <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300/50 dark:border-gray-600/50">
                <div className="w-16 h-16 bg-gray-200/50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mb-3">
                  <span className="text-gray-400 dark:text-gray-500 text-2xl">+</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">More coming</span>
              </div>
            </div>

            {/* Footer with gradient accent */}
            <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have a wallet? 
                <span className="ml-1 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent font-medium">
                  Install from official websites
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

