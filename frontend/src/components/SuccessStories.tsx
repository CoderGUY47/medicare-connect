'use client';

import React, { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, HeartPulse } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { FaQuoteLeft } from 'react-icons/fa';
import { db, Review } from '../lib/mockDb';
import ScrollAnimate from './ScrollAnimate';

import 'swiper/css';

export default function SuccessStories() {
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://backend-nu-rosy-20.vercel.app/reviews');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
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

  // Duplicate the reviews array if there are 3 or fewer reviews to ensure
  // Swiper has enough slides to loop and slide smoothly in all viewports.
  const displayReviews = reviews.length > 0 && reviews.length <= 3
    ? [...reviews, ...reviews, ...reviews]
    : reviews;

  return (
    <ScrollAnimate>
      <section className="w-full bg-white dark:bg-zinc-950 text-slate-800 dark:text-white select-none border-b border-slate-200/60 dark:border-zinc-900 rounded-none py-16 md:py-20 transition-colors duration-300">

        {/* Style block for stories-swiper height stability to prevent screen jumping */}
        <style>{`
          .stories-swiper {
            height: 380px;
          }
          .stories-swiper .swiper-slide {
            height: 100% !important;
          }
          @media (min-width: 1024px) {
            .stories-swiper {
              height: 350px;
            }
          }
        `}</style>

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

          {/* Swiper Slider Wrapper */}
          <div className="w-full">
            <Swiper
              onSwiper={setSwiperRef}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              modules={[Autoplay]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={displayReviews.length > 3}
              spaceBetween={24}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              className="stories-swiper w-full pb-6 pt-2"
            >
              {displayReviews.map((rev, idx) => (
                <SwiperSlide key={`${rev.id}-${idx}`}>
                  <div className="relative bg-slate-50 dark:bg-zinc-900 border-none p-6 flex flex-col justify-between h-[340px] lg:h-[310px] shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 rounded-[12px] overflow-hidden group">
                    <div className="space-y-4">
                      {/* Rating Stars & Quote */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < rev.rating
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-slate-200 dark:text-zinc-800'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-rose-500/10 dark:text-white/60 group-hover:text-rose-500/25 transition-colors">
                          <FaQuoteLeft className="h-10 w-10" />
                        </div>
                      </div>

                      {/* Review Text */}
                      <p className="text-sm sm:text-base text-black/60 dark:text-white/60 leading-relaxed font-semibold italic line-clamp-5">
                        "{rev.reviewText}"
                      </p>
                    </div>

                    {/* Profile Footer */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50 dark:border-zinc-800/80">
                      <img
                        src={rev.patientPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                        alt={rev.patientName}
                        className="h-10 w-10 rounded-full object-cover border border-slate-250/20 dark:border-zinc-800 grayscale group-hover:grayscale-0 transition-all duration-500 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate">
                          {rev.patientName}
                        </h4>
                        <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-1.5 py-0.5 text-[8px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide mt-0.5">
                          <HeartPulse className="h-2.5 w-2.5" /> Verified Care
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Slider Pagination & Arrow Controls */}
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-6 pt-2">
              {/* Prev Button */}
              <button
                onClick={() => swiperRef?.slidePrev()}
                className="h-9 w-9 border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-slate-400 dark:hover:border-zinc-700 text-slate-650 dark:text-zinc-300 hover:text-rose-650 dark:hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer rounded-none"
                aria-label="Previous story"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(reviews.length, 6) }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeIndex % Math.min(reviews.length, 6) === idx
                        ? 'w-6 bg-rose-655'
                        : 'w-2 bg-slate-200 dark:bg-zinc-800'
                    }`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => swiperRef?.slideNext()}
                className="h-9 w-9 border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-slate-400 dark:hover:border-zinc-700 text-slate-655 dark:text-zinc-300 hover:text-rose-655 dark:hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer rounded-none"
                aria-label="Next story"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          )}

        </div>
      </section>
    </ScrollAnimate>
  );
}
