"use client";

import React from "react";
import Link from "next/link";
import {
  Stethoscope,
  Calendar,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";

export default function ServicePortals() {
  const portals = [
    {
      title: "Find Doctors",
      description: "Browse directories of available medical specialists near you.",
      href: "/find-doctors",
      icon: Stethoscope,
      badge: "REF: AP-1",
      linkText: "Access Directory",
      active: true,
    },
    {
      title: "Book Schedule",
      description: "Lock in verified consultation time slots in real time.",
      href: "/find-doctors",
      icon: Calendar,
      badge: "REF: AP-2",
      linkText: "Book Now",
      active: true,
    },
    {
      title: "Patient Records",
      description: "Access digitised medical charts and doctor prescriptions.",
      href: "/login",
      icon: Users,
      badge: "REF: AP-3",
      linkText: "View Records",
      active: true,
    },
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-16 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-zinc-950 dark:to-zinc-900 border-b border-slate-200/60 dark:border-zinc-800/40 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#4A2E80] dark:text-purple-400 uppercase bg-purple-500/10 dark:bg-purple-500/20 px-3.5 py-1.5 rounded-full inline-block">
            Services & Portals
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight font-outfit">
            Access Patient Care & Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Choose a portal below to search for doctor schedules, request consultations, or view medical records securely.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {portals.map((portal) => {
            const IconComponent = portal.icon;
            return (
              <Link
                key={portal.title}
                href={portal.href}
                className="group relative bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm p-7 md:p-8 rounded-3xl border border-slate-100 dark:border-zinc-800/45 shadow-md dark:shadow-black/35 hover:bg-white dark:hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-black/70 hover:-translate-y-1.5 transition-all duration-350 flex flex-col justify-between min-h-[280px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    {/* No BG Icon wrapper */}
                    <div className="relative flex items-center justify-center h-12 w-12 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="text-3xl h-8 w-8 text-black/60 dark:text-white/60 transition-colors" />
                    </div>
                    {/* Chip Badge */}
                    <span className="text-[9px] font-bold font-mono tracking-wider text-slate-400 dark:text-white/60 bg-slate-100/60 dark:bg-white/5 border border-slate-200/20 dark:border-white/5 px-2 py-0.5 rounded-md">
                      {portal.badge}
                    </span>
                  </div>

                  <div className="space-y-2.5 mt-7">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white group-hover:text-purple-650 dark:group-hover:text-purple-400 transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60 leading-relaxed font-medium">
                      {portal.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-purple-650 dark:text-white/80 group-hover:translate-x-1.5 transition-transform duration-300 mt-6">
                  <span>{portal.linkText}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}

          {/* Diagnostics Card (Coming Soon) */}
          <div className="group relative bg-slate-50/45 dark:bg-zinc-950/20 backdrop-blur-sm p-7 md:p-8 rounded-3xl border border-dashed border-slate-200/80 dark:border-zinc-800/80 shadow-sm dark:shadow-black/15 flex flex-col justify-between min-h-[280px] opacity-80">
            <div>
              <div className="flex items-center justify-between">
                {/* No BG Icon wrapper */}
                <div className="relative flex items-center justify-center h-12 w-12">
                  <Award className="text-3xl h-8 w-8 text-black/40 dark:text-white/40" />
                </div>
                {/* Chip Badge */}
                <span className="text-[9px] font-bold font-mono tracking-wider text-slate-450 dark:text-white/40 bg-slate-100/40 dark:bg-white/5 border border-slate-200/10 dark:border-white/5 px-2 py-0.5 rounded-md">
                  REF: AP-4
                </span>
              </div>

              <div className="space-y-2.5 mt-7">
                <h3 className="text-base sm:text-lg font-bold text-slate-400 dark:text-white/50">
                  Diagnostics
                </h3>
                <p className="text-xs sm:text-sm text-slate-450 dark:text-white/40 leading-relaxed font-medium">
                  Lab tests booking and tracking dashboards. (Coming soon)
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 mt-6">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
