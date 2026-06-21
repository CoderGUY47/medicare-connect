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
      <section className="w-full bg-zinc-950 text-white select-none border-b border-zinc-900 rounded-none py-16 md:py-24">
        
        {/* Swiper focus/height transitions via CSS */}
        <style>{`
          .testimonial-swiper .swiper-wrapper {
            align-items: flex-end !important;
          }
          .testimonial-swiper .swiper-slide {
            transition: opacity 0.5s ease;
            opacity: 0.6;
          }
          .testimonial-swiper .swiper-slide-active {
            opacity: 0.6;
          }
          /* The second card (on the right) is the active focal point */
          .testimonial-swiper .swiper-slide-next {
            opacity: 1 !important;
            z-index: 10;
          }
          .testimonial-swiper .review-card {
            height: 360px !important;
          }
          @media (max-width: 1023px) {
            .testimonial-swiper .swiper-wrapper {
              align-items: stretch !important;
            }
            .testimonial-swiper .swiper-slide {
              opacity: 1;
            }
            .testimonial-swiper .swiper-slide-active {
              opacity: 1;
            }
            .testimonial-swiper .swiper-slide-next {
              opacity: 1 !important;
            }
            .testimonial-swiper .review-card {
              height: 300px !important;
            }
          }
        `}</style>

        <div className="container mx-auto px-6 max-w-7xl space-y-10 rounded-none">
          {/* Header Block: Title/Description on Left, Navigation on Right */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs uppercase tracking-wider">
                <span className="text-sm font-black">+</span>
                <span>Care in Action</span>
              </div>
              <h2 className="text-2xl md:text-3.5xl font-black text-white font-outfit tracking-tight">
                Why patients choose our expert care
              </h2>
              <div className="text-base text-zinc-400 leading-relaxed font-semibold max-w-3xl">
                With the most 5-star hospitals in the Carolinas, our commitment to quality, safety
                and compassion shows in every experience. Patients consistently choose and
                recommend Novant Health for expert, trusted care.
              </div>
            </div>

            {/* Navigation controls aligned to the right of the header */}
            <div className="flex items-center gap-3 shrink-0 pb-1">
              <button
                onClick={() => swiperRef?.slidePrev()}
                className="h-9 w-9 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer rounded-none"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => swiperRef?.slideNext()}
                className="h-9 w-9 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer rounded-none"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
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
              spaceBetween={28}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 1.5 },
                1024: { slidesPerView: 2 }
              }}
              className="testimonial-swiper w-full pb-8 pt-4 animate-fade-in"
            >
              {mockReviews.map((rev) => (
                <SwiperSlide key={rev.id}>
                  <div className="review-card bg-zinc-900 border border-zinc-800/80 flex items-stretch overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-full rounded-none">
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
      </section>
    </ScrollAnimate>
  );
}
