'use client';

import React from 'react';
import { ShieldCheck, Activity, Award, Layers } from 'lucide-react';
import ScrollAnimate from './ScrollAnimate';

export default function WhyChooseUs() {
  const advantages = [
    {
      id: 'adv-booking',
      icon: <Award className="h-6 w-6 text-rose-600 dark:text-rose-500" />,
      title: 'Verified Specialist Directory',
      desc: 'Browse qualified, vetted medical practitioners. Filter by consultation fee, years of experience, and specialization instantly.'
    },
    {
      id: 'adv-prescriptions',
      icon: <ShieldCheck className="h-6 w-6 text-rose-600 dark:text-rose-500" />,
      title: 'Secured JWT Records Cache',
      desc: 'All booking receipts, payment transaction histories, and digital prescriptions are encrypted and cached securely in cookies.'
    },
    {
      id: 'adv-coordination',
      icon: <Layers className="h-6 w-6 text-rose-600 dark:text-rose-500" />,
      title: 'Unified Healthcare Portals',
      desc: 'Integrated dashboards sync care operations between patients, doctors, lab specialists, pharmacists, and admins in one system.'
    },
    {
      id: 'adv-availability',
      icon: <Activity className="h-6 w-6 text-rose-600 dark:text-rose-500" />,
      title: '24/7 Schedule Management',
      desc: 'Doctors plan slots directly, and patients reschedule or cancel consultations instantly with automatic system status logging.'
    }
  ];

  return (
    <ScrollAnimate>
      <section className="w-full bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-white select-none border-b border-slate-200/60 dark:border-zinc-900 rounded-none py-16 md:py-20 transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-7xl space-y-10 rounded-none">
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

          {/* Advantages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {advantages.map((adv) => (
              <div
                key={adv.id}
                className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 p-6 flex gap-5 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 rounded-[10px]"
              >
                <div className="p-3 h-fit rounded-lg bg-rose-50 dark:bg-zinc-850/50 shadow-sm shrink-0">
                  {adv.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {adv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                    {adv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollAnimate>
  );
}
