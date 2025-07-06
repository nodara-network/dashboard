"use client";

import { useState, useEffect } from 'react';
import { logoFont } from '@/fonts/logoFont';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  MoonIcon, 
  SunIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  CubeTransparentIcon,
  ServerIcon,
  XMarkIcon,
  Bars3Icon
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
    name: 'Node Dashboard',
    href: '/node-dashboard',
    description: 'Manage your node and earnings',
    icon: ServerIcon,
  },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark');
  };

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
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
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
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
              title="Toggle theme"
            >
              {mounted && (
                isDark ? (
                  <SunIcon className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
                ) : (
                  <MoonIcon className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
                )
              )}
            </button>

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
        </div>
      </div>
    </nav>
  );
}
