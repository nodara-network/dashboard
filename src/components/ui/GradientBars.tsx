"use client";

import { useState } from 'react';

export default function GradientBars() {
  const [numBars] = useState(15);

  const calculateHeight = (index: number, total: number) => {
    const position = index / (total - 1);
    const maxHeight = 100;
    const minHeight = 30;

    const center = 0.5;
    const distanceFromCenter = Math.abs(position - center);
    const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2);

    return minHeight + (maxHeight - minHeight) * heightPercentage;
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        className="flex h-full"
        style={{
          width: '100%',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {Array.from({ length: numBars }).map((_, index) => {
          const height = calculateHeight(index, numBars);
          return (
            <div
              key={index}
              style={{
                flex: '1 0 calc(100% / 15)',
                maxWidth: 'calc(100% / 15)',
                height: '100%',
                background: `linear-gradient(to top, ${index % 2 === 0 ? 'rgb(34, 211, 238)' : 'rgb(45, 212, 191)'}, transparent)`,
                transform: `scaleY(${height / 100})`,
                transformOrigin: 'bottom',
                transition: 'transform 0.5s ease-in-out',
                animation: 'pulseBar 3s ease-in-out infinite',
                animationDelay: `${index * 0.2}s`,
                opacity: 0.3,
                '--scale': `${height / 100}`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/80" />
    </div>
  );
}