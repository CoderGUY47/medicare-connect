'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Laptop, BriefcaseMedical, Stethoscope, HeartPulse } from 'lucide-react';
import BannerStats from './BannerStats';

export default function HeroSection() {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/find-doctors?search=${encodeURIComponent(searchVal)}`);
    } else {
      router.push('/find-doctors');
    }
  };

  return (
    <section className="relative w-full bg-zinc-950 overflow-hidden min-h-[650px] flex items-center">
      {/* Right side background image with gradient fade (desktop only) */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-[52%] z-0">
        {/* Gradient fade overlay (desktop) */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10 hidden md:block" />
        {/* Mobile tint overlay */}
        <div className="absolute inset-0 bg-zinc-950/60 md:hidden z-10" />
        <img
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200"
          alt="Doctor Consulting Family"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Hero Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left side text column */}
          <div className="md:col-span-7 space-y-6 animate-fade-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black tracking-tight text-white leading-tight">
              Best Physicians. Amazing <br />
              Nurses. Remarkable Care.
            </h1>
            <p className="text-sm md:text-base text-zinc-300 max-w-lg leading-relaxed font-semibold">
              Whether you need a check-up, sick visit, urgent care or referral to a specialist, our expert team is ready 24/7 with flexible appointments.
            </p>
          </div>
          
          {/* Right side search card column */}
          <div className="md:col-span-5 animate-fade-up z-20">
            <div className="bg-[#EBEAEF] text-slate-800 p-4.5 rounded-lg shadow-xl space-y-3.5 max-w-md border border-slate-200/50 transition-all duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600">
                Find a doctor and schedule
              </h3>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                <input
                  type="text"
                  placeholder="Enter any doctor name, condition, or specialty"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-white pl-4 pr-14 py-3.5 text-sm outline-none border-none text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 px-4 bg-[#DFDEE3] hover:bg-[#D0CFD4] text-rose-600 transition-colors border-l border-slate-300 flex items-center justify-center cursor-pointer"
                >
                  <Search className="h-4.5 w-4.5" />
                </button>
              </form>

              {/* Popular Tags / Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                {['Orthopedics', 'Heart & Vascular', 'Cancer'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/find-doctors?search=${tag}`}
                    className="border border-rose-600 hover:bg-rose-50 text-rose-600 bg-white px-3 py-1 rounded-full transition-all text-xs"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              {/* 2x2 Grid of Quick Service Access Links */}
              <div className="grid grid-cols-2 gap-2.5 pt-1.5">
                <Link
                  href="/find-doctors?type=virtual"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-rose-500/5 hover:border-rose-500/50 transition-all group shadow-sm"
                >
                  <Laptop className="h-5 w-5 text-rose-600 shrink-0" />
                  <span className="text-[12px] font-bold text-rose-600 leading-snug">
                    Get virtual care 24/7
                  </span>
                </Link>

                <Link
                  href="/find-doctors?type=specialty"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-rose-500/5 hover:border-rose-500/50 transition-all group shadow-sm"
                >
                  <BriefcaseMedical className="h-5 w-5 text-rose-600 shrink-0" />
                  <span className="text-[12px] font-bold text-rose-600 leading-snug">
                    Explore specialty care
                  </span>
                </Link>

                <Link
                  href="/find-doctors?type=primary"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-rose-500/5 hover:border-rose-500/50 transition-all group shadow-sm"
                >
                  <Stethoscope className="h-5 w-5 text-rose-600 shrink-0" />
                  <span className="text-[12px] font-bold text-rose-600 leading-snug">
                    Find primary care
                  </span>
                </Link>

                <Link
                  href="/find-doctors?type=urgent"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-rose-500/5 hover:border-rose-500/50 transition-all group shadow-sm"
                >
                  <HeartPulse className="h-5 w-5 text-rose-600 shrink-0" />
                  <span className="text-[12px] font-bold text-rose-600 leading-snug">
                    Find urgent care
                  </span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right side background image spacing adjustment */}
          <div className="hidden md:block md:col-span-0" />
        </div>

        {/* Pink slide indicator at the bottom center of the banner */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center z-20">
          <div className="h-1.5 w-16 bg-rose-600 rounded-full" />
        </div>

        {/* Banner Stats Container */}
        <div className="w-full mt-10">
          <BannerStats />
        </div>
      </div>
    </section>
  );
}
