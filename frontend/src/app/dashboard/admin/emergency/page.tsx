'use client';

import React, { useState } from 'react';
import { FiChevronRight, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { MdLocalHospital, MdOutlineEmergency } from 'react-icons/md';
import { BsHeartPulseFill, BsPersonFillCheck } from 'react-icons/bs';
import { toast } from 'react-toastify';

type Severity = 'critical' | 'moderate' | 'stable';

interface EmergencyCase {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  complaint: string;
  severity: Severity;
  admittedAt: string;
  assignedDoctor: string;
  ward: string;
  status: 'active' | 'transferred' | 'discharged';
}

const MOCK_CASES: EmergencyCase[] = [
  { id: 'em-1', patientName: 'Robert Hayes',  age: 62, gender: 'Male',   complaint: 'Acute chest pain, elevated troponin', severity: 'critical', admittedAt: '2026-06-20 08:14', assignedDoctor: 'Dr. Sarah Jenkins',  ward: 'ICU Bay 1',   status: 'active' },
  { id: 'em-2', patientName: 'Maria Solis',   age: 34, gender: 'Female', complaint: 'Seizure episode, post-ictal confusion',  severity: 'critical', admittedAt: '2026-06-20 09:02', assignedDoctor: 'Dr. Michael Chen',   ward: 'ICU Bay 2',   status: 'active' },
  { id: 'em-3', patientName: 'David Kim',     age: 47, gender: 'Male',   complaint: 'Compound fracture, right femur',          severity: 'moderate', admittedAt: '2026-06-20 07:45', assignedDoctor: 'Dr. Arjun Patel',    ward: 'Trauma Bay 1', status: 'active' },
  { id: 'em-4', patientName: 'Priya Nair',    age: 28, gender: 'Female', complaint: 'Severe allergic reaction (anaphylaxis)',   severity: 'critical', admittedAt: '2026-06-20 10:30', assignedDoctor: 'Dr. Sarah Jenkins',  ward: 'Resus Room',  status: 'active' },
  { id: 'em-5', patientName: 'James Walker',  age: 55, gender: 'Male',   complaint: 'Hypertensive emergency (BP: 220/140)',    severity: 'moderate', admittedAt: '2026-06-20 06:55', assignedDoctor: 'Dr. Elena Rostova',  ward: 'Obs Bay 1',   status: 'active' },
  { id: 'em-6', patientName: 'Lucy Chen',     age: 19, gender: 'Female', complaint: 'Laceration on forearm, requires sutures', severity: 'stable',   admittedAt: '2026-06-20 11:10', assignedDoctor: 'Dr. Michael Chen',   ward: 'Minor Cases',  status: 'active' },
  { id: 'em-7', patientName: 'Tom Bradley',   age: 72, gender: 'Male',   complaint: 'Fall, possible hip fracture',              severity: 'moderate', admittedAt: '2026-06-20 05:22', assignedDoctor: 'Dr. Arjun Patel',    ward: 'Trauma Bay 2', status: 'transferred' },
];

const SEV_CFG: Record<Severity, { label: string; color: string; bg: string; border: string; dot: string; pulse: boolean }> = {
  critical: { label: 'Critical', color: 'text-red-600 dark:text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    dot: 'bg-red-500',    pulse: true },
  moderate: { label: 'Moderate', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20',  dot: 'bg-amber-500',  pulse: false },
  stable:   { label: 'Stable',   color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500', pulse: false },
};

const STATUS_CFG = {
  active:      { label: 'Active',      cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' },
  transferred: { label: 'Transferred', cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' },
  discharged:  { label: 'Discharged',  cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' },
};

export default function EmergencyPage() {
  const [cases, setCases] = useState<EmergencyCase[]>(MOCK_CASES);
  const [sevFilter, setSevFilter] = useState<'all' | Severity>('all');

  const counts = {
    total:    cases.length,
    critical: cases.filter(c => c.severity === 'critical' && c.status === 'active').length,
    moderate: cases.filter(c => c.severity === 'moderate').length,
    stable:   cases.filter(c => c.severity === 'stable').length,
    active:   cases.filter(c => c.status === 'active').length,
  };

  const filtered = sevFilter === 'all' ? cases : cases.filter(c => c.severity === sevFilter);

  const handleDischarge = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'discharged' } : c));
    toast.success('Patient discharged from emergency.');
  };
  const handleTransfer = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'transferred' } : c));
    toast.info('Patient transferred to ward.');
  };

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
            <span>Admin</span><FiChevronRight className="h-3 w-3" /><span className="text-rose-500">Emergency</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-500/10 flex items-center justify-center">
              <MdOutlineEmergency className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            Emergency Unit
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">Live emergency case board — active admissions and severity triage.</p>
        </div>
        {counts.critical > 0 && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs px-4 py-2.5 rounded-xl">
            <FiAlertTriangle className="h-4 w-4 animate-pulse" />
            {counts.critical} Critical Case{counts.critical > 1 ? 's' : ''} Active
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Cases',     value: counts.total,    color: 'text-slate-600 dark:text-zinc-300',      bg: 'bg-slate-500/10',   border: 'border-slate-200 dark:border-zinc-800',          icon: BsHeartPulseFill },
          { label: 'Critical',        value: counts.critical, color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-500/10',     border: 'border-red-200 dark:border-red-900/50',          icon: MdOutlineEmergency },
          { label: 'Moderate',        value: counts.moderate, color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-500/10',   border: 'border-amber-200 dark:border-amber-900/50',      icon: FiAlertTriangle },
          { label: 'Stable',          value: counts.stable,   color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-900/50',  icon: BsPersonFillCheck },
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

      {/* Severity Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'critical', 'moderate', 'stable'] as const).map(f => (
          <button key={f} onClick={() => setSevFilter(f)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${sevFilter === f ? 'bg-rose-600 text-white' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:border-rose-500'}`}>
            {f === 'all' ? `All (${counts.total})` : `${f} (${counts[f]})`}
          </button>
        ))}
      </div>

      {/* Cases Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Active Emergency Board</h2>
          <span className="text-[11px] text-slate-400 font-semibold">{filtered.length} cases</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                {['Patient', 'Complaint', 'Severity', 'Ward', 'Admitted', 'Assigned Doctor', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filtered.map(c => {
                const sc = SEV_CFG[c.severity];
                const stc = STATUS_CFG[c.status];
                return (
                  <tr key={c.id} className="hover:bg-rose-50/30 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-slate-800 dark:text-zinc-100">{c.patientName}</div>
                      <div className="text-[10px] text-slate-400">{c.age} yrs · {c.gender}</div>
                    </td>
                    <td className="px-5 py-4 max-w-[180px]">
                      <div className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{c.complaint}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg ${sc.color} ${sc.bg} border ${sc.border}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot} ${sc.pulse ? 'animate-pulse' : ''}`} />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-700 dark:text-zinc-200 whitespace-nowrap">{c.ward}</td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-zinc-400 whitespace-nowrap">{c.admittedAt}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-700 dark:text-zinc-200 whitespace-nowrap">{c.assignedDoctor}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-lg ${stc.cls}`}>{stc.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      {c.status === 'active' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleTransfer(c.id)} className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 cursor-pointer transition-all">Transfer</button>
                          <button onClick={() => handleDischarge(c.id)} className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer transition-all">Discharge</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
