'use client';

import React from 'react';
import { 
  Users, 
  ClipboardList, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Activity,
  HeartPulse
} from 'lucide-react';

export default function NurseOverviewPage() {
  const stats = [
    { label: 'Patients Under Care', value: '8', icon: Users, color: 'text-rose-600', bg: 'bg-rose-500/10' },
    { label: 'Vitals Logged Today', value: '12 / 16', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Shift Time Remaining', value: '4.5 hrs', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-500/10' },
    { label: 'Emergency Alerts', value: '1 Active', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-500/10' }
  ];

  const patients = [
    { bed: 'Bed 102', name: 'Martha Demeke', condition: 'Post-Op Stable', vitals: 'Checked (Normal)', bp: '120/80', hr: '76 bpm', temp: '36.8°C' },
    { bed: 'Bed 105', name: 'Haile Selassie', condition: 'Observation', vitals: 'Needs Checking', bp: '142/90', hr: '88 bpm', temp: '37.5°C', attention: true },
    { bed: 'Bed 112', name: 'Aster Aweke', condition: 'Recovery', vitals: 'Checked (Normal)', bp: '115/75', hr: '72 bpm', temp: '36.5°C' },
    { bed: 'Bed 115', name: 'Tewodros Kassahun', condition: 'Post-Op Observation', vitals: 'Checked (Attention)', bp: '135/85', hr: '94 bpm', temp: '38.2°C', attention: true }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-zinc-50">Nurse Station Overview</h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Ward status, patient care schedules, and vitals tracking</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className={`${s.bg} ${s.color} p-3 rounded-xl flex items-center justify-center`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{s.label}</span>
                <span className="text-xl font-extrabold text-slate-800 dark:text-zinc-150 tracking-tight mt-0.5 block">{s.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Patients List Grid */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">Active Patient Board</h3>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-500/5 px-2 py-0.5 rounded-full">Ward 3A</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-2">Bed</th>
                  <th className="py-2">Patient Name</th>
                  <th className="py-2">Condition</th>
                  <th className="py-2 text-center">Vitals Status</th>
                  <th className="py-2 text-right">Telemetry</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.bed} className="border-b border-slate-50 dark:border-zinc-800/50 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                    <td className="py-3 font-bold">{p.bed}</td>
                    <td className="py-3 font-bold">{p.name}</td>
                    <td className="py-3 text-[11px] text-slate-500">{p.condition}</td>
                    <td className="py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                        p.attention 
                          ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/20' 
                          : 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20'
                      }`}>
                        {p.vitals}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-[10px] text-slate-500">
                      BP: {p.bp} | HR: {p.hr} | Temp: {p.temp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shift Tasks checklist */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150 mb-3.5">Shift Task List</h3>
            <div className="space-y-3">
              {[
                { title: 'Hourly Bed Vitals Round', desc: 'Perform vital checks for Beds 101-110', done: true },
                { title: 'Administer IV Drip', desc: 'Bed 115 (Tewodros) scheduled at 11:30 AM', done: false },
                { title: 'Meds Dispensation Round', desc: 'Deliver noon medications to all active beds', done: false },
                { title: 'Night Shift Handover Log', desc: 'Compile daily charts for the night shift team', done: false }
              ].map((task, idx) => (
                <div key={idx} className="flex gap-3 items-start border-b border-slate-50 dark:border-zinc-800 pb-2.5 last:border-b-0">
                  <div className="mt-0.5">
                    {task.done ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded border border-slate-300 dark:border-zinc-700 shrink-0" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-[11px] font-bold text-slate-800 dark:text-zinc-200 ${task.done ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h4>
                    <p className="text-[10px] text-slate-450 dark:text-zinc-500 leading-normal">{task.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 mt-3">
            <span className="text-[10px] text-slate-400 block">Current Station Alert Level</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600">All Operations Normal</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

