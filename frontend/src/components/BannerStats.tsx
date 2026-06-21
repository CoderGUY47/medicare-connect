"use client";

import React, { useState, useEffect } from "react";
import AnimatedCounter from "./AnimatedCounter";

export default function BannerStats() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full h-[120px] bg-slate-900/60 dark:bg-zinc-950/50 backdrop-blur-md rounded-3xl p-6 flex items-center justify-around gap-4 mt-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-rose-600/5">
      <div className="absolute -top-20 -left-20 h-40 w-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 h-40 w-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 group">
        <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
          {mounted ? <AnimatedCounter target={125} /> : "125"}
        </span>
        <span className="mt-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-zinc-400">
          Active Specialists
        </span>
      </div>

      <div className="h-12 w-px bg-white/10 dark:bg-zinc-800/50 shrink-0" />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 group">
        <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
          {mounted ? <AnimatedCounter target={830} /> : "830"}
        </span>
        <span className="mt-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-zinc-400">
          Completed Bookings
        </span>
      </div>

      <div className="h-12 w-px bg-white/10 dark:bg-zinc-800/50 shrink-0" />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 group">
        <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
          {mounted ? <AnimatedCounter target={83} /> : "83"}
        </span>
        <span className="mt-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-zinc-400">
          Verified Reviews
        </span>
      </div>

      <div className="h-12 w-px bg-white/10 dark:bg-zinc-800/50 shrink-0" />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 group">
        <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
          {mounted ? <AnimatedCounter target={98} showPlus={false} /> : "98"}%
        </span>
        <span className="mt-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-zinc-400">
          Patient Satisfaction
        </span>
      </div>
    </div>
  );
}
