'use client';

import React from 'react';
import ScrollAnimate from './ScrollAnimate';

export default function WhyChooseUs() {
  const advantages = [
    {
      id: 'adv-booking',
      badge: 'Directory',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
      title: 'Verified Specialist Directory',
      desc: 'Browse qualified, vetted medical practitioners. Filter by consultation fee, years of experience, and specialization instantly.'
    },
    {
      id: 'adv-prescriptions',
      badge: 'Security',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600',
      title: 'Secured Records Cache',
      desc: 'All booking receipts, payment transaction histories, and digital prescriptions are encrypted and cached securely in cookies.'
    },
    {
      id: 'adv-coordination',
      badge: 'Portals',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600',
      title: 'Unified Healthcare Portals',
      desc: 'Integrated dashboards sync care operations between patients, doctors, lab specialists, pharmacists, and admins in one system.'
    },
    {
      id: 'adv-availability',
      badge: 'Scheduling',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600',
      title: '24/7 Schedule Planner',
      desc: 'Doctors plan slots directly, and patients reschedule or cancel consultations instantly with automatic system status logging.'
    }
  ];

  return (
    <ScrollAnimate>
      <section className="w-full bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-white select-none border-b border-slate-200/60 dark:border-zinc-900 rounded-none py-16 md:py-20 transition-colors duration-300 relative overflow-hidden">
        {/* Glow accent backgrounds */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 dark:bg-rose-500/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/3 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl space-y-10 rounded-none relative z-10">
          {/* Header Block */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-500 font-bold text-xs uppercase tracking-wider">
              <span className="text-sm font-black">+</span>
              <span>Platform Advantages</span>
            </div>
            <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">
              Why Choose MediCare Connect
            </h2>
            <p className="text-base text-slate-650 dark:text-zinc-400 leading-relaxed font-semibold max-w-3xl">
              Our advanced patient-doctor coordination portal is built with speed, clarity, and security to make health service management effortless.
            </p>
          </div>

          {/* Advantages Grid: 4-Columns on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {advantages.map((adv) => (
              <div
                key={adv.id}
                className="bg-white dark:bg-zinc-900 border-none shadow-xl hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden flex flex-col justify-between group min-h-[380px]"
              >
                {/* Top Image Card Part */}
                <div className="relative h-48 w-full overflow-hidden select-none bg-slate-100 dark:bg-zinc-950">
                  <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200/20 dark:border-zinc-800/20">
                    {adv.badge}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-10 opacity-70 group-hover:opacity-85 transition-opacity duration-300" />
                  <img
                    src={adv.image}
                    alt={adv.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Bottom Content Part */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold font-outfit text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-500 transition-colors tracking-tight leading-snug">
                      {adv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                      {adv.desc}
                    </p>
                  </div>

                  {/* Interactive accent indicator bar */}
                  <div className="pt-2">
                    <div className="h-[3px] w-10 bg-gradient-to-r from-rose-500 to-amber-500 group-hover:w-full transition-all duration-500 ease-out rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollAnimate>
  );
}
