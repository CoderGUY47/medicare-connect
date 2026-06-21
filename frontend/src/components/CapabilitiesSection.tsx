'use client';

import React from 'react';
import { Stethoscope, Calendar, Award } from 'lucide-react';
import ScrollAnimate from './ScrollAnimate';

export default function CapabilitiesSection() {
  return (
    <ScrollAnimate>
      <section className="py-16 px-6 lg:px-8 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-900">
        <div className="container space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              System Capabilities
            </h2>
            <p className="text-xs md:text-sm text-slate-400 dark:text-zinc-555 max-w-lg mx-auto">
              Fully optimized workflows designed for secure patient-doctor interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-100 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-950/20 p-6 rounded-2xl flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 rounded-xl shadow-sm">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                  Credential Verification
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-zinc-555 leading-relaxed">
                  Every doctor portal account undergoes thorough license verification before registry approval.
                </p>
              </div>
            </div>

            <div className="border border-slate-100 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-950/20 p-6 rounded-2xl flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 rounded-xl shadow-sm">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                  Direct Time Lock
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-zinc-555 leading-relaxed">
                  Select available days and hour blocks directly in the doctor schedule canvas. No waitlists.
                </p>
              </div>
            </div>

            <div className="border border-slate-100 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-950/20 p-6 rounded-2xl flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 rounded-xl shadow-sm">
                <Award className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                  Simulated stripe flows
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-zinc-555 leading-relaxed">
                  Seamless payment token processing during checkout. Secure card charges with instant scheduling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollAnimate>
  );
}
