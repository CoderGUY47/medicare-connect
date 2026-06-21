'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import ScrollAnimate from './ScrollAnimate';

import 'swiper/css';

const mockReviews = [
  {
    id: 'rev-1',
    reviewText: "The most professional and compassionate experience of my life, my doctor treated me with such informed kindness. I really appreciate her time and expertise as well as finding a therapy provider in the network where others said there were none.",
    location: "Wilmington, NC",
    image: "/assets/doctors/dr_sarah_jenkins.png"
  },
  {
    id: 'rev-2',
    reviewText: "I already have recommended my doctor to my friends. I trust her knowledge and experience, and she took time to question me about history and going forward. I am extremely confident in the direction we are going.",
    location: "Charlotte, NC",
    image: "/assets/doctors/dr_arjun_patel.png"
  },
  {
    id: 'rev-3',
    reviewText: "Very professional and prompt. The doctor took her time and listened to all my concerns, and she explained the treatment plan clearly. Excellent clinic environment!",
    location: "Raleigh, NC",
    image: "/assets/doctors/dr_sophia_martinez.png"
  },
  {
    id: 'rev-4',
    reviewText: "Excellent care from registration to checkout. Highly recommend this team of expert physicians and nurses for anyone seeking top-quality patient services.",
    location: "Winston-Salem, NC",
    image: "/assets/doctors/dr_emily_taylor.png"
  }
];

export default function TestimonialsSection() {
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ScrollAnimate>
      <section className="w-full bg-zinc-950 text-white select-none border-b border-zinc-900 rounded-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch rounded-none">
          
          {/* Left half: Content, Header, and Slider */}
          <div className="lg:col-span-8 flex flex-col justify-between py-16 md:py-24 space-y-10 z-25 relative rounded-none pr-6 md:pr-12 lg:pr-16 pl-6 md:pl-12 lg:pl-[calc(max(4rem,(100vw-1300px)/2+4rem))]">
            
            <div className="space-y-8">
              {/* Title & Description Block */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs uppercase tracking-wider">
                  <span className="text-sm font-black">+</span>
                  <span>Care in Action</span>
                </div>
                <h2 className="text-2xl md:text-3.5xl font-black text-white font-outfit tracking-tight">
                  Why patients choose our expert care
                </h2>
                <div className="text-base text-zinc-400 leading-relaxed font-semibold max-w-2xl">
                  With the most 5-star hospitals in the Carolinas, our commitment to quality, safety
                  and compassion shows in every experience. Patients consistently choose and
                  recommend Novant Health for expert, trusted care.
                </div>
              </div>

              {/* Swiper Slider */}
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
                    640: { slidesPerView: 1.2 },
                    1024: { slidesPerView: 1.5 },
                    1440: { slidesPerView: 1.8 }
                  }}
                  className="w-full pb-4"
                >
                  {mockReviews.map((rev) => (
                    <SwiperSlide key={rev.id}>
                      <div className="bg-zinc-900 border border-zinc-800/80 flex items-stretch overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 min-h-[300px] md:min-h-[320px] w-full rounded-none">
                        {/* Left Part: Content */}
                        <div className="w-[65%] p-6 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            {/* Quote Mark */}
                            <div className="text-5xl font-serif text-rose-500/20 leading-none select-none h-4">
                              “
                            </div>
                            <div className="text-base text-zinc-350 leading-relaxed font-medium pt-1">
                              {rev.reviewText}
                            </div>
                          </div>
                          
                          <div className="space-y-0.5 pt-3 border-t border-zinc-800">
                            <div className="text-xs font-bold text-white">
                              Verified patient
                            </div>
                            <div className="text-[11px] text-zinc-500 font-semibold">
                              {rev.location}
                            </div>
                          </div>
                        </div>

                        {/* Right Part: Image with Shade */}
                        <div className="w-[35%] relative min-h-full overflow-hidden select-none bg-zinc-950">
                          {/* Shade/gradient overlay to fade into the card's background */}
                          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-zinc-900 to-transparent z-10" />
                          <img
                            src={rev.image}
                            alt="Verified patient review context"
                            className="w-full h-full object-cover object-center grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* Custom Pagination Indicator Controls */}
            <div className="flex items-center justify-start gap-6 mt-6">
              {/* Previous Slide Button */}
              <button
                onClick={() => swiperRef?.slidePrev()}
                className="h-9 w-9 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer rounded-none"
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
                        ? 'w-8 bg-rose-600'
                        : 'w-6 bg-zinc-800'
                    }`}
                  />
                ))}
              </div>

              {/* Next Slide Button */}
              <button
                onClick={() => swiperRef?.slideNext()}
                className="h-9 w-9 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer rounded-none"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>

          </div>

          {/* Right part: Shaded image */}
          <div className="lg:col-span-4 relative h-[380px] lg:h-auto min-h-[380px] z-10 rounded-none overflow-hidden select-none animate-fade-in">
            {/* Subtle gradient overlay on left side to blend with left black side */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent z-10 pointer-events-none rounded-none" />
            <img
              src="/assets/testimonials_banner.png"
              alt="Verified medical care review"
              className="w-full h-full object-cover object-center rounded-none"
            />
          </div>

        </div>
      </section>
    </ScrollAnimate>
  );
}
