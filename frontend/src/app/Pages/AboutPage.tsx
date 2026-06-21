'use client';

import React from 'react';
import { HeartPulse, Award, Users, CheckCircle, ShieldCheck, Stethoscope, Activity, Building, Shield } from 'lucide-react';
import ScrollAnimate from '../../components/ScrollAnimate';

export default function AboutPage() {
  const values = [
    {
      title: 'Clinical Excellence',
      desc: 'All consulting doctors undergo multi-step background validation, including credential auditing, board certification verification, and regular clinical review assessments.',
      icon: <ShieldCheck className="h-6 w-6 text-rose-500" />,
      bg: 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 dark:border-rose-500/30'
    },
    {
      title: 'Patient-First Focus',
      desc: 'Our portal respects your schedule. Choose from real-time calendar slots, manage consultations seamlessly, and coordinate care directly from your secure patient dashboard.',
      icon: <Users className="h-6 w-6 text-rose-500" />,
      bg: 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 dark:border-rose-500/30'
    },
    {
      title: 'Integrated Digital Health',
      desc: 'Access complete electronic medical logs, diagnosis histories, lab results, and e-prescriptions digitally in a unified, secure, and privacy-first portal.',
      icon: <HeartPulse className="h-6 w-6 text-rose-550" />,
      bg: 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 dark:border-rose-500/30'
    },
  ];

  const stats = [
    { label: 'Verified Specialists', value: '150+', icon: <Stethoscope className="h-5 w-5 text-rose-500" /> },
    { label: 'Specialized Departments', value: '25+', icon: <Building className="h-5 w-5 text-rose-500" /> },
    { label: 'Patient Satisfaction', value: '98.4%', icon: <Award className="h-5 w-5 text-rose-500" /> },
    { label: 'Years of Excellence', value: '14+', icon: <Activity className="h-5 w-5 text-rose-500" /> },
  ];

  const milestones = [
    { year: '2012', title: 'Hospital Foundation', desc: 'Medi-Doc Hospital was established in Addis Ababa as a specialized care clinic focusing on cardiology and pediatrics.' },
    { year: '2016', title: 'Expansion & Lab Wing', desc: 'Opened our advanced laboratory division and diagnostic imaging center to support tertiary care capabilities.' },
    { year: '2020', title: 'Digital Transformation', desc: 'Launched the integrated Patient Portal and e-prescription platform to connect patients and care teams online.' },
    { year: '2024', title: 'Tertiary Care Center', desc: 'Officially accredited as a premier Tertiary Care and Research Hospital, serving patients nationwide.' },
  ];

  return (
    <div className="container px-4 py-12 sm:px-6 lg:px-8 space-y-16 pb-24">
      {/* Hero Section */}
      <ScrollAnimate>
        <section className="relative overflow-hidden rounded-[10px] bg-linear-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/10 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <Shield className="h-3.5 w-3.5" /> Medi-Doc Tertiary Hospital
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Leading the Way in <span className="text-rose-500">Clinical Excellence</span>
              </h1>
              <p className="text-base text-slate-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                Medi-Doc Hospital is a premier multi-specialty tertiary care hospital dedicated to providing high-quality, patient-centered clinical services. We combine expert medical talent with state-of-the-art diagnostic facilities to deliver comprehensive and compassionate care.
              </p>
            </div>
            <div className="relative rounded-[10px] overflow-hidden shadow-xl border border-slate-200 dark:border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                alt="Medi-Doc Hospital Medical Specialists Team"
                className="h-72 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
            </div>
          </div>
        </section>
      </ScrollAnimate>

      {/* Stats Section */}
      <ScrollAnimate>
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 rounded-[10px] border border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 shadow-xs flex flex-col justify-between space-y-4">
              <div className="p-3 w-fit rounded-lg bg-slate-50 dark:bg-zinc-800">
                {stat.icon}
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-950 dark:text-white tracking-tight">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-zinc-400 font-medium mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </section>
      </ScrollAnimate>

      {/* Hospital Story & Timeline */}
      <ScrollAnimate>
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Our Healing Journey</h2>
            <p className="text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
              Medi-Doc Hospital was established in 2012 with a single, clear objective: to deliver world-class medical services right to the community. Over the years, our campus in Addis Ababa has grown into a leading center for critical patient care, diagnostics, and pharmaceutical research.
            </p>
            <div className="p-5 rounded-[10px] border border-emerald-500/10 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300 space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>Patient Safety First</span>
              </div>
              <p className="text-sm text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed">
                Every facility, prescription record, and diagnostic routine is held to high international medical standards.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 relative border-l-2 border-rose-500/20 dark:border-zinc-800 pl-6 ml-4 space-y-8">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="relative">
                <span className="absolute -left-[35px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-50 ring-4 ring-white dark:ring-zinc-950" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-rose-500">{milestone.year}</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{milestone.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollAnimate>

      {/* Core Pillars / Values */}
      <ScrollAnimate>
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Our Core Care Pillars</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              A specialized approach that forms the bedrock of Medi-Doc Hospital's daily medical practices and operations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className={`p-6 rounded-[10px] border flex flex-col space-y-4 transition-all hover:-translate-y-1 ${v.bg}`}>
                <div className="p-3 w-fit rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
                  {v.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{v.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollAnimate>
    </div>
  );
}
