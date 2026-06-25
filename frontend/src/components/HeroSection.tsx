"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import {
  Search,
  Laptop,
  BriefcaseMedical,
  Stethoscope,
  HeartPulse,
  Calendar,
  Bed,
  Award,
  Plus,
  ChevronLeft,
  ChevronRight,
  Zap,
  UserPlus,
  CalendarCheck,
  Users,
  FileText,
  FlaskConical,
  Pill,
  Clock,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

const BANNER_IMAGES = [
  "/banner-1.png",
  "/banner-2.png",
  "/banner-3.png",
  "/banner-4.png",
  "/banner-5.png",
];

export default function HeroSection() {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/find-doctors?search=${encodeURIComponent(searchVal)}`);
    } else {
      router.push("/find-doctors");
    }
  };

  const quickAccessItems = [
    {
      label: "Add Patient",
      icon: UserPlus,
      href: "/dashboard/admin",
      color: "text-emerald-500",
    },
    {
      label: "Book Appointment",
      icon: CalendarCheck,
      href: "/find-doctors",
      color: "text-violet-500",
    },
    {
      label: "Patient Queue",
      icon: Users,
      href: "/dashboard/doctor",
      color: "text-amber-500",
    },
    {
      label: "Billing & Invoice",
      icon: FileText,
      href: "/dashboard/patient/payments",
      color: "text-blue-500",
    },
    {
      label: "Lab Reports",
      icon: FlaskConical,
      href: "/dashboard/patient/prescriptions",
      color: "text-rose-500",
    },
    {
      label: "Pharmacy",
      icon: Pill,
      href: "/dashboard/pharmacist",
      color: "text-teal-500",
    },
    {
      label: "Admissions",
      icon: Bed,
      href: "/dashboard/admin",
      color: "text-indigo-500",
    },
  ];

  const metricItems = [
    {
      label: "Total Patients",
      value: "12,540",
      trend: "↑ 12.5%",
      trendUp: true,
      subtext: "vs last month",
      icon: Users,
      color: "text-violet-500",
    },
    {
      label: "Appointments",
      value: "2,340",
      trend: "↑ 8.2%",
      trendUp: true,
      subtext: "vs last month",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      label: "Revenue",
      value: "$48,750",
      trend: "↑ 15.3%",
      trendUp: true,
      subtext: "vs last month",
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      label: "Bed Occupancy",
      value: "78%",
      trend: "↑ 5.7%",
      trendUp: true,
      subtext: "vs last month",
      icon: Bed,
      color: "text-amber-500",
    },
    {
      label: "Avg. Wait Time",
      value: "18 min",
      trend: "↓ 12.4%",
      trendUp: false,
      subtext: "vs last month",
      icon: Clock,
      color: "text-rose-500",
    },
    {
      label: "Patient Satisfaction",
      value: "96%",
      trend: "↑ 3.2%",
      trendUp: true,
      subtext: "vs last month",
      icon: Award,
      color: "text-teal-500",
    },
  ];

  return (
    <div className="w-full space-y-8 bg-slate-50/30 dark:bg-zinc-950 pb-16 transition-colors duration-300">
      {/* 1. Hero / Banner Section */}
      <section className="relative w-full overflow-hidden flex items-center pt-8 max-w-7xl mx-auto px-0">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-stretch w-full">
          {/* Left Column (Yellow border, 40% width, 450px height) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 h-[450px]">
            <div className="space-y-5">
              {/* Welcome badge */}
              <div className="border-l-[3.5px] border-indigo-650 pl-3">
                <span className="text-[11px] sm:text-xs font-bold text-rose-500 dark:text-rose-500   uppercase tracking-widest block">
                  WELCOME TO MEDICARE HOSPITAL
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-outfit font-bold tracking-tight text-slate-800 dark:text-white leading-tight">
                Smart Hospital. <br />
                Better Care.
              </h1>

              {/* Description */}
              <p className="text-[13px] sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-semibold">
                Streamline operations, improve patient outcomes, and deliver
                exceptional care with our all-in-one hospital management
                solution.
              </p>

              {/* Buttons with text-white on light theme for the left one */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/find-doctors"
                  className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider rounded-[10px] transition-all shadow-md shadow-indigo-650/10 cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-white" />{" "}
                  <span className="text-white">New Appointment</span>
                </Link>
                <Link
                  href="/find-doctors"
                  className="border-0 hover:border-0 bg-white dark:bg-zinc-800/50 hover:bg-indigo-50/40 dark:hover:bg-zinc-800/70 text-rose-500 dark:text-rose-500    px-5 py-3.5 text-xs font-bold uppercase tracking-wider rounded-[10px] transition-all cursor-pointer"
                >
                  View Today's Schedule
                </Link>
              </div>
            </div>

            {/* Banner Stats Below Buttons */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-6 border-t border-slate-100 dark:border-zinc-900/80">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 bg-indigo-50 dark:bg-indigo-950/40 rounded-[10px] flex items-center justify-center text-rose-500 shrink-0">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-850 dark:text-white leading-none">
                    125
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 mt-1 uppercase tracking-wide">
                    Today's Appointments
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 bg-indigo-50 dark:bg-indigo-950/40 rounded-[10px] flex items-center justify-center text-rose-500 shrink-0">
                  <Stethoscope className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-850 dark:text-white leading-none">
                    18
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 mt-1 uppercase tracking-wide">
                    Doctors Available
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 bg-indigo-50 dark:bg-indigo-950/40 rounded-[10px] flex items-center justify-center text-rose-500 shrink-0">
                  <Bed className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-850 dark:text-white leading-none">
                    8
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 mt-1 uppercase tracking-wide">
                    Rooms Available
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 bg-indigo-50 dark:bg-indigo-950/40 rounded-[10px] flex items-center justify-center text-rose-500 shrink-0">
                  <Award className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-850 dark:text-white leading-none">
                    96%
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 mt-1 uppercase tracking-wide">
                    Patient Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Image Slider + Toggle Panel */}
          <div className="lg:col-span-6 relative z-10 flex items-stretch h-[450px]">
            <div className="relative w-full h-full rounded-[10px] overflow-hidden shadow-lg border-0 flex-1">
              {/* Swiper Slider */}
              <Swiper
                modules={[Autoplay, Navigation]}
                navigation={{
                  prevEl: "#hero-slider-prev",
                  nextEl: "#hero-slider-next",
                }}
                loop={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                className="w-full h-full absolute inset-0"
              >
                {BANNER_IMAGES.map((imgSrc, idx) => (
                  <SwiperSlide key={idx} className="w-full h-full">
                    <img
                      src={imgSrc}
                      alt={`Medicare Hospital Slider ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Slider dark overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-905/45 via-transparent to-transparent pointer-events-none z-10" />

              {/* Top Right slider nav buttons */}
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                  id="hero-slider-prev"
                  className="h-7 w-7 bg-white/90 hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 rounded-[10px] border border-slate-200 dark:border-zinc-800 flex items-center justify-center shadow-xs cursor-pointer transition-all hover:scale-105"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
                <button
                  id="hero-slider-next"
                  className="h-7 w-7 bg-white/90 hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 rounded-[10px] border border-slate-200 dark:border-zinc-800 flex items-center justify-center shadow-xs cursor-pointer transition-all hover:scale-105"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* ── Hamburger Toggle Button ── */}
              <button
                onClick={() => setPanelOpen((v) => !v)}
                className="absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200/40 dark:border-zinc-700/40 rounded-[10px] px-3.5 py-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white dark:hover:bg-zinc-900 group cursor-pointer"
                aria-label="Toggle doctor search panel"
              >
                {panelOpen ? (
                  <X className="h-4 w-4 text-rose-500 transition-transform duration-200 rotate-0" />
                ) : (
                  <Menu className="h-4 w-4 text-rose-500 transition-transform duration-200" />
                )}
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-zinc-200 group-hover:text-rose-500 transition-colors">
                  {panelOpen ? "Close" : "Find a Doctor"}
                </span>
              </button>

              {/* ── Collapsible FIND A DOCTOR Panel ── */}
              <div
                className={`absolute right-4 z-20 w-[calc(100%-2rem)] sm:w-[340px] bg-[#EBEAEF]/97 dark:bg-zinc-900/97 backdrop-blur-md rounded-[10px] shadow-2xl border border-slate-200/20 dark:border-zinc-800/25 transition-all duration-300 origin-bottom-right ${
                  panelOpen
                    ? "opacity-100 scale-100 pointer-events-auto bottom-16"
                    : "opacity-0 scale-95 pointer-events-none bottom-10"
                }`}
              >
                <div className="p-4 space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-rose-500">
                    FIND A DOCTOR AND SCHEDULE
                  </h3>

                  {/* Search Form */}
                  <form
                    onSubmit={handleSearchSubmit}
                    className="relative flex items-center border border-slate-300 dark:border-zinc-700 rounded-[10px] overflow-hidden bg-white dark:bg-zinc-950 shadow-xs"
                  >
                    <input
                      type="text"
                      placeholder="Doctor name, condition or specialty..."
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      className="w-full bg-transparent pl-3 pr-10 py-2.5 text-[11px] outline-none border-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-medium"
                    />
                    <button
                      type="submit"
                      className="absolute right-0 top-0 bottom-0 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-rose-500 transition-colors border-l border-slate-300 dark:border-zinc-700 flex items-center justify-center cursor-pointer rounded-r-[10px]"
                    >
                      <Search className="h-3.5 w-3.5" />
                    </button>
                  </form>

                  {/* Popular Tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["Orthopedics", "Heart & Vascular", "Cancer"].map((tag) => (
                      <Link
                        key={tag}
                        href={`/find-doctors?search=${encodeURIComponent(tag)}`}
                        className="border border-black/10 dark:border-white/20 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-500 bg-white dark:bg-zinc-950 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm transition-all"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>

                  {/* 2x2 Quick Links Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/find-doctors?type=virtual" className="flex items-center gap-2 px-2.5 py-2 rounded-[10px] border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-rose-400/40 hover:bg-rose-50/30 transition-all shadow-xs group">
                      <Laptop className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-200 leading-snug group-hover:text-rose-500">Virtual care 24/7</span>
                    </Link>
                    <Link href="/find-doctors?type=specialty" className="flex items-center gap-2 px-2.5 py-2 rounded-[10px] border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-rose-400/40 hover:bg-rose-50/30 transition-all shadow-xs group">
                      <BriefcaseMedical className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-200 leading-snug group-hover:text-rose-500">Specialty care</span>
                    </Link>
                    <Link href="/find-doctors?type=primary" className="flex items-center gap-2 px-2.5 py-2 rounded-[10px] border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-rose-400/40 hover:bg-rose-50/30 transition-all shadow-xs group">
                      <Stethoscope className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-200 leading-snug group-hover:text-rose-500">Primary care</span>
                    </Link>
                    <Link href="/find-doctors?type=urgent" className="flex items-center gap-2 px-2.5 py-2 rounded-[10px] border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-rose-400/40 hover:bg-rose-50/30 transition-all shadow-xs group">
                      <HeartPulse className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-200 leading-snug group-hover:text-rose-500">Urgent care</span>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Access Section (Lime Green border - Glassmorphism, borderless, shadow-lg, no icon bg) */}
      <section className="max-w-7xl mx-auto px-0 w-full pt-4">
        <div className="bg-white/85 dark:bg-zinc-900/70 backdrop-blur-md border-0 rounded-[10px] p-5 md:p-6 shadow-[0_5px_50px_-15px_rgba(0,0,0,0.3)] dark:shadow-black/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors duration-300">
          {/* Quick Access Left Label block */}
          <div className="flex items-center gap-2.5 shrink-0 lg:pr-6">
            <Zap className="h-5 w-5 text-rose-500 dark:text-indigo-450 fill-indigo-650/10" />
            <span className="text-[14px] font-black text-slate-800 dark:text-white uppercase tracking-wider font-outfit">
              Quick Access
            </span>
          </div>

          {/* Quick Access buttons - horizontal line (No BG for icons, borderless) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 flex-1">
            {quickAccessItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="flex flex-col items-center justify-center text-center p-3 rounded-[10px] hover:bg-slate-100/50 dark:hover:bg-zinc-800/40 transition-colors group cursor-pointer"
              >
                {/* Notice: NO BG FOR ICONS */}
                <item.icon
                  className={`h-6.5 w-6.5 ${item.color} group-hover:scale-110 transition-transform`}
                />
                <span className="text-[11.5px] font-bold text-slate-600 dark:text-zinc-400 mt-2 block leading-tight">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Metrics Statistics Section (Purple border - Glassmorphism, borderless, shadow-md, no icon bg) */}
      <section className="max-w-7xl mx-auto px-0 w-full pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {metricItems.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white/75 dark:bg-zinc-900/70 backdrop-blur-md border-0 rounded-[10px] p-4.5 flex items-start gap-3.5 shadow-md dark:shadow-black/20 hover:shadow-lg transition-all duration-300"
            >
              {/* Metric Icon (No BG, No outlines) */}
              <metric.icon
                className={`h-6.5 w-6.5 ${metric.color} shrink-0 mt-0.5`}
              />

              {/* Metric Info Content */}
              <div className="space-y-1 overflow-hidden min-w-0">
                <span className="text-[10.5px] font-bold text-slate-500 dark:text-zinc-550 uppercase tracking-wider block truncate">
                  {metric.label}
                </span>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-none">
                    {metric.value}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold leading-none ${metric.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-500 "}`}
                  >
                    {metric.trend}
                  </span>
                </div>

                <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 block">
                  {metric.subtext}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
