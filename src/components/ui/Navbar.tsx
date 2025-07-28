"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { logoFont } from '@/fonts/logoFont';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/solana/SolanaProvider';
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
    publicKey,
    connected,
    connecting,
    disconnect
  } = useWallet();

  const isWalletConnected = useMemo(() => connected, [connected]);
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

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
            <div className="hidden md:flex">
              <WalletButton />
            </div>
             
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
                         {connected ? 'User' : 'Not Connected'}
                       </p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">
                         {connected && publicKey ? formatAddress(publicKey.toString()) : 'Connect wallet to continue'}
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
                     <div className="px-4 py-2">
                       <WalletButton />
                     </div>
                    
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
          <div className="mb-2">
            <WalletButton />
          </div>

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
    </nav>
  );
}

