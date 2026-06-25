"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, { stiffness: 80, damping: 20 });
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const unsub = smoothProgress.on("change", (v) => setDisplayProgress(v));
    return unsub;
  }, [smoothProgress]);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollY > 300);
      rawProgress.set(docH > 0 ? scrollY / docH : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [rawProgress]);

  const radius = 19;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - displayProgress * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 32, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.7 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          whileHover={{ scale: 1.12, y: -2 }}
          whileTap={{ scale: 0.88 }}
          className="fixed bottom-8 right-8 z-[9999] h-12 w-12 flex items-center justify-center cursor-pointer group"
          aria-label="Scroll to top"
        >
          {/* SVG progress ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r={radius} fill="none" strokeWidth="2"
              className="stroke-slate-200 dark:stroke-zinc-700" />
            <circle cx="24" cy="24" r={radius} fill="none" strokeWidth="2"
              strokeLinecap="round"
              className="stroke-rose-500"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset} />
          </svg>

          {/* Inner circle with unique double-chevron icon */}
          <div className="relative z-10 h-9 w-9 rounded-full bg-white dark:bg-zinc-900 shadow-lg shadow-rose-500/20 flex flex-col items-center justify-center gap-0 group-hover:bg-rose-500 transition-colors duration-200">
            {/* Custom double-chevron up icon */}
            <svg viewBox="0 0 16 16" className="h-4 w-4 text-rose-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3,10 8,5.5 13,10" />
              <polyline points="3,13.5 8,9 13,13.5" />
            </svg>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
