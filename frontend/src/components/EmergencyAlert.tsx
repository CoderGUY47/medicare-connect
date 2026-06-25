"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, X, Phone } from "lucide-react";

// ── Programmatic ambulance siren via Web Audio API ──────────────────────────
function playSOSSiren() {
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();

    const cycles = 4;
    const cycleDuration = 0.6;

    for (let i = 0; i < cycles; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const t = ctx.currentTime + i * cycleDuration;

      // Hi-Lo ambulance tone
      osc.frequency.setValueAtTime(960, t);
      osc.frequency.linearRampToValueAtTime(720, t + cycleDuration * 0.5);
      osc.frequency.linearRampToValueAtTime(960, t + cycleDuration);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.05);
      gain.gain.linearRampToValueAtTime(0.22, t + cycleDuration - 0.05);
      gain.gain.linearRampToValueAtTime(0, t + cycleDuration);

      osc.type = "sawtooth";
      osc.start(t);
      osc.stop(t + cycleDuration);
    }
  } catch {
    console.warn("Web Audio API not supported");
  }
}

export default function EmergencyAlert() {
  const [dismissed, setDismissed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const playTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSiren = () => {
    if (playing) return;
    setPlaying(true);
    playSOSSiren();
    // Reset after siren duration (4 cycles × 0.6s = 2.4s + buffer)
    playTimeout.current = setTimeout(() => setPlaying(false), 2600);
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key="emergency-alert"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ type: "spring", stiffness: 280, damping: 24, delay: 1.5 }}
          className="fixed right-5 top-24 z-[9998] flex flex-col gap-0 max-w-[220px] select-none"
        >
          {/* Alert card */}
          <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">

            {/* Rose-500 accent top bar */}
            <div className="h-1 w-full bg-rose-500" />

            <div className="p-3.5 space-y-2.5">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Rose badge */}
                  <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                    <motion.span
                      animate={{ scale: playing ? [1, 1.3, 1] : 1 }}
                      transition={{ repeat: playing ? Infinity : 0, duration: 0.4 }}
                    >
                      🚨
                    </motion.span>
                    Alert
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-700 dark:text-zinc-200">
                    Emergency
                  </span>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer rounded-full p-0.5 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  aria-label="Dismiss alert"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
                Need urgent medical help? Activate the emergency siren or call directly.
              </p>

              {/* Siren button */}
              <motion.button
                onClick={handleSiren}
                whileTap={{ scale: 0.94 }}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  playing
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-500/40 animate-pulse"
                    : "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/25"
                }`}
              >
                <BellRing className="h-3.5 w-3.5" />
                {playing ? "Siren Active..." : "Sound SOS Siren"}
              </motion.button>

              {/* Call CTA */}
              <a
                href="tel:911"
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-all duration-200"
              >
                <Phone className="h-3 w-3" />
                Call 911
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
