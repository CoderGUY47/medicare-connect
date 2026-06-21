'use client';

import React from 'react';
import { 
  Pill, 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle,
  Truck,
  RotateCcw,
  Plus
} from 'lucide-react';

export default function PharmacistOverviewPage() {
  const stats = [
    { label: 'Pending Prescriptions', value: '9', icon: ClipboardList, color: 'text-rose-600', bg: 'bg-rose-500/10' },
    { label: 'Prescriptions Filled Today', value: '42', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'Out of Stock Items', value: '2', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-500/10' },
    { label: 'Low Stock warnings', value: '5 Items', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-500/10' }
  ];

  const prescriptions = [
    { id: 'RX-9902', patient: 'Martha Demeke', doctor: 'Dr. Sarah Jenkins', meds: 'Aspirin 81mg, Metoprolol 25mg', status: 'Pending', time: '12 mins ago' },
    { id: 'RX-9905', patient: 'Haile Selassie', doctor: 'Dr. Arjun Patel', meds: 'Atorvastatin 20mg', status: 'Filling', time: '18 mins ago' },
    { id: 'RX-9908', patient: 'Aster Aweke', doctor: 'Dr. Elena Rostova', meds: 'Amoxicillin 500mg', status: 'Pending', time: '35 mins ago' },
    { id: 'RX-9910', patient: 'Tewodros Kassahun', doctor: 'Dr. Michael Chen', meds: 'Lisinopril 10mg', status: 'Filled', time: '1 hour ago', done: true }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-zinc-50">Pharmacy Overview</h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">e-Prescription filling, stock control, and drug inventory levels</p>
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
        
        {/* Prescription Filling Board */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">Active Prescription Queue</h3>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-500/5 px-2 py-0.5 rounded-full">Station A</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-2">Rx ID</th>
                  <th className="py-2">Patient</th>
                  <th className="py-2">Doctor</th>
                  <th className="py-2">Prescribed Medications</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((rx) => (
                  <tr key={rx.id} className="border-b border-slate-50 dark:border-zinc-800/50 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium">
                    <td className="py-3 font-mono font-bold text-rose-600 dark:text-rose-400">{rx.id}</td>
                    <td className="py-3 font-bold">{rx.patient}</td>
                    <td className="py-3 text-[11px] text-slate-500">{rx.doctor}</td>
                    <td className="py-3 text-[11px] text-slate-500 font-semibold">{rx.meds}</td>
                    <td className="py-3 text-right">
                      <span className={`text-[10px] font-bold ${
                        rx.done 
                          ? 'text-emerald-500' 
                          : rx.status === 'Filling' 
                          ? 'text-blue-500 animate-pulse' 
                          : 'text-slate-400'
                      }`}>
                        {rx.status} ({rx.time})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">Critical Stock Warning</h3>
              <button className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-0.5">
                <Plus className="h-3.5 w-3.5" /> Reorder
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Insulin Glargine 100 U/ml', code: 'INS-GL-01', left: '8 vials', min: '25 vials', critical: true },
                { name: 'Amoxicillin 250mg', code: 'AMX-250-09', left: '15 boxes', min: '50 boxes', critical: true },
                { name: 'Atorvastatin 20mg', code: 'ATV-20-03', left: '42 boxes', min: '60 boxes', critical: false },
                { name: 'Metoprolol 25mg', code: 'MTP-25-05', left: '38 boxes', min: '50 boxes', critical: false }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start border-b border-slate-50 dark:border-zinc-800 pb-2.5 last:border-b-0">
                  <div className="mt-0.5">
                    {item.critical ? (
                      <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold text-slate-800 dark:text-zinc-200 truncate">{item.name}</h4>
                    </div>
                    <p className="text-[10px] text-slate-450 dark:text-zinc-500 leading-normal">
                      Stock: <strong className={item.critical ? 'text-red-500' : 'text-amber-500'}>{item.left}</strong> (Min: {item.min})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 mt-3">
            <span className="text-[10px] text-slate-400 block">Supply Orders Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Truck className="h-4 w-4 text-rose-600 shrink-0 animate-bounce" />
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-350">Delivery Scheduled: Today 2:00 PM</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

