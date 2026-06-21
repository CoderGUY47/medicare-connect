'use client';

import React, { useEffect, useState } from 'react';
import { Stethoscope, Users, Calendar, Star } from 'lucide-react';
import { db } from '../lib/mockDb';
import AnimatedCounter from './AnimatedCounter';
import ScrollAnimate from './ScrollAnimate';

export default function PlatformStats() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    reviews: 0,
  });

  useEffect(() => {
    setMounted(true);

    const fetchStats = async () => {
      try {
        const response = await fetch('https://backend-nu-rosy-20.vercel.app/stats');
        if (response.ok) {
          const data = await response.json();
          setStats({
            doctors: data.totalDoctors || 0,
            patients: data.totalPatients || 0,
            appointments: data.totalAppointments || 0,
            reviews: data.totalReviews || 0,
          });
          return;
        }
      } catch (err) {
        console.log('Backend stats fetch failed, falling back to local DB:', err);
      }

      // Fallback
      const docsCount = db.getDoctors().length;
      const patsCount = db.getUsers().filter(u => u.role === 'patient').length;
      const aptsCount = db.getAppointments().length;
      const revsCount = db.getReviews().length;

      setStats({
        doctors: docsCount || 10,
        patients: patsCount || 5,
        appointments: aptsCount || 8,
        reviews: revsCount || 4,
      });
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      id: 'stat-docs',
      label: 'Total Doctors',
      value: stats.doctors,
      icon: <Stethoscope className="h-6 w-6 text-rose-600 dark:text-rose-500" />,
      desc: 'Verified clinical specialists active'
    },
    {
      id: 'stat-pats',
      label: 'Total Patients',
      value: stats.patients,
      icon: <Users className="h-6 w-6 text-rose-600 dark:text-rose-500" />,
      desc: 'Registered healthcare portal users'
    },
    {
      id: 'stat-apts',
      label: 'Total Appointments',
      value: stats.appointments,
      icon: <Calendar className="h-6 w-6 text-rose-600 dark:text-rose-500" />,
      desc: 'Consultation requests scheduled'
    },
    {
      id: 'stat-revs',
      label: 'Total Reviews',
      value: stats.reviews,
      icon: <Star className="h-6 w-6 text-rose-600 dark:text-rose-500" />,
      desc: 'Verified patient experience logs'
    }
  ];

  return (
    <ScrollAnimate>
      <section className="w-full bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-white select-none border-b border-slate-200/60 dark:border-zinc-900 rounded-none py-16 md:py-20 transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-7xl space-y-10 rounded-none">
          {/* Header Block */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-500 font-bold text-xs uppercase tracking-wider">
              <span className="text-sm font-black">+</span>
              <span>Platform Statistics</span>
            </div>
            <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">
              Live Coordination Metrics
            </h2>
            <p className="text-base text-slate-650 dark:text-zinc-400 leading-relaxed font-semibold max-w-3xl">
              Real-time health activity tracking. Our coordination network serves practitioners and patients seamlessly across the region.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-300 rounded-[10px]"
              >
                <div className="space-y-4">
                  <div className="p-3 h-fit w-fit rounded-lg bg-rose-50 dark:bg-zinc-850/50 shadow-sm shrink-0">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{item.label}</span>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {mounted && item.value > 0 ? (
                        <AnimatedCounter target={item.value} showPlus={true} />
                      ) : (
                        '0'
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-4 border-t border-slate-100 dark:border-zinc-850 pt-3">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollAnimate>
  );
}
