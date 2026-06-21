'use client';

import React, { useEffect, useState } from 'react';
import { Stethoscope, Users, Calendar, Star } from 'lucide-react';
import { db } from '../lib/mockDb';
import AnimatedCounter from './AnimatedCounter';
import ScrollAnimate from './ScrollAnimate';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
      icon: <Stethoscope className="h-5 w-5 text-rose-600 dark:text-rose-500" />,
      desc: 'Active specialists'
    },
    {
      id: 'stat-pats',
      label: 'Total Patients',
      value: stats.patients,
      icon: <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />,
      desc: 'Registered users'
    },
    {
      id: 'stat-apts',
      label: 'Total Appointments',
      value: stats.appointments,
      icon: <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
      desc: 'Scheduled visits'
    },
    {
      id: 'stat-revs',
      label: 'Total Reviews',
      value: stats.reviews,
      icon: <Star className="h-5 w-5 text-amber-600 dark:text-amber-500" />,
      desc: 'Verified patient feedback'
    }
  ];

  // Data array formatted for Recharts consumption
  const chartData = [
    { name: 'Doctors', value: stats.doctors, gradientId: 'roseGrad' },
    { name: 'Patients', value: stats.patients, gradientId: 'emeraldGrad' },
    { name: 'Appointments', value: stats.appointments, gradientId: 'blueGrad' },
    { name: 'Reviews', value: stats.reviews, gradientId: 'amberGrad' }
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

          {/* Side-by-Side Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch pt-2">

             {/* Left Column: 2x2 Numeric Summary Cards (5/12 width) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {statItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 rounded-[16px] border-none group relative overflow-hidden"
                >
                  {/* Subtle background glow effect on hover */}
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-950 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-slate-550 dark:text-zinc-450 uppercase tracking-widest block">{item.label}</span>
                      <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-outfit">
                        {mounted && item.value > 0 ? (
                          <AnimatedCounter target={item.value} showPlus={true} />
                        ) : (
                          '0'
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/60 font-semibold leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column: Recharts Custom Visualizer Card (7/12 width) */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between shadow-xs rounded-[12px] border-none min-h-[350px]">
              <div className="space-y-1 pb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">Metrics Distribution Analysis</h3>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">Graphical scale mapping patient interactions and specialist activity</p>
              </div>

              {/* Chart Wrapper Container with safety mount validation */}
              <div className="flex-1 w-full h-[260px] relative mt-2">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                      <defs>
                        <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.15}/>
                        </linearGradient>
                        <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.15}/>
                        </linearGradient>
                        <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.15}/>
                        </linearGradient>
                        <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.15}/>
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        stroke="currentColor"
                        className="text-[10px] text-slate-450 dark:text-zinc-500 font-bold uppercase tracking-wider"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="currentColor"
                        className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold"
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(244, 63, 94, 0.03)' }}
                        contentStyle={{
                          backgroundColor: 'var(--color-bg, #ffffff)',
                          borderColor: 'rgba(226, 232, 240, 0.8)',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                        }}
                        itemStyle={{ color: '#f43f5e' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#${entry.gradientId})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    Loading distribution visualizer...
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </ScrollAnimate>
  );
}
