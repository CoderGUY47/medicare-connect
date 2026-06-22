'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { db, Appointment, Doctor } from '../../../lib/mockDb';
import {
  HeartPulse, CalendarDays, Clock, ChevronRight, Stethoscope
} from 'lucide-react';
import {
  FiCalendar, FiCreditCard, FiStar, FiChevronRight,
  FiArrowRight, FiActivity, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import {
  BsCalendarCheck, BsHeartPulse, BsClock, BsClipboard2Pulse
} from 'react-icons/bs';
import { MdOutlinePendingActions, MdOutlinePayments } from 'react-icons/md';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const STATUS_CFG = {
  confirmed:  { label: 'Confirmed',  dot: 'bg-emerald-500', pill: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' },
  pending:    { label: 'Pending',    dot: 'bg-amber-500',   pill: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' },
  completed:  { label: 'Completed', dot: 'bg-blue-500',    pill: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' },
  cancelled:  { label: 'Cancelled', dot: 'bg-red-500',     pill: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' },
  rejected:   { label: 'Rejected',  dot: 'bg-red-600',     pill: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' },
} as const;

type AptStatus = keyof typeof STATUS_CFG;

// Generate spending chart data from payments
function buildSpendingData(patientId: string) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const payments = db.getPayments().filter(p => p.patientId === patientId);
  const buckets: Record<string, number> = {};
  payments.forEach(p => {
    const m = months[new Date(p.paymentDate).getMonth()];
    buckets[m] = (buckets[m] || 0) + p.amount;
  });
  return months.slice(0, 7).map(m => ({ month: m, spent: buckets[m] || 0 }));
}

export default function PatientOverviewPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorsMap, setDoctorsMap] = useState<{ [id: string]: Doctor }>({});
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    totalPaid: 0,
    reviewsCount: 0,
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!user) return;

    const allApts = db.getAppointments().filter(a => a.patientId === user.id);
    allApts.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    setAppointments(allApts);

    const docMap: { [id: string]: Doctor } = {};
    db.getDoctors().forEach(d => { docMap[d.id] = d; });
    setDoctorsMap(docMap);

    const upcoming  = allApts.filter(a => ['pending', 'confirmed'].includes(a.appointmentStatus)).length;
    const completed = allApts.filter(a => a.appointmentStatus === 'completed').length;
    const payments  = db.getPayments().filter(p => p.patientId === user.id);
    const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
    const reviews   = db.getReviews().filter(r => r.patientId === user.id);

    setStats({ upcoming, completed, totalPaid, reviewsCount: reviews.length });
  }, [user]);

  const nearestApt = appointments
    .filter(a => ['pending', 'confirmed'].includes(a.appointmentStatus))
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())[0];

  const nearestDoc = nearestApt ? doctorsMap[nearestApt.doctorId] : null;
  const recentApts = appointments.slice(0, 4);
  const chartData  = user ? buildSpendingData(user.id) : [];

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name.split(' ')[0] || 'Patient';

  return (
    <div className="space-y-7">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden bg-linear-to-br from-rose-600 via-rose-500 to-pink-600 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-rose-500/20">
        {/* decorative circles */}
        <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-4 h-56 w-56 rounded-full bg-white/5" />
        <div className="absolute top-4 right-24 h-16 w-16 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-rose-100 text-sm font-medium">{greeting} 👋</p>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-1 tracking-tight">{firstName}</h1>
            <p className="text-rose-100 text-sm mt-1.5 max-w-xs">
              {stats.upcoming > 0
                ? `You have ${stats.upcoming} upcoming appointment${stats.upcoming > 1 ? 's' : ''}. Stay healthy!`
                : 'No upcoming appointments. Book a consultation today.'}
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-3">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
              {user?.photo ? (
                <img src={user.photo} alt={user.name} className="h-8 w-8 rounded-full object-cover border-2 border-white/30 shrink-0" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-white/20 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-white">{user?.name}</div>
                <div className="text-[10px] text-rose-100">Patient · Active</div>
              </div>
            </div>
            <Link
              href="/find-doctors"
              className="flex items-center gap-2 bg-white text-rose-600 font-bold text-xs px-4 py-2.5 rounded-md hover:bg-rose-50 transition-all shadow-sm"
            >
              <Stethoscope className="h-4 w-4" />
              Book Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming',   value: stats.upcoming,      sub: 'appointments', color: 'text-rose-600 dark:text-rose-400',        bg: 'bg-rose-500/10',    border: 'border-rose-200 dark:border-rose-900/50',       icon: FiCalendar },
          { label: 'Completed',  value: stats.completed,     sub: 'visits',       color: 'text-emerald-600 dark:text-emerald-400',   bg: 'bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-900/50',  icon: BsCalendarCheck },
          { label: 'Total Spent',value: `৳${stats.totalPaid}`,sub: 'consultations',color: 'text-blue-600 dark:text-blue-400',        bg: 'bg-blue-500/10',    border: 'border-blue-200 dark:border-blue-900/50',        icon: MdOutlinePayments },
          { label: 'Reviews',    value: stats.reviewsCount,  sub: 'submitted',    color: 'text-amber-600 dark:text-amber-400',       bg: 'bg-amber-500/10',   border: 'border-amber-200 dark:border-amber-900/50',      icon: FiStar },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-white dark:bg-zinc-900 border ${stat.border} rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}>
              <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400">{stat.label}</div>
                <div className="text-[9px] text-slate-400 dark:text-zinc-500">{stat.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Middle Row: Next Appointment + Spending Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Next Appointment Card */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BsClock className="h-4 w-4 text-rose-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Next Appointment</h2>
            </div>
            <Link href="/dashboard/patient/appointments" className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline">
              Manage <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-5">
            {nearestApt && nearestDoc ? (
              <div className="space-y-4">
                {/* Doctor info */}
                <div className="flex items-center gap-3">
                  <img
                    src={nearestDoc.profileImage}
                    alt={nearestDoc.doctorName}
                    className="h-14 w-14 rounded-2xl object-cover border-2 border-white dark:border-zinc-700 shadow-md shrink-0"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-zinc-100">{nearestDoc.doctorName}</div>
                    <div className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{nearestDoc.specialization}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[160px]">{nearestDoc.hospitalName}</div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CalendarDays className="h-3.5 w-3.5 text-rose-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-zinc-100">{nearestApt.appointmentDate}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="h-3.5 w-3.5 text-rose-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-zinc-100">{nearestApt.appointmentTime}</div>
                  </div>
                </div>

                {/* Fee + Status */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Consultation Fee</div>
                    <div className="text-sm font-extrabold text-slate-800 dark:text-zinc-100">৳{nearestDoc.consultationFee}</div>
                  </div>
                  {(() => {
                    const sc = STATUS_CFG[nearestApt.appointmentStatus as AptStatus] || STATUS_CFG.pending;
                    return (
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl ${sc.pill}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    );
                  })()}
                </div>

                {/* Symptoms */}
                {nearestApt.symptoms && (
                  <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-500/10 rounded-xl p-3">
                    <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">Reason for Visit</div>
                    <div className="text-xs text-slate-600 dark:text-zinc-300">{nearestApt.symptoms}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                  <FiCalendar className="h-7 w-7 text-slate-300 dark:text-zinc-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No upcoming appointments</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Book a consultation with a specialist today.</p>
                </div>
                <Link
                  href="/find-doctors"
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-md transition-all shadow-md shadow-rose-500/20"
                >
                  <Stethoscope className="h-4 w-4" />
                  Find Doctors
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Spending Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdOutlinePayments className="h-4 w-4 text-rose-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Consultation Spending</h2>
            </div>
            <Link href="/dashboard/patient/payments" className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline">
              All Payments <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-6 mb-5">
              <div>
                <div className="text-2xl font-extrabold text-slate-800 dark:text-zinc-100">৳{stats.totalPaid}</div>
                <div className="text-xs text-slate-400">Total spent</div>
              </div>
              <div className="h-8 w-px bg-slate-100 dark:bg-zinc-800" />
              <div>
                <div className="text-2xl font-extrabold text-slate-800 dark:text-zinc-100">{stats.completed}</div>
                <div className="text-xs text-slate-400">Consultations</div>
              </div>
            </div>
            {mounted && (
            <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px', color: '#f1f5f9' }}
                  formatter={(v: any) => [`৳${v}`, 'Spent']}
                />
                <Area type="monotone" dataKey="spent" stroke="#e11d48" strokeWidth={2} fill="url(#spendGrad)" dot={{ fill: '#e11d48', r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Recent Appointments + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BsClipboard2Pulse className="h-4 w-4 text-rose-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Recent Appointments</h2>
            </div>
            <Link href="/dashboard/patient/appointments" className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline">
              View All <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentApts.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {recentApts.map(apt => {
                const doc = doctorsMap[apt.doctorId];
                const sc = STATUS_CFG[apt.appointmentStatus as AptStatus] || STATUS_CFG.pending;
                return (
                  <div key={apt.id} className="flex items-center gap-4 px-5 py-4 hover:bg-rose-50/30 dark:hover:bg-zinc-800/40 transition-colors">
                    {doc?.profileImage ? (
                      <img src={doc.profileImage} alt={doc.doctorName} className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-zinc-700 shadow-sm shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                        <HeartPulse className="h-5 w-5 text-rose-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 dark:text-zinc-100">{doc?.doctorName || 'Unknown Doctor'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{doc?.specialization} · {apt.appointmentDate}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${sc.pill}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                      <span className="text-[10px] text-slate-400">{apt.appointmentTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <FiCalendar className="h-8 w-8 text-slate-200 dark:text-zinc-700" />
              <p className="text-xs text-slate-400">No appointment history yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800">
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: 'Find a Doctor',      href: '/find-doctors',                       icon: Stethoscope,    color: 'text-rose-600 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20' },
                { label: 'My Appointments',    href: '/dashboard/patient/appointments',     icon: FiCalendar,     color: 'text-blue-600 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20' },
                { label: 'Payment History',    href: '/dashboard/patient/payments',         icon: FiCreditCard,   color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20' },
                { label: 'Leave a Review',     href: '/dashboard/patient/reviews',          icon: FiStar,         color: 'text-amber-600 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20' },
                { label: 'Edit Profile',       href: '/dashboard/patient/profile',          icon: FiActivity,     color: 'text-violet-600 bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20' },
              ].map(action => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md border text-xs font-bold transition-all ${action.color}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{action.label}</span>
                    <FiChevronRight className="h-3.5 w-3.5 opacity-50" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Health Tip Card */}
          <div className="bg-linear-to-br from-rose-500/10 via-pink-500/5 to-transparent border border-rose-500/15 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <BsHeartPulse className="h-4 w-4 text-rose-500" />
              <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Health Tip</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
              Stay on top of your health. Regular check-ups help catch issues early. 
              Your last completed visit was with {
                recentApts.find(a => a.appointmentStatus === 'completed')
                  ? doctorsMap[recentApts.find(a => a.appointmentStatus === 'completed')!.doctorId]?.doctorName || 'a specialist'
                  : 'a specialist'
              }.
            </p>
            <Link href="/find-doctors" className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline">
              Book a check-up <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
