'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  showPlus?: boolean;
}

export default function AnimatedCounter({ target, duration = 1500, showPlus = true }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Smooth ease-out animation curve
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  const isFinished = count === target;

  return (
    <>
      {count.toLocaleString()}
      {isFinished && showPlus && (
        <span className="text-rose-500 font-extrabold ml-0.5 select-none transition-all duration-300 animate-in fade-in zoom-in-75">
          +
        </span>
      )}
    </>
  );
}
