'use client';

import React, { useState } from 'react';
import { db } from '../../../../lib/mockDb';
import { FiChevronRight, FiSearch, FiFileText, FiDownload, FiEye } from 'react-icons/fi';
import { MdOutlineMedicalInformation, MdOutlineDescription } from 'react-icons/md';
import { BsFileEarmarkMedical, BsPersonVcard } from 'react-icons/bs';

interface MedicalRecord {
  id: string;
  patientName: string;
  patientPhoto?: string;
  diagnosis: string;
  medications: string;
  doctorName: string;
  date: string;
  notes: string;
  appointmentId: string;
}

export default function MedicalRecordsPage() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Build records from prescriptions
  const prescriptions = db.getPrescriptions();
  const doctors = db.getDoctors();
  const users = db.getUsers();

  const records: MedicalRecord[] = prescriptions.map(rx => {
    const patient = users.find(u => u.id === rx.patientId);
    return {
      id: rx.id,
      patientName: rx.patientName,
      patientPhoto: patient?.photo,
      diagnosis: rx.diagnosis,
      medications: rx.medications,
      doctorName: rx.doctorName,
      date: rx.createdAt,
      notes: rx.notes,
      appointmentId: rx.appointmentId,
    };
  });

  const filtered = records.filter(r =>
    !search || r.patientName.toLowerCase().includes(search.toLowerCase()) || r.diagnosis.toLowerCase().includes(search.toLowerCase()) || r.doctorName.toLowerCase().includes(search.toLowerCase())
  );

  const AVATARS = ['from-rose-500 to-pink-600','from-violet-500 to-purple-600','from-blue-500 to-cyan-600','from-emerald-500 to-teal-600'];
  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
            <span>Admin</span><FiChevronRight className="h-3 w-3" /><span className="text-rose-500">Medical Records</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <MdOutlineMedicalInformation className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            Medical Records
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">Patient diagnoses, prescriptions, and clinical notes across all visits.</p>
        </div>
        <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-md transition-all shadow-lg shadow-rose-500/20 cursor-pointer shrink-0">
          <FiDownload className="h-4 w-4" />
          Export Records
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Records',    value: records.length,                                             color: 'text-slate-600 dark:text-zinc-300',      bg: 'bg-slate-500/10',   border: 'border-slate-200 dark:border-zinc-800',         icon: BsFileEarmarkMedical },
          { label: 'Unique Patients',  value: new Set(records.map(r => r.patientName)).size,             color: 'text-rose-600 dark:text-rose-400',        bg: 'bg-rose-500/10',    border: 'border-rose-200 dark:border-rose-900/50',       icon: BsPersonVcard },
          { label: 'Prescriptions',    value: prescriptions.length,                                      color: 'text-violet-600 dark:text-violet-400',    bg: 'bg-violet-500/10',  border: 'border-violet-200 dark:border-violet-900/50',   icon: MdOutlineDescription },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-white dark:bg-zinc-900 border ${stat.border} rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}>
              <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 px-3 py-2 w-full sm:w-80 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition-all shadow-sm">
        <FiSearch className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by patient, diagnosis, or doctor…" className="bg-transparent outline-none text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 w-full" />
      </div>

      {/* Records Grid */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((record, idx) => {
            const isExpanded = expandedId === record.id;
            const gradient = AVATARS[idx % AVATARS.length];
            return (
              <div key={record.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="px-6 py-5 flex items-start gap-4">
                  {/* Patient Avatar */}
                  {record.patientPhoto ? (
                    <img src={record.patientPhoto} alt={record.patientName} className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-zinc-700 shadow-sm shrink-0" />
                  ) : (
                    <div className={`h-12 w-12 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center text-white text-sm font-extrabold shrink-0 shadow-sm`}>
                      {initials(record.patientName)}
                    </div>
                  )}

                  {/* Core Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">{record.patientName}</h3>
                          <span className="text-[10px] font-bold text-slate-400 font-mono">#{record.id.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">{record.diagnosis}</span>
                          <span className="text-[11px] text-slate-400">By {record.doctorName}</span>
                          <span className="text-[11px] text-slate-400">{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 line-clamp-1">{record.medications}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : record.id)}
                          className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-rose-500/10 hover:text-rose-600 border border-slate-200 dark:border-zinc-700 hover:border-rose-500/30 transition-all cursor-pointer"
                        >
                          <FiEye className="h-3.5 w-3.5" />
                          {isExpanded ? 'Hide' : 'View'}
                        </button>
                        <button className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer shadow-sm">
                          <FiDownload className="h-3.5 w-3.5" />
                          PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-zinc-800 px-6 py-5 bg-slate-50/50 dark:bg-zinc-800/20 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">Diagnosis</div>
                        <div className="text-sm text-slate-700 dark:text-zinc-200 font-semibold">{record.diagnosis}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">Medications</div>
                        <div className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{record.medications}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">Clinical Notes</div>
                      <div className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-3">{record.notes}</div>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Appointment ref: <span className="font-bold font-mono">{record.appointmentId}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl py-20 flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
            <FiFileText className="h-8 w-8 text-slate-300 dark:text-zinc-600" />
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No records found</p>
          <button onClick={() => setSearch('')} className="text-xs font-bold text-rose-600 border border-rose-500/30 px-4 py-2 rounded-md hover:bg-rose-50 transition-all cursor-pointer">Clear Search</button>
        </div>
      )}
    </div>
  );
}
