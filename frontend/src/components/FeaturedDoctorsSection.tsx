'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, Heart, Star, ArrowRight } from 'lucide-react';
import { db, Doctor } from '../lib/mockDb';
import ScrollAnimate from './ScrollAnimate';

export default function FeaturedDoctorsSection() {
  const [featuredDocs, setFeaturedDocs] = useState<Doctor[]>([]);

  useEffect(() => {
    const docs = db
      .getDoctors()
      .filter((d) => d.verificationStatus === 'verified')
      .slice(0, 3);
    setFeaturedDocs(docs);
  }, []);

  return (
    <ScrollAnimate>
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-gradient-to-b from-slate-55 to-slate-100/50 dark:from-zinc-950 dark:to-zinc-900 border-b border-slate-200/60 dark:border-zinc-800/40 transition-colors duration-300">
        <div className="container mx-auto max-w-7xl space-y-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left space-y-3">
              <span className="text-[10px] font-extrabold tracking-[0.2em] text-rose-600 dark:text-rose-400 uppercase bg-rose-500/10 dark:bg-rose-500/20 px-3.5 py-1.5 rounded-full inline-block">
                Our Specialists
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight font-outfit">
                Verified Specialists
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-md">
                Direct access to top verified medical professionals.
              </p>
            </div>
            <Link
              href="/find-doctors"
              className="border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full text-slate-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Browse All Directories</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDocs.map((doc) => (
              <div
                key={doc.id}
                className="group relative bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm rounded-md border border-slate-100 dark:border-zinc-800/45 shadow-md dark:shadow-black/35 overflow-hidden flex flex-col justify-between"
              >
                {/* Doctor Photo */}
                <div className="relative h-52 bg-slate-100 dark:bg-zinc-950 overflow-hidden">
                  <img
                    src={doc.profileImage}
                    alt={doc.doctorName}
                    className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <button
                    className="absolute top-3 right-3 h-8 w-8 rounded-md border border-slate-250/10 dark:border-zinc-800/30 bg-white/90 dark:bg-zinc-900/90 text-slate-450 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                    title="Save to favorites"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Doctor Details */}
                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <span className="inline-flex border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 rounded-md text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                      {doc.specialization}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
                      {doc.doctorName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/60">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-white/50 shrink-0" />
                      <span className="truncate font-medium">{doc.hospitalName}</span>
                    </div>
                  </div>

                  {/* Pricing and Stats */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/60 pt-4 text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-white/60">
                    <div>
                      <div className="text-[9px] text-slate-400 dark:text-white/40 lowercase font-medium">
                        consultation fee
                      </div>
                      <div className="font-extrabold text-slate-800 dark:text-white text-sm mt-0.5 flex items-center">
                        <i className="fa-solid fa-bangladeshi-taka-sign text-xs mr-0.5"></i>{doc.consultationFee}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 dark:text-white/40 lowercase font-medium">
                        experience
                      </div>
                      <div className="font-extrabold text-slate-800 dark:text-white text-sm mt-0.5">
                        {doc.experience} Yrs
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-slate-400 dark:text-white/40 lowercase font-medium flex items-center justify-end gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                        <span>rating</span>
                      </div>
                      <div className="font-extrabold text-slate-800 dark:text-white text-sm mt-0.5">
                        4.9
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/doctors/${doc.id}`}
                    className="flex w-full items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 text-white text-xs font-bold uppercase py-3 rounded-md hover:shadow-md hover:shadow-rose-500/10 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Book Appointment</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollAnimate>
  );
}
