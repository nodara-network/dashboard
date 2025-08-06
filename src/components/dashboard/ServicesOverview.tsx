"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ServiceData {
  id: string;
  name: string;
  provider: string;
  price: string;
  rating: number;
  category: string;
  responseTime: string;
  available: boolean;
}

const MOCK_SERVICES: ServiceData[] = [
  {
    id: '1',
    name: 'AI Image Processing',
    provider: 'NodeMaster Pro',
    price: '0.05 SOL',
    rating: 4.8,
    category: 'AI/ML',
    responseTime: '2.3s',
    available: true
  },
  {
    id: '2',
    name: 'Video Transcoding',
    provider: 'ComputeHub',
    price: '0.12 SOL',
    rating: 4.6,
    category: 'Media',
    responseTime: '15.7s',
    available: true
  },
  {
    id: '3',
    name: 'Data Analytics',
    provider: 'CrunchNode',
    price: '0.08 SOL',
    rating: 4.9,
    category: 'Analytics',
    responseTime: '8.1s',
    available: false
  }
];

export default function ServicesOverview() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setServices(MOCK_SERVICES);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Service Marketplace</h2>
          <Link 
            href="/services"
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Browse and book compute services from smartphone providers</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    service.available 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {service.available ? 'Available' : 'Busy'}
                  </span>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{service.rating}</span>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{service.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{service.provider}</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 text-sm">{service.price}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">{service.responseTime}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-xs px-2 py-1 rounded">Real-time Pricing</span>
          <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-xs px-2 py-1 rounded">Instant Booking</span>
          <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-xs px-2 py-1 rounded">Trust Scores</span>
        </div>
      </div>
    </div>
  );
} 