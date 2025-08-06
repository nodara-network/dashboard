"use client";

import Navbar from '@/components/ui/Navbar';
import GradientBars from '@/components/ui/GradientBars';
import PowerButton from '@/components/ui/PowerButton';
import React from 'react';

export default function HeroPage() {
  return (
    <section className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gray-950"></div>
      <GradientBars />
      <Navbar />

      <div className="relative z-10 text-center w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-8 sm:py-16">
        <h1 className="w-full text-white leading-tight tracking-tight mb-16 animate-fadeIn px-4" style={{ animationDelay: '200ms' }}>
          <span className="block font-inter font-medium text-[clamp(2rem,7vw,4.5rem)] mb-6">
            Trustless Compute Network
          </span>
          <span className="block font-instrument italic text-[clamp(1.2rem,4vw,2rem)] text-cyan-400">
            Run Functions. Pay Per Result.
          </span>
        </h1>

        {/* Big Power Button - VPN Style */}
        <div className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <PowerButton />
        </div>
      </div>
    </section>
  );
}


