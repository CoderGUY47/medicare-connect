'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { db, Appointment, Review, User } from '../../../lib/mockDb';
import { 
  Users, 
  CalendarDays, 
  Star,
  Clock,
  TrendingUp,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileSignature,
  Activity,
  Heart
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function DoctorOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPatients: 0, todaysApts: 0, reviewsCount: 0, avgRating: 0 });
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [todayBookings, setTodayBookings] = useState<(Appointment & { patientName?: string; patientPhoto?: string })[]>([]);
  const [chartData, setChartData] = useState<{ day: string; consults: number }[]>([]);

  useEffect(() => {
    if (!user) return;
    const allApts = db.getAppointments().filter(a => a.doctorId === user.id);
    const patientIds = new Set(allApts.map(a => a.patientId));
    const todayStr = new Date().toISOString().split('T')[0];
    const todays = allApts.filter(a => a.appointmentDate === todayStr);
    
    // Map patient details
    const patients = db.getUsers().filter(u => u.role === 'patient');
    const patMap: Record<string, User> = {};
    patients.forEach(p => { patMap[p.id] = p; });

    const todaysWithDetails = todays.map(apt => ({
      ...apt,
      patientName: patMap[apt.patientId]?.name || 'Unknown Patient',
      patientPhoto: patMap[apt.patientId]?.photo
    }));

    const docReviews = db.getReviews().filter(r => r.doctorId === user.id);
    const avgRating = docReviews.length > 0
      ? Math.round((docReviews.reduce((s, r) => s + r.rating, 0) / docReviews.length) * 10) / 10
      : 0;

    // Build mock weekly chart data based on doctor's actual appointments
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const mockWeeklyData = weekdays.map((day, idx) => {
      // Seed slightly different numbers to make the chart look active and professional
      const baseConsults = [4, 6, 5, 8, 7, 3, 2];
      return {
        day,
        consults: baseConsults[idx] + (allApts.length % (idx + 1))
      };
    });

    setStats({ totalPatients: patientIds.size, todaysApts: todays.length, reviewsCount: docReviews.length, avgRating });
    setRecentReviews(docReviews.slice(0, 4));
    setTodayBookings(todaysWithDetails.slice(0, 5));
    setChartData(mockWeeklyData);
  }, [user]);

  const metrics = [
    { label: 'Total Patients', value: stats.totalPatients, desc: 'Unique consultations', icon: Users, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-250 dark:border-emerald-900/50' },
    { label: "Today's Consults", value: stats.todaysApts, desc: 'Scheduled for today', icon: CalendarDays, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-200 dark:border-blue-900/50' },
    { label: 'Total Reviews', value: stats.reviewsCount, desc: 'Patient feedback submissions', icon: Heart, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-200 dark:border-rose-900/50' },
    { label: 'Average Rating', value: `${stats.avgRating} / 5`, desc: 'Overall clinical rating', icon: Star, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-200 dark:border-amber-900/50' },
  ];

  const statusCls: Record<string, string> = {
    confirmed: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20',
    pending:   'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
    completed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20',
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PT';

  return (
    <div className="space-y-7">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-600 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-emerald-500/20">
        <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-4 h-56 w-56 rounded-full bg-white/5" />
        <div className="absolute top-4 right-24 h-16 w-16 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Welcome back 👋</p>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-1 tracking-tight">{user?.name}</h1>
            <p className="text-emerald-100 text-sm mt-1.5 max-w-xs">
              {stats.todaysApts > 0 
                ? `You have ${stats.todaysApts} consult${stats.todaysApts > 1 ? 's' : ''} scheduled for today. Have a productive shift!` 
                : 'No consultations scheduled for today. Enjoy your day!'}
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-3">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              <div className="text-[11px] font-bold tracking-wider uppercase">Active Shift</div>
            </div>
            <Link
              href="/dashboard/doctor/schedule"
              className="flex items-center gap-2 bg-white text-emerald-600 font-bold text-xs px-4 py-2.5 rounded-md hover:bg-emerald-50 transition-all shadow-sm"
            >
              <Calendar className="h-4 w-4" />
              Manage Slots
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric Cards Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className={`bg-white dark:bg-zinc-900 border ${m.border} rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}>
              <div className={`h-11 w-11 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-extrabold text-slate-800 dark:text-zinc-150`}>{m.value}</div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 mt-0.5">{m.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Chart & Schedule Details Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Weekly Consults Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Consultation Volume</h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Weekly Performance</span>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="consultGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px', color: '#f1f5f9' }}
                  formatter={(v: any) => [`${v} Patients`, 'Consultations']}
                />
                <Area type="monotone" dataKey="consults" stroke="#10b981" strokeWidth={2.5} fill="url(#consultGrad)" dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Schedule Mini-List */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Today&apos;s Schedule</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {todayBookings.length > 0 ? (
                todayBookings.map((apt) => (
                  <div key={apt.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                    {apt.patientPhoto ? (
                      <img src={apt.patientPhoto} alt={apt.patientName} className="h-8 w-8 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center text-xs shrink-0">
                        {getInitials(apt.patientName || '')}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 dark:text-zinc-150 truncate">{apt.patientName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3 text-emerald-500 shrink-0" />
                        {apt.appointmentTime}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 border text-[8px] font-extrabold uppercase rounded-lg tracking-wider shrink-0 ${statusCls[apt.appointmentStatus] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {apt.appointmentStatus}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 dark:text-zinc-500">
                  <CheckCircle2 className="h-8 w-8 text-slate-350 dark:text-zinc-650 mx-auto mb-2" />
                  <p className="text-xs font-bold">No consults scheduled</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">No today bookings registered.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-zinc-800/20 border-t border-slate-100 dark:border-zinc-800">
            <Link
              href="/dashboard/doctor/appointments"
              className="block w-full py-2 text-center text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-250 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all rounded-md"
            >
              Manage Appointments
            </Link>
          </div>
        </div>
      </div>

      {/* ── Patient Ratings Section ── */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Recent Ratings & Reviews</h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Feedback Node</span>
        </div>

        <div className="p-5">
          {recentReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentReviews.map((rev) => (
                <div key={rev.id} className="border border-slate-150 dark:border-zinc-800 p-4 rounded-xl space-y-2 hover:border-emerald-500/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-zinc-100">{rev.patientName}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{new Date(rev.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-0.5 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/10">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-350 dark:stroke-zinc-700'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-350 italic leading-relaxed">&ldquo;{rev.reviewText}&rdquo;</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl text-center text-slate-400 dark:text-zinc-500">
              <Star className="h-8 w-8 text-slate-350 dark:text-zinc-650 mx-auto mb-2" />
              <p className="text-xs font-bold">No feedback posted yet</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Reviews appear once patients complete visits.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
