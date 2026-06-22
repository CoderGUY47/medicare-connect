'use client';

import React from 'react';
import { HeartPulse } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading workspace data...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-zinc-950/95 backdrop-blur-xs transition-colors duration-300">
      <div className="relative flex flex-col items-center p-8 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[24px] shadow-2xl max-w-xs w-full text-center space-y-6">
        
        {/* Pulsing Backlight Glow */}
        <div className="absolute inset-x-0 top-0 h-24 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Pulse Heart Indicator */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 bg-rose-500/25 dark:bg-rose-550/20 rounded-full animate-ping opacity-75" />
          <div className="absolute h-20 w-20 bg-rose-500/10 dark:bg-rose-550/5 rounded-full animate-pulse" />
          <div className="relative z-10 h-16 w-16 bg-rose-500/10 text-rose-600 dark:text-rose-450 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/10">
            <HeartPulse className="h-8 w-8 animate-pulse" />
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-slate-800 dark:text-zinc-100 uppercase tracking-widest">
            Medi-Doc
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-zinc-500 font-bold uppercase tracking-wider leading-relaxed">
            {message}
          </p>
        </div>

        {/* Progressive Loading Line */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-[loading_1.5s_infinite_ease-in-out]" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(-10%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
