"use client";

import React, { useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import ChartCard from "@/components/ui/ChartCard";
import { mockServices, serviceStats } from "@/services/servicesMockData";
import { WalletButton } from '@/components/solana/SolanaProvider';
import { useWallet } from '@solana/wallet-adapter-react';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'response'>('rating');
  const { connected } = useWallet();

  const categories = ['all', ...Object.keys(serviceStats.categories)];
  
  const filteredServices = mockServices
    .filter(service => selectedCategory === 'all' || service.specializations.includes(selectedCategory))
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.hourlyRate - b.hourlyRate;
        case 'response':
          return parseInt(a.responseTime.replace(/\D/g, '')) - parseInt(b.responseTime.replace(/\D/g, ''));
        default:
          return 0;
      }
    });

  const stats = [
    { label: "Total Providers", value: serviceStats.totalProviders.toString() },
    { label: "Online Now", value: serviceStats.onlineProviders.toString() },
    { label: "Avg Rating", value: serviceStats.averageRating.toString() },
    { label: "Total Earnings", value: serviceStats.totalEarnings.toFixed(1) + " SOL" },
    { label: "Completed Tasks", value: serviceStats.totalTasks.toString() },
    { label: "Avg Response", value: serviceStats.averageResponseTime },
  ];

  if (!connected) {
    return (
      <PageLayout>
        <PageHeader
          title="Service Marketplace"
          description="Connect your wallet to browse and book compute services from smartphone providers"
        />
        
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-6">🔌</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
            Please connect your Solana wallet to access the service marketplace.
          </p>
          <WalletButton />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Service Marketplace"
        description="Discover and book compute services from smartphone providers in your area"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <MetricCard
            key={index}
            label={stat.label}
            value={stat.value}
            isLoading={false}
          />
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="mb-8">
        <ChartCard
          title="Service Categories"
          description="Distribution of providers across different specializations"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {Object.entries(serviceStats.categories).map(([category, count]) => (
              <div key={category} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{count}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{category}</div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
          >
            <option value="rating">Rating</option>
            <option value="price">Price</option>
            <option value="response">Response Time</option>
          </select>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No services found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
        </div>
      )}
    </PageLayout>
  );
}

function ServiceCard({ service }: { service: any }) {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={service.image} 
              alt={service.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{service.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-3 h-3 rounded-full ${service.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {service.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Rating and Trust Score */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                {service.rating}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({service.reviews} reviews)
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Trust Score: {service.trustScore}%
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {service.description}
        </p>

        {/* Specializations */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.specializations.map((spec: string, index: number) => (
            <span 
              key={index}
              className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded text-xs"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {service.completedTasks}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Tasks</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {service.totalEarnings.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">SOL Earned</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {service.responseTime}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Response</div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-4">
          {service.badges.map((badge: string, index: number) => (
            <span 
              key={index}
              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {service.hourlyRate.toFixed(2)} SOL
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">per hour</div>
          </div>
          <button className="px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all duration-200">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
} 