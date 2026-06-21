'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import ScrollAnimate from './ScrollAnimate';

import 'swiper/css';

export default function TestimonialsSection() {
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const mockReviews = [
    {
      id: 'rev-1',
      reviewText: "The most professional and compassionate experience of my life, my doctor treated me with such informed kindness. I really appreciate her time and expertise as well as finding a therapy provider in the network where others said there were none.",
      location: "Wilmington, NC"
    },
    {
      id: 'rev-2',
      reviewText: "I already have recommended my doctor to my friends. I trust her knowledge and experience, and she took time to question me about history and going forward. I am extremely confident in the direction we are going.",
      location: "Charlotte, NC"
    },
    {
      id: 'rev-3',
      reviewText: "Very professional and prompt. The doctor took her time and listened to all my concerns, and she explained the treatment plan clearly. Excellent clinic environment!",
      location: "Raleigh, NC"
    },
    {
      id: 'rev-4',
      reviewText: "Excellent care from registration to checkout. Highly recommend this team of expert physicians and nurses for anyone seeking top-quality patient services.",
      location: "Winston-Salem, NC"
    }
  ];

  return (
    <ScrollAnimate>
      <section className="py-16 px-6 lg:px-8 space-y-8 bg-transparent select-none">
        <div className="container space-y-3">
          <div className="flex items-center gap-1.5 text-[#D81B60] font-bold text-xs uppercase tracking-wider">
            <span className="text-sm font-black">+</span>
            <span>Care in Action</span>
          </div>
          <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-zinc-100 font-outfit tracking-tight">
            Why patients choose our expert care
          </h2>
          <p className="text-xs md:text-sm text-slate-550 dark:text-zinc-400 max-w-3xl leading-relaxed">
            With the most 5-star hospitals in the Carolinas, our commitment to quality, safety
            and compassion shows in every experience. Patients consistently choose and
            recommend Novant Health for expert, trusted care.
          </p>
        </div>

        <div className="container">
          <div className="w-full">
            <Swiper
              onSwiper={setSwiperRef}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              modules={[Autoplay]}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
              }}
              loop={true}
              spaceBetween={24}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2.5 }
              }}
              className="w-full pb-4"
            >
              {mockReviews.map((rev) => (
                <SwiperSlide key={rev.id}>
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/85 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 min-h-[240px] flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Lilac Quote Mark */}
                      <div className="text-5xl font-serif text-[#C5B3E6] dark:text-purple-900/40 leading-none select-none h-4">
                        “
                      </div>
                      <p className="text-[13px] md:text-[14px] text-slate-700 dark:text-zinc-300 leading-relaxed font-medium pt-1">
                        {rev.reviewText}
                      </p>
                    </div>
                    
                    <div className="space-y-0.5 pt-3 border-t border-slate-100 dark:border-zinc-800/60">
                      <div className="text-xs font-bold text-slate-900 dark:text-zinc-200">
                        Verified patient
                      </div>
                      <div className="text-[11px] text-slate-455 dark:text-zinc-500 font-semibold">
                        {rev.location}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Custom Pagination Indicator Controls at bottom center */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {/* Previous Slide Button */}
            <button
              onClick={() => swiperRef?.slidePrev()}
              className="h-9 w-9 rounded-full border border-slate-300 dark:border-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-450 hover:bg-[#4A2E80]/5 dark:hover:bg-zinc-800 hover:border-[#4A2E80] dark:hover:border-purple-500 hover:text-[#4A2E80] dark:hover:text-purple-400 transition-all cursor-pointer bg-white dark:bg-zinc-900"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>

            {/* Line indicator bars */}
            <div className="flex items-center gap-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeIndex % 4 === idx
                      ? 'w-8 bg-[#4A2E80] dark:bg-purple-400'
                      : 'w-6 bg-purple-100 dark:bg-zinc-800/80'
                  }`}
                />
              ))}
            </div>

            {/* Next Slide Button */}
            <button
              onClick={() => swiperRef?.slideNext()}
              className="h-9 w-9 rounded-full border border-slate-300 dark:border-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-450 hover:bg-[#4A2E80]/5 dark:hover:bg-zinc-800 hover:border-[#4A2E80] dark:hover:border-purple-500 hover:text-[#4A2E80] dark:hover:text-purple-400 transition-all cursor-pointer bg-white dark:bg-zinc-900"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </section>
    </ScrollAnimate>
  );
}
