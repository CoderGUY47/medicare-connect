'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { db, Appointment, User } from '../../../../lib/mockDb';
import { Calendar, Clock, CheckCircle2, XCircle, FileSignature, Sparkles, AlertCircle, Filter, Users, UserCheck } from 'lucide-react';
import { toast } from 'react-toastify';

type AptStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export default function DoctorAppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientsMap, setPatientsMap] = useState<{ [id: string]: User }>({});
  const [filter, setFilter] = useState<AptStatus>('all');

  useEffect(() => { 
    loadData(); 
  }, [user]);

  const loadData = () => {
    if (!user) return;
    const allApts = db.getAppointments().filter(a => a.doctorId === user.id);
    allApts.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    setAppointments(allApts);
    const pMap: { [id: string]: User } = {};
    db.getUsers().filter(u => u.role === 'patient').forEach(u => { pMap[u.id] = u; });
    setPatientsMap(pMap);
  };

  const handleUpdateStatus = (aptId: string, status: 'confirmed' | 'rejected') => {
    db.setAppointments(db.getAppointments().map(a => a.id === aptId ? { ...a, appointmentStatus: status } : a));
    toast.success(`Appointment ${status === 'confirmed' ? 'accepted' : 'rejected'} successfully.`);
    loadData();
  };

  const handleMarkComplete = (aptId: string) => {
    db.setAppointments(db.getAppointments().map(a => a.id === aptId ? { ...a, appointmentStatus: 'completed' as const } : a));
    toast.info('Consultation marked complete. Loading Prescription Editor...');
    router.push(`/dashboard/doctor/prescriptions?appointmentId=${aptId}`);
  };

  const statusCfg: Record<string, { label: string; pill: string; dot: string }> = {
    confirmed: { label: 'Confirmed', pill: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20', dot: 'bg-green-500' },
    pending:   { label: 'Pending Approval',   pill: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20', dot: 'bg-amber-500' },
    completed: { label: 'Completed', pill: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-500' },
    cancelled: { label: 'Cancelled', pill: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20', dot: 'bg-red-500' },
    rejected:  { label: 'Rejected',  pill: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20', dot: 'bg-red-500' },
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.appointmentStatus === filter);
  
  const counts = appointments.reduce((acc, a) => { 
    acc[a.appointmentStatus] = (acc[a.appointmentStatus] || 0) + 1; 
    return acc; 
  }, {} as Record<string, number>);

  const statCards = [
    { id: 'all',       label: 'Total Requests', count: appointments.length,               color: 'text-slate-650 dark:text-zinc-300', bg: 'bg-slate-500/10' },
    { id: 'pending',   label: 'Pending',        count: counts.pending || 0,               color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'confirmed', label: 'Confirmed',      count: counts.confirmed || 0,             color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10' },
    { id: 'completed', label: 'Completed',      count: counts.completed || 0,             color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'cancelled', label: 'Cancelled/Other',count: (counts.cancelled || 0) + (counts.rejected || 0), color: 'text-red-650 dark:text-red-400', bg: 'bg-red-500/10' },
  ];

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PT';

  return (
    <div className="space-y-7">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
            <span>Doctor</span><Calendar className="h-3 w-3" /><span className="text-emerald-500">Appointments</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            Appointment Requests
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">Approve requests, organize your schedule, and issue digital prescriptions.</p>
        </div>

        {/* Filter select dropdown */}
        <div className="flex items-center border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl px-3 py-1.5 focus-within:border-emerald-500 transition-all cursor-pointer shadow-sm w-fit self-end">
          <Filter className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value as AptStatus)} 
            className="bg-transparent outline-none text-xs font-semibold text-slate-700 dark:text-zinc-200 pr-2 cursor-pointer border-none"
          >
            <option value="all">All Statuses ({appointments.length})</option>
            <option value="pending">Pending ({counts.pending || 0})</option>
            <option value="confirmed">Confirmed ({counts.confirmed || 0})</option>
            <option value="completed">Completed ({counts.completed || 0})</option>
            <option value="cancelled">Cancelled ({counts.cancelled || 0})</option>
            <option value="rejected">Rejected ({counts.rejected || 0})</option>
          </select>
        </div>
      </div>

      {/* ── Stats Summary Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statCards.map((c) => (
          <button 
            key={c.id} 
            onClick={() => setFilter(c.id as AptStatus)}
            className={`bg-white dark:bg-zinc-900 border rounded-2xl p-4 text-center hover:shadow-md transition-all cursor-pointer ${
              filter === c.id 
                ? 'border-emerald-500 ring-2 ring-emerald-500/10' 
                : 'border-slate-200 dark:border-zinc-800'
            }`}
          >
            <div className={`text-lg font-extrabold ${c.color}`}>{c.count}</div>
            <div className="text-[10px] text-slate-450 dark:text-zinc-400 font-semibold mt-0.5">{c.label}</div>
          </button>
        ))}
      </div>

      {/* Appointment list */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((apt) => {
            const patient = patientsMap[apt.patientId];
            if (!patient) return null;
            const sc = statusCfg[apt.appointmentStatus] || { label: apt.appointmentStatus.toUpperCase(), pill: 'bg-slate-100 text-slate-500 border border-slate-200', dot: 'bg-slate-500' };

            return (
              <div 
                key={apt.id} 
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header Row */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-3 bg-slate-50/50 dark:bg-zinc-800/10">
                  <div className="flex items-center gap-3">
                    {patient.photo ? (
                      <img src={patient.photo} alt={patient.name} className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-zinc-700 shadow-sm shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center text-xs shrink-0 border border-emerald-500/10">
                        {getInitials(patient.name)}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-zinc-150">{patient.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{patient.email} · {patient.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold ${sc.pill}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border uppercase ${
                      apt.paymentStatus === 'paid' 
                        ? 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400' 
                        : 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      {apt.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Body Content Row */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-4 space-y-3">
                    <div>
                      <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">Consultation Date</div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        {new Date(apt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">Active Slot</div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                        <Clock className="h-4 w-4 text-emerald-500" />
                        {apt.appointmentTime}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-8">
                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">Reported Symptoms / Reason</div>
                    <div className="bg-slate-50/50 dark:bg-zinc-800/35 border border-slate-150 dark:border-zinc-800 rounded-xl p-3.5 text-xs text-slate-650 dark:text-zinc-350 leading-relaxed italic">
                      &ldquo;{apt.symptoms || 'No description provided.'}&rdquo;
                    </div>
                  </div>
                </div>

                {/* Footer Controls Row */}
                <div className="px-5 py-3.5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/20 dark:bg-zinc-800/5 flex items-center justify-between flex-wrap gap-2.5">
                  <span className="text-[10px] font-bold font-mono text-slate-400">REF-ID: {apt.id.toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    {apt.appointmentStatus === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(apt.id, 'rejected')}
                          className="border border-red-500/25 hover:bg-red-500/5 px-4 py-2 text-xs font-bold text-red-500 rounded-md transition-all uppercase cursor-pointer"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-xs rounded-md transition-all shadow-sm cursor-pointer"
                        >
                          Accept Consultation
                        </button>
                      </>
                    )}

                    {apt.appointmentStatus === 'confirmed' && (
                      <button 
                        onClick={() => handleMarkComplete(apt.id)}
                        className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-500/25 px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer shadow-sm"
                      >
                        <FileSignature className="h-4 w-4" /> Issue Prescription & Complete
                      </button>
                    )}

                    {apt.appointmentStatus === 'completed' && (
                      <button 
                        onClick={() => router.push(`/dashboard/doctor/prescriptions?appointmentId=${apt.id}`)}
                        className="flex items-center gap-1.5 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-200 rounded-md transition-all cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4 text-emerald-500" /> View Issued Rx
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-slate-250 dark:border-zinc-800 rounded-2xl py-20 flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No appointments identified</p>
            <p className="text-xs text-slate-400 dark:text-zinc-550 mt-1">There are no records matching your status filter.</p>
          </div>
        </div>
      )}
    </div>
  );
}
