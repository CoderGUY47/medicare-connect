'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight,
  HeartPulse,
  Baby,
  Sparkles,
  Brain,
  Bone,
  Stethoscope
} from 'lucide-react';
import ScrollAnimate from './ScrollAnimate';

export default function SpecializationsSection() {
  const specializations = [
    {
      name: 'Cardiology',
      icon: HeartPulse,
      desc: 'Heart care & circulatory systems',
    },
    {
      name: 'Pediatrics',
      icon: Baby,
      desc: 'Medical care for infants & children',
    },
    {
      name: 'Dermatology',
      icon: Sparkles,
      desc: 'Skin, hair & nail treatments',
    },
    {
      name: 'Neurology',
      icon: Brain,
      desc: 'Brain & nervous system analysis',
    },
    {
      name: 'Orthopedics',
      icon: Bone,
      desc: 'Bone, joint & muscle care',
    },
    {
      name: 'General Practice',
      icon: Stethoscope,
      desc: 'Comprehensive everyday health care',
    },
  ];

  return (
    <ScrollAnimate>
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-zinc-950 dark:to-zinc-900 border-b border-slate-200/60 dark:border-zinc-800/40 transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#4A2E80] dark:text-purple-400 uppercase bg-purple-500/10 dark:bg-purple-500/20 px-3.5 py-1.5 rounded-full inline-block">
              Specializations
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight font-outfit">
              Browse by Specialization
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              Choose a specific clinic category to view matching doctors in our directory.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec) => {
              const IconComponent = spec.icon;
              return (
                <Link
                  key={spec.name}
                  href={`/find-doctors?search=${encodeURIComponent(spec.name)}`}
                  className="group relative bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 dark:border-zinc-800/45 shadow-md dark:shadow-black/35 hover:bg-white dark:hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-black/70 hover:-translate-y-1.5 transition-all duration-350 flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    {/* No BG Icon wrapper */}
                    <div className="relative flex items-center justify-center h-12 w-12 group-hover:scale-110 transition-transform duration-300 shrink-0">
                      <IconComponent className="text-3xl h-8 w-8 text-black/60 dark:text-white/60 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white group-hover:text-purple-650 dark:group-hover:text-purple-400 transition-colors">
                        {spec.name}
                      </h3>
                      <p className="text-[11px] text-slate-450 dark:text-white/60 leading-normal mt-0.5">
                        {spec.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 dark:text-white/80 group-hover:translate-x-1.5 transition-all duration-300" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </ScrollAnimate>
  );
}
