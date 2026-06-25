"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Stethoscope,
  CalendarCheck,
  FileText,
  FlaskConical,
  Video,
  ShieldPlus,
  ArrowRight,
  CheckCircle2,
  Phone,
} from "lucide-react";

const SERVICES = [
  {
    num: "01",
    title: "Find Doctors",
    desc: "Browse verified specialists by department, location, and availability.",
    href: "/find-doctors",
    icon: Stethoscope,
    iconColor: "text-rose-300",
    tag: "Doctors",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
    gradient: "from-rose-900/80 via-rose-800/50 to-transparent",
  },
  {
    num: "02",
    title: "Book Appointment",
    desc: "Reserve real-time consultation slots with zero wait queues.",
    href: "/find-doctors",
    icon: CalendarCheck,
    iconColor: "text-sky-300",
    tag: "Scheduling",
    image: "https://images.unsplash.com/photo-1588776814546-1ffbb172dba4?auto=format&fit=crop&q=80&w=800",
    gradient: "from-sky-900/80 via-sky-800/50 to-transparent",
  },
  {
    num: "03",
    title: "Patient Records",
    desc: "Access encrypted medical history, prescriptions, and lab reports securely.",
    href: "/login",
    icon: FileText,
    iconColor: "text-emerald-300",
    tag: "Records",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    gradient: "from-emerald-900/80 via-emerald-800/50 to-transparent",
  },
  {
    num: "04",
    title: "Telemedicine",
    desc: "Get 24/7 on-demand video consultations with licensed physicians anywhere.",
    href: "/find-doctors?type=virtual",
    icon: Video,
    iconColor: "text-violet-300",
    tag: "Virtual Care",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
    gradient: "from-violet-900/80 via-violet-800/50 to-transparent",
  },
  {
    num: "05",
    title: "Lab & Diagnostics",
    desc: "Book lab tests, track sample status, and view certified results online.",
    href: "/login",
    icon: FlaskConical,
    iconColor: "text-amber-300",
    tag: "Lab Tests",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=800",
    gradient: "from-amber-900/80 via-amber-800/50 to-transparent",
  },
  {
    num: "06",
    title: "Emergency Care",
    desc: "Immediate critical care routing with direct hotline and nearest ER locator.",
    href: "/find-doctors?type=urgent",
    icon: ShieldPlus,
    iconColor: "text-red-300",
    tag: "Emergency",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800",
    gradient: "from-red-900/80 via-red-800/50 to-transparent",
  },
];

const TRUST_POINTS = [
  "HIPAA-Compliant & Encrypted",
  "Board-Certified Specialists",
  "24/7 Patient Support",
];

export default function ServicePortals() {
  return (
    <section className="w-full relative overflow-hidden border-0">
      {/* Section-level glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">

        {/* ── Top Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14"
        >
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-rose-500 block" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">
                Patient Services
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-outfit font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              Patient Care Services
              <br className="hidden sm:block" />
              <span className="text-rose-500">&amp; Management</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-xl font-medium">
              One unified portal to find specialists, book appointments, review
              records, and connect with care teams — fast, secure, always available.
            </p>
          </div>

          {/* Trust Pills — glassmorphism pill */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-2 shrink-0 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl px-5 py-4 border-0 shadow-lg shadow-black/5"
          >
            {TRUST_POINTS.map((pt) => (
              <div key={pt} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">{pt}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Main Grid: Feature Left + Cards Right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Feature Column (left) */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* Hero Feature Card — image BG + glass content */}
            <div className="relative rounded-3xl overflow-hidden flex-1 min-h-[300px] border-0 shadow-2xl shadow-black/20">
              {/* BG image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800')" }}
              />
              {/* Dark gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-transparent" />

              {/* Glass content panel at bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/10 backdrop-blur-md border-0 p-6 m-3 rounded-2xl">
                <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-2 block">
                  Comprehensive Care
                </span>
                <h3 className="text-lg font-extrabold text-white leading-snug mb-2">
                  Your Complete Healthcare Hub
                </h3>
                <p className="text-[11px] text-white/70 leading-relaxed mb-4 font-medium">
                  Appointment booking to lab diagnostics — all secured in one place.
                </p>
                <Link
                  href="/find-doctors"
                  className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-200 self-start shadow-lg shadow-rose-500/40 group"
                >
                  Get Started
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Emergency Hotline — glassmorphism card */}
            <div className="relative rounded-3xl overflow-hidden border-0 shadow-xl shadow-black/15">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517120026326-d87759a7b63b?auto=format&fit=crop&q=80&w=800')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 to-slate-900/80" />
              <div className="relative z-10 p-5 flex items-center gap-4">
                {/* Glass icon */}
                <div className="h-12 w-12 rounded-2xl bg-red-500/20 backdrop-blur-md border-0 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mb-0.5">Emergency Hotline</p>
                  <a href="tel:911" className="text-xl font-black text-white hover:text-red-400 transition-colors tracking-wide block leading-none">
                    911
                  </a>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-medium">+880-1315478794</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards Grid (right 8 cols → 2×3) */}
          <motion.div
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {SERVICES.map((svc) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.num}
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.97 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                <Link
                  href={svc.href}
                  className="group relative overflow-hidden rounded-2xl border-0 shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1.5 transition-all duration-300 min-h-[240px] flex flex-col justify-end block"
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${svc.image})` }}
                  />

                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${svc.gradient}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Tag badge — top right glassmorphism */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-white/15 backdrop-blur-md text-white border-0 px-2.5 py-1 rounded-full">
                      {svc.tag}
                    </span>
                  </div>

                  {/* Number — top left */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="text-[10px] font-black font-mono text-white/40 tracking-widest">
                      {svc.num}
                    </span>
                  </div>

                  {/* Glass content panel at bottom */}
                  <div className="relative z-10 m-2.5 bg-white/10 backdrop-blur-md border-0 rounded-xl p-3.5 space-y-2">
                    {/* Icon row */}
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur-sm border-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className={`h-4 w-4 ${svc.iconColor}`} />
                      </div>
                      <h3 className="text-sm font-extrabold text-white leading-snug">
                        {svc.title}
                      </h3>
                    </div>

                    <p className="text-[10px] text-white/65 leading-relaxed font-medium">
                      {svc.desc}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-1.5 text-white/80 group-hover:text-white transition-colors pt-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                        Access Now
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
