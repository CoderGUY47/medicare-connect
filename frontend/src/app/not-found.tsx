"use client";

import React from "react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center select-none transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[28px] shadow-2xl p-8 sm:p-10 space-y-8 relative z-10">
        {/* Flatline Heartbeat ECG SVG Animation */}
        <div className="w-full flex justify-center py-4">
          <div className="relative w-64 h-24 border border-rose-500/10 bg-slate-50/50 dark:bg-zinc-950/20 rounded-2xl flex items-center justify-center overflow-hidden">
            {/* Grid overlay for medical ECG paper effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f43f5e08_1px,transparent_1px),linear-gradient(to_bottom,#f43f5e08_1px,transparent_1px)] bg-[size:16px_16px]" />

            {/* Pulsing neon cross overlay indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-rose-500/10 text-rose-550 dark:text-rose-500  border border-rose-500/20 text-[9px] font-bold rounded-lg uppercase tracking-wider animate-pulse">
              <span className="h-1.5 w-1.5 bg-rose-500 rounded-full shrink-0" />{" "}
              Error 404
            </div>

            {/* Glowing heartbeat flatline SVG */}
            <svg
              viewBox="0 0 300 100"
              className="w-full h-full stroke-rose-500 fill-none stroke-[3] stroke-linecap-round"
            >
              <motion.path
                d="M 10 50 L 80 50 L 90 30 L 100 70 L 110 50 L 140 50 L 148 15 L 158 85 L 168 50 L 190 50 L 290 50"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2.2,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
              {/* Highlight drop shadow glow */}
              <motion.path
                d="M 10 50 L 80 50 L 90 30 L 100 70 L 110 50 L 140 50 L 148 15 L 158 85 L 168 50 L 190 50 L 290 50"
                className="stroke-rose-455 opacity-35 blur-[3px]"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2.2,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </svg>
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-800 dark:text-zinc-50 font-outfit tracking-tight">
            Resource Flatlined
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold leading-relaxed">
            We searched our clinical records, but the page or directory you
            requested could not be located. It may have been relocated,
            archived, or does not exist.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-600/10 hover:shadow-rose-600/20 active:scale-[0.98]"
          >
            <Home className="h-4 w-4" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
