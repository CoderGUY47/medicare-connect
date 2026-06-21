'use client';

import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { ShieldCheck, Clock, CreditCard, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-fade';

const CAPABILITIES_DATA = [
  {
    num: "01",
    label: "Security Board",
    title: "Credential Verification Protocol",
    icon: ShieldCheck,
    image: "/assets/capabilities/credential_verification.png",
    context: "Every healthcare professional registering on our platform undergoes a rigorous multi-tier verification process. We cross-verify state license boards, medical education credentials, and board certifications to ensure only verified experts deliver care.",
    specs: [
      { label: "Board Verification", val: "100% Certified" },
      { label: "Compliance Standard", val: "HIPAA Compliant" },
      { label: "Verification Latency", val: "Under 24 Hours" }
    ]
  },
  {
    num: "02",
    label: "Direct Scheduler",
    title: "Direct Time Lock Canvas",
    icon: Clock,
    image: "/assets/capabilities/time_lock_scheduling.png",
    context: "Bypass waitlists and call queues with our real-time scheduling canvas. Doctors set active shifts and clinical hours directly, allowing patients to secure instant time slots that sync across patient and clinician calendars instantly.",
    specs: [
      { label: "Slot Lock Integrity", val: "Double-booking Blocked" },
      { label: "Calendar Integration", val: "Google Sync & Outlook" },
      { label: "Queue Optimization", val: "Instant Booking" }
    ]
  },
  {
    num: "03",
    label: "Stripe Billing",
    title: "Simulated Payment Operations",
    icon: CreditCard,
    image: "/assets/capabilities/payment_operations.png",
    context: "Experience seamless checkout flows with simulated Stripe integrations. Secure patient billing tokens are processed instantly during appointment booking, generating structured invoices and managing automatic refunds or fee captures.",
    specs: [
      { label: "Transaction Encryption", val: "End-to-End SSL" },
      { label: "Payment Platform", val: "Stripe Simulation API" },
      { label: "Refund Management", val: "Automated Invoices" }
    ]
  },
  {
    num: "04",
    label: "Security Vault",
    title: "Encrypted Records Vault",
    icon: Lock,
    image: "/assets/capabilities/encrypted_vault.png",
    context: "Keep electronic health records and diagnostic laboratory results private with advanced data security. Structured medical files, prescriptions, and lab telemetry are encrypted, giving you full control over access permissions.",
    specs: [
      { label: "Encryption Cipher", val: "AES-256 Bit" },
      { label: "Patient Access Control", val: "Immutable Permission Keys" },
      { label: "EHR Synced Logs", val: "100% Auditable History" }
    ]
  }
];

export default function CapabilitiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <section className="w-full bg-zinc-950 text-white select-none border-b border-zinc-900 rounded-none">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[550px] rounded-none">
        
        {/* Left half: Context and Info data (centered wrapper) */}
        <div className="w-full flex justify-start lg:justify-end bg-zinc-950 py-16 md:py-24 rounded-none">
          <div className="w-full lg:max-w-[650px] px-6 md:px-12 lg:px-16 flex flex-col justify-between space-y-10 z-25 relative rounded-none">
            <div className="space-y-6">
              {/* Header Chip */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold tracking-[0.25em] text-rose-500 uppercase bg-rose-950/20 px-3 py-1 border border-rose-950/40 rounded-none inline-block">
                  Platform Workflow
                </span>
                <h2 className="text-2xl md:text-3.5xl font-black tracking-tight font-outfit text-white">
                  System Capabilities
                </h2>
              </div>

              {/* Dynamic Content Block with fade transitions */}
              <div className="space-y-5 transition-all duration-500 min-h-[220px]">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-extrabold text-rose-500 uppercase tracking-widest block">
                    {CAPABILITIES_DATA[activeIndex].num} / {CAPABILITIES_DATA[activeIndex].label}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold tracking-tight text-white leading-snug">
                    {CAPABILITIES_DATA[activeIndex].title}
                  </h3>
                </div>
                <div className="text-base text-zinc-400 leading-relaxed font-semibold max-w-xl">
                  {CAPABILITIES_DATA[activeIndex].context}
                </div>

                {/* Specs Table */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-900">
                  {CAPABILITIES_DATA[activeIndex].specs.map((spec, index) => (
                    <div key={index} className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">{spec.label}</span>
                      <span className="text-xs font-bold text-white block">{spec.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Connected Slide selectors & Custom Arrow controls */}
            <div className="space-y-6 pt-6 border-t border-zinc-900">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Tab Selector Links */}
                <div className="flex items-center space-x-1.5 md:space-x-3.5 font-mono text-[10px] font-extrabold tracking-wider uppercase text-zinc-500">
                  {CAPABILITIES_DATA.map((cap, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTabClick(idx)}
                      className={`pb-1 transition-all border-b-2 cursor-pointer ${
                        idx === activeIndex 
                          ? 'border-rose-600 text-white font-black scale-105' 
                          : 'border-transparent hover:text-zinc-350'
                      } rounded-none`}
                    >
                      {cap.num}
                    </button>
                  ))}
                </div>

                {/* Slider Navigation Arrows - strictly rounded-none */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrev}
                    className="h-9 w-9 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer rounded-none"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="h-9 w-9 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer rounded-none"
                    title="Next Slide"
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right part: Swiper slider with Images - strictly rounded-none */}
        <div className="relative h-[380px] lg:h-auto min-h-[380px] z-10 rounded-none overflow-hidden select-none">
          {/* Subtle gradient overlay on right side to blend with left black side */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent z-10 pointer-events-none rounded-none" />
          
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
            className="w-full h-full rounded-none"
          >
            {CAPABILITIES_DATA.map((cap, idx) => (
              <SwiperSlide key={idx} className="w-full h-full bg-zinc-950 rounded-none">
                <img
                  src={cap.image}
                  alt={cap.title}
                  className="w-full h-full object-cover object-center rounded-none"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}
