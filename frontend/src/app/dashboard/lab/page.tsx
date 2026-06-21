'use client';

import React from 'react';
import { 
  FlaskConical, 
  FileCheck, 
  Activity, 
  AlertCircle, 
  CheckCircle,
  Database,
  Cpu
} from 'lucide-react';

export default function LabOverviewPage() {
  const stats = [
    { label: 'Pending Specimens', value: '18', icon: FlaskConical, color: 'text-rose-600', bg: 'bg-rose-500/10' },
    { label: 'Tests Completed Today', value: '24', icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Urgent Requests', value: '3 Active', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-500/10' },
    { label: 'Devices Calibrated', value: '100% OK', icon: Cpu, color: 'text-emerald-600', bg: 'bg-emerald-500/10' }
  ];

  const specimens = [
    { id: 'SPEC-8821', patient: 'Martha Demeke', test: 'Complete Blood Count (CBC)', priority: 'Urgent', status: 'Analyzing', time: '10 mins ago' },
    { id: 'SPEC-8825', patient: 'Haile Selassie', test: 'Lipid Panel', priority: 'Routine', status: 'Pending', time: '25 mins ago' },
    { id: 'SPEC-8830', patient: 'Aster Aweke', test: 'Renal Function Test', priority: 'Routine', status: 'Pending', time: '40 mins ago' },
    { id: 'SPEC-8831', patient: 'Tewodros Kassahun', test: 'Blood Glucose Test', priority: 'Urgent', status: 'Completed', time: '1 hour ago', done: true }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-zinc-50">Lab Station Overview</h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Laboratory specimen processing, diagnostic request status, and queue telemetry</p>
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
        
        {/* Lab queue list */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">Specimen Testing Queue</h3>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-500/5 px-2 py-0.5 rounded-full">Section B-1</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-2">Specimen ID</th>
                  <th className="py-2">Patient</th>
                  <th className="py-2">Test Request</th>
                  <th className="py-2 text-center">Priority</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {specimens.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 dark:border-zinc-800/50 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                    <td className="py-3 font-mono font-bold text-rose-600 dark:text-rose-400">{s.id}</td>
                    <td className="py-3 font-bold">{s.patient}</td>
                    <td className="py-3 text-[11px] text-slate-500">{s.test}</td>
                    <td className="py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                        s.priority === 'Urgent' 
                          ? 'bg-red-500/10 text-red-600 dark:bg-red-950/20' 
                          : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {s.priority}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`text-[10px] font-bold ${
                        s.done 
                          ? 'text-emerald-500' 
                          : s.status === 'Analyzing' 
                          ? 'text-blue-500 animate-pulse' 
                          : 'text-slate-400'
                      }`}>
                        {s.status} ({s.time})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analyzer devices widget */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150 mb-3.5">Device Diagnostics</h3>
            <div className="space-y-3">
              {[
                { name: 'Hematology Analyzer #1', type: 'Sysmex XN-1000', status: 'Active', ok: true },
                { name: 'Chemistry Analyzer #2', type: 'Cobas c311', status: 'Idle', ok: true },
                { name: 'Coagulation System #1', type: 'ACL TOP 350', status: 'Active', ok: true },
                { name: 'PCR Thermocycler #1', type: 'CFX96 Bio-Rad', status: 'Maintenance Required', ok: false }
              ].map((device, idx) => (
                <div key={idx} className="flex gap-3 items-start border-b border-slate-50 dark:border-zinc-800 pb-2.5 last:border-b-0">
                  <div className="mt-0.5">
                    {device.ok ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-bold text-slate-800 dark:text-zinc-200">
                      {device.name}
                    </h4>
                    <p className="text-[10px] text-slate-450 dark:text-zinc-500 leading-normal">{device.type} · <strong className={device.ok ? 'text-slate-500' : 'text-amber-500'}>{device.status}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 mt-3">
            <span className="text-[10px] text-slate-400 block">LIMS Integration Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Database className="h-4 w-4 text-rose-600 shrink-0 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-350">Cloud Sync Online (100%)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

