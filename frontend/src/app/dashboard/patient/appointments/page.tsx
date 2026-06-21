'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../../context/AuthContext';
import { db, Appointment, Doctor } from '../../../../lib/mockDb';
import { CalendarDays, Clock, X, FileText, FileSignature } from 'lucide-react';
import { FiCalendar, FiChevronRight, FiFilter, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { BsCalendarCheck, BsClipboard2Pulse } from 'react-icons/bs';
import { MdOutlinePendingActions, MdOutlineCancel } from 'react-icons/md';
import { toast } from 'react-toastify';

const STATUS_CFG = {
  confirmed:  { label: 'Confirmed',  dot: 'bg-emerald-500', pill: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' },
  pending:    { label: 'Pending',    dot: 'bg-amber-500',   pill: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' },
  completed:  { label: 'Completed', dot: 'bg-blue-500',    pill: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' },
  cancelled:  { label: 'Cancelled', dot: 'bg-red-500',     pill: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' },
  rejected:   { label: 'Rejected',  dot: 'bg-red-600',     pill: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' },
} as const;

type AptStatus = keyof typeof STATUS_CFG;

export default function PatientAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorsMap, setDoctorsMap] = useState<{ [id: string]: Doctor }>({});
  const [filter, setFilter] = useState('all');

  // Reschedule modal state
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [rescheduleDay, setRescheduleDay] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('');

  // Prescription modal state
  const [prescription, setPrescription] = useState<any>(null);

  useEffect(() => { loadData(); }, [user]);

  const loadData = () => {
    if (!user) return;
    const apts = db.getAppointments().filter(a => a.patientId === user.id);
    apts.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    setAppointments(apts);
    const docMap: { [id: string]: Doctor } = {};
    db.getDoctors().forEach(d => { docMap[d.id] = d; });
    setDoctorsMap(docMap);
  };

  const handleCancel = (aptId: string) => {
    if (!confirm('Cancel this appointment?')) return;
    db.setAppointments(db.getAppointments().map(a => a.id === aptId ? { ...a, appointmentStatus: 'cancelled' as const } : a));
    loadData();
    toast.error('Appointment cancelled.');
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleApt || !rescheduleDay || !rescheduleSlot) return;
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const today = new Date();
    let diff = days.indexOf(rescheduleDay) - today.getDay();
    if (diff <= 0) diff += 7;
    const d = new Date(today.setDate(today.getDate() + diff));
    const newDate = d.toISOString().split('T')[0];
    db.setAppointments(db.getAppointments().map(a => a.id === rescheduleApt.id
      ? { ...a, appointmentDate: newDate, appointmentTime: rescheduleSlot, appointmentStatus: 'pending' as const }
      : a
    ));
    setRescheduleApt(null); setRescheduleDay(''); setRescheduleSlot('');
    loadData();
    toast.success('Appointment rescheduled successfully!');
  };

  const handleViewPrescription = (aptId: string) => {
    const found = db.getPrescriptions().find(p => p.appointmentId === aptId);
    if (found) setPrescription(found);
    else toast.info('Prescription not yet uploaded by the doctor.');
  };

  const counts = {
    all:       appointments.length,
    pending:   appointments.filter(a => a.appointmentStatus === 'pending').length,
    confirmed: appointments.filter(a => a.appointmentStatus === 'confirmed').length,
    completed: appointments.filter(a => a.appointmentStatus === 'completed').length,
    cancelled: appointments.filter(a => ['cancelled','rejected'].includes(a.appointmentStatus)).length,
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a =>
    filter === 'cancelled' ? ['cancelled','rejected'].includes(a.appointmentStatus) : a.appointmentStatus === filter
  );

  const reschedDoc = rescheduleApt ? doctorsMap[rescheduleApt.doctorId] : null;

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
            <span>Patient</span><FiChevronRight className="h-3 w-3" /><span className="text-rose-500">Appointments</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <BsClipboard2Pulse className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            My Appointments
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">All scheduled and past medical consultations.</p>
        </div>
        <Link href="/find-doctors" className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-rose-500/20 shrink-0">
          <FiCalendar className="h-4 w-4" />
          Book New
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total',     value: counts.all,       color: 'text-slate-600 dark:text-zinc-300',      bg: 'bg-slate-500/10',   border: 'border-slate-200 dark:border-zinc-800',          icon: FiCalendar },
          { label: 'Pending',   value: counts.pending,   color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-500/10',   border: 'border-amber-200 dark:border-amber-900/50',      icon: MdOutlinePendingActions },
          { label: 'Confirmed', value: counts.confirmed, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-900/50',  icon: BsCalendarCheck },
          { label: 'Completed', value: counts.completed, color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-500/10',    border: 'border-blue-200 dark:border-blue-900/50',        icon: FileText },
          { label: 'Cancelled', value: counts.cancelled, color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-500/10',     border: 'border-red-200 dark:border-red-900/50',          icon: MdOutlineCancel },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-white dark:bg-zinc-900 border ${s.border} rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow`}>
              <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-4.5 w-4.5 ${s.color}`} />
              </div>
              <div>
                <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Pills */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-2 flex-wrap">
        <FiFilter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        {(['all','pending','confirmed','completed','cancelled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${filter === f ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}>
            {f === 'all' ? `All (${counts.all})` : `${f} (${counts[f] ?? 0})`}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(apt => {
            const doc = doctorsMap[apt.doctorId];
            if (!doc) return null;
            const sc = STATUS_CFG[apt.appointmentStatus as AptStatus] || STATUS_CFG.pending;
            const canAct = ['pending', 'confirmed'].includes(apt.appointmentStatus);
            const isCompleted = apt.appointmentStatus === 'completed';

            return (
              <div key={apt.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Card header */}
                <div className="px-5 py-4 flex items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={doc.profileImage} alt={doc.doctorName} className="h-12 w-12 rounded-xl object-cover border-2 border-white dark:border-zinc-700 shadow-sm shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-800 dark:text-zinc-100 truncate">{doc.doctorName}</div>
                      <div className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">{doc.specialization} · {doc.hospitalName}</div>
                      <div className="text-[10px] font-bold text-slate-400 font-mono mt-0.5">APT-{apt.id.slice(-6).toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl ${sc.pill}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl ${apt.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                      {apt.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CalendarDays className="h-3.5 w-3.5 text-rose-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-zinc-100">{apt.appointmentDate}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="h-3.5 w-3.5 text-rose-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-zinc-100">{apt.appointmentTime}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fee</div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">${doc.consultationFee}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3 col-span-2 md:col-span-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Symptoms</div>
                    <div className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-2">{apt.symptoms || 'Not specified'}</div>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="px-5 py-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-2 bg-slate-50/50 dark:bg-zinc-800/20">
                  {canAct && (
                    <>
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all cursor-pointer"
                      >
                        <MdOutlineCancel className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                      <button
                        onClick={() => { setRescheduleApt(apt); setRescheduleDay(doc.availableDays[0] || ''); }}
                        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 transition-all cursor-pointer"
                      >
                        <FiRefreshCw className="h-3.5 w-3.5" />
                        Reschedule
                      </button>
                    </>
                  )}
                  {isCompleted && (
                    <button
                      onClick={() => handleViewPrescription(apt.id)}
                      className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm shadow-rose-500/20 cursor-pointer"
                    >
                      <FileSignature className="h-3.5 w-3.5" />
                      View Prescription
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl py-20 flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
            <FiCalendar className="h-8 w-8 text-slate-300 dark:text-zinc-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No appointments found</p>
            <p className="text-xs text-slate-400 mt-1">Try a different filter or book a new consultation.</p>
          </div>
          <Link href="/find-doctors" className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-rose-500/20">
            Find a Doctor
          </Link>
        </div>
      )}

      {/* ── Reschedule Modal ── */}
      {rescheduleApt && reschedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiRefreshCw className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Reschedule Appointment</h3>
              </div>
              <button onClick={() => { setRescheduleApt(null); setRescheduleDay(''); setRescheduleSlot(''); }} className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-5">
              <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-900/10 rounded-xl p-3">
                <img src={reschedDoc.profileImage} alt={reschedDoc.doctorName} className="h-10 w-10 rounded-full object-cover shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-100">{reschedDoc.doctorName}</div>
                  <div className="text-[10px] text-slate-400">{reschedDoc.specialization}</div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-2">Select Day</label>
                <div className="grid grid-cols-3 gap-2">
                  {reschedDoc.availableDays.map(d => (
                    <button key={d} type="button" onClick={() => { setRescheduleDay(d); setRescheduleSlot(''); }}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${rescheduleDay === d ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-rose-500'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {rescheduleDay && (
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-2">Select Time Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {reschedDoc.availableSlots.map(s => (
                      <button key={s} type="button" onClick={() => setRescheduleSlot(s)}
                        className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${rescheduleSlot === s ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-rose-500'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" disabled={!rescheduleDay || !rescheduleSlot}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-rose-500/20">
                Confirm Reschedule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Prescription Modal ── */}
      {prescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Medical Prescription</h3>
              </div>
              <button onClick={() => setPrescription(null)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Rx Header Info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Doctor',  value: prescription.doctorName },
                  { label: 'Patient', value: prescription.patientName },
                  { label: 'Date',    value: new Date(prescription.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                  { label: 'Rx ID',   value: prescription.id.toUpperCase() },
                ].map(f => (
                  <div key={f.label} className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3">
                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-0.5">{f.label}</div>
                    <div className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate">{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Diagnosis */}
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Diagnosis</div>
                <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-500/15 rounded-xl p-3 text-sm font-bold text-rose-700 dark:text-rose-300">
                  {prescription.diagnosis}
                </div>
              </div>

              {/* Medications */}
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Medications</div>
                <div className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700 rounded-xl p-3 space-y-1.5">
                  {prescription.medications.split(',').map((m: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-zinc-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      {m.trim()}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Doctor's Notes</div>
                <div className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700 rounded-xl p-3 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {prescription.notes || 'No additional notes.'}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20 flex justify-end gap-2">
              <button onClick={() => setPrescription(null)}
                className="text-xs font-bold px-5 py-2 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 transition-all cursor-pointer">
                Close
              </button>
              <button className="text-xs font-bold px-5 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer shadow-sm">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
