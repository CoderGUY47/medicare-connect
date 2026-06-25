"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock, CalendarDays, Phone, Mail } from "lucide-react";

// ── Inline social SVGs (lucide has no brand icons) ──────────────
const FbIcon  = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const XIcon   = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LiIcon  = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;
const IgIcon  = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function TopBar() {
  const [now, setNow] = useState<Date | null>(null);
  const [location, setLocation] = useState("Dhaka, Bangladesh");

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const d = await res.json();
          const city = d.address?.city || d.address?.town || d.address?.village || "City";
          const country = d.address?.country || "Bangladesh";
          setLocation(`${city}, ${country}`);
        } catch { /* keep default */ }
      },
      () => {},
      { timeout: 5000 }
    );
  }, []);

  const timeStr = now
    ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    : "--:--:--";

  const dateStr = now
    ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "";

  const SOCIALS = [
    { Icon: FbIcon, href: "#", label: "Facebook"  },
    { Icon: XIcon,  href: "#", label: "X/Twitter" },
    { Icon: LiIcon, href: "#", label: "LinkedIn"  },
    { Icon: IgIcon, href: "#", label: "Instagram" },
  ];

  return (
    <div className="w-full bg-slate-900 dark:bg-zinc-950 border-b border-white/5 transition-colors duration-300 overflow-hidden">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-16 h-[42px] flex items-center justify-between gap-4">

        {/* ── LEFT — Location · Hours · Date/Clock ── */}
        <div className="flex items-center gap-0 divide-x divide-white/10">

          {/* Location */}
          <div className="flex items-center gap-1.5 pr-4 shrink-0">
            <MapPin className="h-[13px] w-[13px] text-rose-400 shrink-0" />
            <span className="text-[13px] font-medium text-zinc-400 leading-none hidden sm:block">
              {location}
            </span>
          </div>

          {/* Working Hours */}
          <div className="flex items-center gap-1.5 px-4 shrink-0">
            <Clock className="h-[13px] w-[13px] text-emerald-400 shrink-0" />
            <span className="text-[13px] font-medium text-zinc-400 leading-none hidden md:block">
              Mon – Sat: 8:00 AM – 8:00 PM
            </span>
          </div>

          {/* Date + Live Clock */}
          <div className="flex items-center gap-1.5 pl-4 shrink-0">
            <CalendarDays className="h-[13px] w-[13px] text-sky-400 shrink-0" />
            <span className="text-[13px] font-medium text-zinc-400 leading-none hidden lg:block">
              {dateStr}
            </span>
            <span className="h-0.5 w-0.5 rounded-full bg-zinc-600 hidden lg:block" />
            <span className="text-[13px] font-black text-zinc-300 font-mono tabular-nums tracking-wider leading-none">
              {timeStr}
            </span>
          </div>
        </div>

        {/* ── RIGHT — Social + Email + Emergency ── */}
        <div className="flex items-center gap-0 divide-x divide-white/10 shrink-0">

          {/* Social icons */}
          <div className="flex items-center gap-3 pr-4">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-zinc-500 hover:text-white transition-colors duration-150"
              >
              <Icon className="h-[13px] w-[13px]" />
              </a>
            ))}
          </div>

          {/* Email */}
          <div className="hidden lg:flex items-center gap-1.5 px-4">
            <Mail className="h-[13px] w-[13px] text-zinc-500 shrink-0" />
            <a
              href="mailto:info@medidoc.health"
              className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors leading-none"
            >
              info@medidoc.health
            </a>
          </div>

          {/* Emergency CTA — glowing red pill */}
          <div className="pl-4">
            <a
              href="tel:911"
              className="group flex items-center gap-2 bg-rose-600 hover:bg-rose-500 transition-all duration-200 px-3 py-1 rounded-[4px] shadow-[0_0_12px_rgba(225,29,72,0.4)] hover:shadow-[0_0_18px_rgba(225,29,72,0.6)]"
              aria-label="Emergency 911"
            >
              {/* Pinging dot */}
              <span className="relative flex h-[5px] w-[5px] shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/70" />
                <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-white" />
              </span>

              <Phone className="h-[13px] w-[13px] text-white" />

              <span className="text-[13px] font-black uppercase tracking-widest text-white leading-none whitespace-nowrap">
                Emergency: 911
              </span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
