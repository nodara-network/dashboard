"use client";

import Navbar from '@/components/Navbar';
import GradientBars from '@/components/ui/GradientBars';
import React, { useState } from 'react';

type AvatarProps = {
  imageSrc: string;
  delay: number;
};

export default function HeroPage() {
  return (
    <section className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gray-950"></div>
      <GradientBars />
      <Navbar />

      <div className="relative z-10 text-center w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-8 sm:py-16">
        <div className="mb-8 sm:mb-10">
          <TrustElements />
        </div>

        <h1 className="w-full text-white leading-tight tracking-tight mb-8 sm:mb-10 animate-fadeIn px-4" style={{ animationDelay: '200ms' }}>
          <span className="block font-inter font-medium text-[clamp(1.75rem,6vw,4rem)] mb-4">
            Trustless Compute, Straight from Your Phone
          </span>
          <span className="block font-instrument italic text-[clamp(1.5rem,6vw,3.75rem)] bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 text-transparent bg-clip-text bg-[size:200%] animate-gradient">
          </span>
        </h1>

        <div className="mb-12 px-4 max-w-3xl">
          <p className="text-[clamp(1.1rem,2.5vw,1.35rem)] text-cyan-100 leading-relaxed animate-fadeIn font-space" style={{ animationDelay: '400ms' }}>
            Run Functions. Pay Per Result.
          </p>
        </div>

        <div id="waitlist-form" className="w-full max-w-2xl mb-10 sm:mb-12 px-4 animate-fadeIn" style={{ animationDelay: '600ms' }}>
          <WaitlistForm />
        </div>

        <div className="flex justify-center animate-fadeIn" style={{ animationDelay: '800ms' }}>
          <a
            href="https://x.com/nodaranetwork"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 transition-colors duration-300 flex items-center gap-2 text-sm font-space"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>@nodaranetwork</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Avatar({ imageSrc, delay }: AvatarProps) {
  return (
    <div
      className="relative h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full overflow-hidden border-2 border-gray-700 shadow-lg animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <img
        src={imageSrc}
        alt="User avatar"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
  );
}

function TrustElements() {
  const avatars = [
    "https://pbs.twimg.com/profile_images/1890067153073704961/lW-CFqgG_400x400.jpg",
    "https://pbs.twimg.com/profile_images/1925608041321275393/gmyPy1KH_400x400.png",
    "https://pbs.twimg.com/profile_images/1903172797263908867/nnm1MD_j_400x400.jpg",
    "https://pbs.twimg.com/profile_images/1929103363880493056/GQ3W-aGE_400x400.jpg",
    "https://pbs.twimg.com/profile_images/1937865077786316800/fVGLgl_A_400x400.jpg"
  ];

  return (
    <div className="inline-flex items-center space-x-3 bg-gray-900/60 backdrop-blur-sm rounded-full py-2 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm">
      <div className="flex -space-x-2 sm:-space-x-3">
        {avatars.map((avatar, index) => (
          <Avatar key={index} imageSrc={avatar} delay={index * 200} />
        ))}
      </div>
      <p className="text-white animate-fadeIn whitespace-nowrap font-space" style={{ animationDelay: '800ms' }}>
        <span className="text-white font-semibold"></span> currently on the waitlist
      </p>
    </div>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');

      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : 'Failed to join waitlist. Please try again.');
      console.error('Form submission error:', err);
    }
  };

  return (
    <div className="relative z-10 w-full">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"
            className="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gray-900/60 border border-cyan-900 focus:border-cyan-400 outline-none text-white text-sm sm:text-base shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-sm transition-all duration-300 font-space"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base font-space ${isSubmitting
              ? 'bg-cyan-900 text-cyan-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-gray-900'
              }`}
          >
            {isSubmitting ? (
              <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-cyan-200 border-t-cyan-900 rounded-full animate-spin"></div>
            ) : (
              'Join The Waitlist'
            )}
          </button>
          {error && (
            <p className="absolute -bottom-6 left-0 text-red-400 text-sm">{error}</p>
          )}
        </form>
      ) : (
        <div className="bg-cyan-900/20 border border-cyan-500/30 text-cyan-300 rounded-full px-6 sm:px-8 py-3 sm:py-4 text-center animate-fadeIn text-sm sm:text-base font-space">
          Thanks for joining! We'll notify you when we launch.
        </div>
      )}
    </div>
  );
}
