'use client';

import React, { useEffect, useState } from 'react';
import { Star, Quote, HeartPulse } from 'lucide-react';
import { db, Review } from '../lib/mockDb';
import ScrollAnimate from './ScrollAnimate';

export default function SuccessStories() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://backend-nu-rosy-20.vercel.app/reviews');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            // Translate database field names if they vary, fallback to standard mock format
            const normalized = data.map((item: any, index: number) => ({
              id: item._id || item.id || `rev-${index}`,
              patientName: item.patientName || item.userName || 'Anonymous Patient',
              patientPhoto: item.patientPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
              rating: item.rating || 5,
              reviewText: item.reviewText || item.comment || 'Excellent healthcare experience at MediCare Connect.',
              createdAt: item.createdAt || new Date().toISOString()
            }));
            setReviews(normalized);
            return;
          }
        }
      } catch (err) {
        console.log('Backend reviews fetch failed, falling back to local DB:', err);
      }

      // Fallback
      setReviews(db.getReviews());
    };

    fetchReviews();
  }, []);

  return (
    <ScrollAnimate>
      <section className="w-full bg-white dark:bg-zinc-900 text-slate-800 dark:text-white select-none border-b border-slate-200/60 dark:border-zinc-800/40 rounded-none py-16 md:py-20 transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-7xl space-y-10 rounded-none">
          {/* Header Block */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-500 font-bold text-xs uppercase tracking-wider">
              <span className="text-sm font-black">+</span>
              <span>Patient Success Stories</span>
            </div>
            <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">
              Real Stories, Real Results
            </h2>
            <p className="text-base text-slate-650 dark:text-zinc-400 leading-relaxed font-semibold max-w-3xl">
              Hear from our patients who have experienced quick booking, personalized specialist care plans, and secure online health records coordination.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-850 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 rounded-[10px] space-y-6"
              >
                <div className="space-y-4">
                  {/* Rating Stars & Quote */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rev.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-200 dark:text-zinc-800'
                          }`}
                        />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-rose-600/10 dark:text-rose-500/15 rotate-180" />
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-slate-600 dark:text-zinc-350 leading-relaxed font-medium">
                    "{rev.reviewText}"
                  </p>
                </div>

                {/* Profile Footer */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-zinc-850/60">
                  <img
                    src={rev.patientPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                    alt={rev.patientName}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-zinc-800 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[160px]">
                      {rev.patientName}
                    </h4>
                    <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide mt-0.5">
                      <HeartPulse className="h-2.5 w-2.5" /> Verified Care
                    </span>
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
