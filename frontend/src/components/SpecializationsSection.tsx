"use client";

import React from "react";
import Link from "next/link";
import {
  HeartPulse,
  Baby,
  Sparkles,
  Brain,
  Bone,
  Stethoscope,
  ArrowUpRight,
} from "lucide-react";
import ScrollAnimate from "./ScrollAnimate";

const specializations = [
  {
    // Row 1 — col 1-2
    name: "Cardiology",
    icon: HeartPulse,
    desc: "Heart care & circulatory systems",
    image: "/assets/specializations/cardiology.png",
    accent: "from-rose-600/80 to-rose-900/90",
    iconColor: "text-rose-300",
    tag: "Most Booked",
    grid: "md:col-span-2",
    textSize: "text-2xl",
  },
  {
    // Row 1 — col 3
    name: "Neurology",
    icon: Brain,
    desc: "Brain & nervous system analysis",
    image: "/assets/specializations/neurology.png",
    accent: "from-indigo-600/80 to-indigo-900/90",
    iconColor: "text-indigo-300",
    tag: "Specialist",
    grid: "md:col-span-1",
    textSize: "text-xl",
  },
  {
    // Row 2 — col 1
    name: "Pediatrics",
    icon: Baby,
    desc: "Medical care for infants & children",
    image: "/assets/specializations/pediatrics.png",
    accent: "from-teal-600/80 to-teal-900/90",
    iconColor: "text-teal-300",
    tag: "Family",
    grid: "md:col-span-1",
    textSize: "text-lg",
  },
  {
    // Row 2 — col 2-3
    name: "Dermatology",
    icon: Sparkles,
    desc: "Skin, hair & nail treatments",
    image: "/assets/specializations/dermatology.png",
    accent: "from-purple-600/80 to-purple-900/90",
    iconColor: "text-purple-300",
    tag: "Aesthetic",
    grid: "md:col-span-2",
    textSize: "text-xl",
  },
  {
    // Row 3 — col 1-2
    name: "Orthopedics",
    icon: Bone,
    desc: "Bone, joint & muscle care",
    image: "/assets/specializations/orthopedics.png",
    accent: "from-sky-600/80 to-sky-900/90",
    iconColor: "text-sky-300",
    tag: "Surgical",
    grid: "md:col-span-2",
    textSize: "text-xl",
  },
  {
    // Row 3 — col 3
    name: "General Practice",
    icon: Stethoscope,
    desc: "Comprehensive everyday health care",
    image: "/assets/specializations/general.png",
    accent: "from-amber-600/80 to-amber-900/90",
    iconColor: "text-amber-300",
    tag: "Primary Care",
    grid: "md:col-span-1",
    textSize: "text-lg",
  },
];

export default function SpecializationsSection() {
  return (
    <ScrollAnimate>
      <section className="py-20 px-4 w-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-zinc-950 dark:to-zinc-900 border-b border-slate-200/60 dark:border-zinc-800/40 transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-rose-500 dark:text-rose-400 mb-2">
              Our Specializations
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight font-outfit">
              Browse by Specialization
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              Choose a specific clinic category to view matching doctors in our
              directory.
            </p>
          </div>

          {/* Bento Grid
            Row 1: [ Cardiology ×2 cols ] [ Neurology ×1 col ]
            Row 2: [ Pediatrics ×1 col ] [ Dermatology ×2 cols ]
            Row 3: [ Orthopedics ×2 cols ] [ General Practice ×1 col ]
          */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-[220px]">
            {specializations.map((spec) => {
              const IconComponent = spec.icon;
              return (
                <Link
                  key={spec.name}
                  href={`/find-doctors?search=${encodeURIComponent(spec.name)}`}
                  className={`group relative overflow-hidden rounded-3xl cursor-pointer ${spec.grid}`}
                  style={{ minHeight: "160px" }}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${spec.image})` }}
                  />

                  {/* Gradient overlay — always visible, deepens on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${spec.accent} opacity-80 group-hover:opacity-90 transition-opacity duration-500`}
                  />

                  {/* Subtle noise texture */}
                  <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

                  {/* Tag badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-white/15 backdrop-blur-md text-white border border-white/20 px-2.5 py-1 rounded-full">
                      {spec.tag}
                    </span>
                  </div>

                  {/* Arrow — top right, revealed on hover */}
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300">
                    <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/25">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Content — bottom */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-5 space-y-2">
                    {/* Icon */}
                    <div className={`${spec.iconColor} mb-1`}>
                      <IconComponent className="h-6 w-6 drop-shadow-lg" />
                    </div>

                    <h3
                      className={`${spec.textSize} font-extrabold text-white tracking-tight leading-tight drop-shadow-md`}
                    >
                      {spec.name}
                    </h3>

                    <p className="text-xs text-white/70 font-medium leading-snug translate-y-1 opacity-80 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      {spec.desc}
                    </p>

                    {/* Hover CTA line */}
                    <div className="flex items-center gap-1.5 pt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-[11px] font-bold text-white/90 tracking-wide">
                        Explore Doctors
                      </span>
                      <ArrowUpRight className="h-3 w-3 text-white/80" />
                    </div>
                  </div>

                  {/* Bottom shimmer line on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/0 group-hover:bg-white/25 transition-colors duration-500 z-20" />
                </Link>
              );
            })}
          </div>

          {/* View All CTA */}
          <div className="text-center mt-10">
            <Link
              href="/find-doctors"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-800 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold tracking-wide hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-rose-500/30 group"
            >
              View All Specializations
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </ScrollAnimate>
  );
}
