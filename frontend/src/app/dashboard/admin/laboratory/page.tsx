'use client';

import React, { useState } from 'react';
import { FiChevronRight, FiSearch } from 'react-icons/fi';
import { MdOutlineScience, MdOutlineBiotech } from 'react-icons/md';
import { BsClipboard2Pulse, BsCheckCircleFill, BsHourglassSplit } from 'react-icons/bs';
import { toast } from 'react-toastify';

type LabStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

interface LabOrder {
  id: string;
  patientName: string;
  testType: string;
  category: string;
  orderedBy: string;
  orderedAt: string;
  status: LabStatus;
  result?: string;
  priority: 'routine' | 'urgent' | 'stat';
}

const MOCK_ORDERS: LabOrder[] = [
  { id: 'lab-001', patientName: 'Jane Doe',      testType: 'Complete Blood Count (CBC)',       category: 'Hematology',   orderedBy: 'Dr. Sarah Jenkins', orderedAt: '2026-06-20 08:00', status: 'completed',  result: 'Normal', priority: 'routine' },
  { id: 'lab-002', patientName: 'John Smith',    testType: 'Lipid Panel',                      category: 'Chemistry',    orderedBy: 'Dr. Sarah Jenkins', orderedAt: '2026-06-20 08:30', status: 'processing',  priority: 'routine' },
  { id: 'lab-003', patientName: 'Robert Hayes',  testType: 'Troponin I (Cardiac)',             category: 'Cardiology',   orderedBy: 'Dr. Michael Chen',  orderedAt: '2026-06-20 08:14', status: 'completed',  result: 'Elevated — see notes', priority: 'stat' },
  { id: 'lab-004', patientName: 'Maria Solis',   testType: 'EEG Report',                      category: 'Neurology',    orderedBy: 'Dr. Michael Chen',  orderedAt: '2026-06-20 09:10', status: 'pending',     priority: 'urgent' },
  { id: 'lab-005', patientName: 'David Kim',     testType: 'X-Ray — Right Femur',             category: 'Radiology',    orderedBy: 'Dr. Arjun Patel',   orderedAt: '2026-06-20 07:50', status: 'completed',  result: 'Compound Fracture Grade III', priority: 'urgent' },
  { id: 'lab-006', patientName: 'Priya Nair',    testType: 'IgE Antibody Panel',              category: 'Immunology',   orderedBy: 'Dr. Sarah Jenkins', orderedAt: '2026-06-20 10:45', status: 'processing',  priority: 'stat' },
  { id: 'lab-007', patientName: 'James Walker',  testType: 'Urinalysis + Culture',            category: 'Microbiology', orderedBy: 'Dr. Elena Rostova', orderedAt: '2026-06-20 07:00', status: 'pending',     priority: 'routine' },
  { id: 'lab-008', patientName: 'Jane Doe',      testType: 'HbA1c (Glycated Hemoglobin)',     category: 'Endocrinology',orderedBy: 'Dr. Sarah Jenkins', orderedAt: '2026-06-19 16:00', status: 'completed',  result: '5.4% — Normal', priority: 'routine' },
];

const STATUS_CFG: Record<LabStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  pending:    { label: 'Pending',    color: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   dot: 'bg-amber-500' },
  processing: { label: 'Processing', color: 'text-blue-600 dark:text-blue-400',      bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    dot: 'bg-blue-500' },
  completed:  { label: 'Completed',  color: 'text-emerald-600 dark:text-emerald-400',bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
  cancelled:  { label: 'Cancelled',  color: 'text-red-600 dark:text-red-400',        bg: 'bg-red-500/10',     border: 'border-red-500/20',     dot: 'bg-red-500' },
};

const PRIORITY_CFG = {
  routine: { label: 'Routine', cls: 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400' },
  urgent:  { label: 'Urgent',  cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' },
  stat:    { label: 'STAT',    cls: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-extrabold' },
};

export default function LaboratoryPage() {
  const [orders, setOrders] = useState<LabOrder[]>(MOCK_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LabStatus>('all');

  const counts = {
    total:      orders.length,
    pending:    orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed:  orders.filter(o => o.status === 'completed').length,
  };

  const filtered = orders.filter(o => {
    const ms = !search || o.patientName.toLowerCase().includes(search.toLowerCase()) || o.testType.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === 'all' || o.status === statusFilter;
    return ms && mf;
  });

  const handleComplete = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'completed', result: 'Results ready' } : o));
    toast.success('Lab test marked as completed.');
  };

  return (
    <div className="space-y-7">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
          <span>Admin</span><FiChevronRight className="h-3 w-3" /><span className="text-rose-500">Laboratory</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <MdOutlineScience className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          Laboratory Orders
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">Track all diagnostic test orders, processing status, and results.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders',  value: counts.total,      color: 'text-slate-600 dark:text-zinc-300',      bg: 'bg-slate-500/10',   border: 'border-slate-200 dark:border-zinc-800',          icon: BsClipboard2Pulse },
          { label: 'Pending',       value: counts.pending,    color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-500/10',   border: 'border-amber-200 dark:border-amber-900/50',      icon: BsHourglassSplit },
          { label: 'Processing',    value: counts.processing, color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-500/10',    border: 'border-blue-200 dark:border-blue-900/50',        icon: MdOutlineBiotech },
          { label: 'Completed',     value: counts.completed,  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-900/50',  icon: BsCheckCircleFill },
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

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-800/50 px-3 py-2 w-full sm:w-72 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition-all">
          <FiSearch className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or test type…" className="bg-transparent outline-none text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 w-full" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'pending', 'processing', 'completed'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${statusFilter === f ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}>
              {f === 'all' ? `All (${counts.total})` : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Test Orders</h2>
          <span className="text-[11px] text-slate-400 font-semibold">{filtered.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                {['Order ID', 'Patient', 'Test', 'Category', 'Priority', 'Ordered By', 'Date', 'Status', 'Result', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filtered.map(o => {
                const sc = STATUS_CFG[o.status];
                const pc = PRIORITY_CFG[o.priority];
                return (
                  <tr key={o.id} className="hover:bg-rose-50/30 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-4 text-[10px] font-bold text-slate-400 font-mono">{o.id}</td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-800 dark:text-zinc-100 whitespace-nowrap">{o.patientName}</td>
                    <td className="px-5 py-4 text-xs text-slate-600 dark:text-zinc-300 max-w-[180px]">{o.testType}</td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-zinc-400 whitespace-nowrap">{o.category}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${pc.cls}`}>{pc.label}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 dark:text-zinc-300 whitespace-nowrap">{o.orderedBy}</td>
                    <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">{o.orderedAt}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg ${sc.color} ${sc.bg} border ${sc.border}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />{sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-zinc-400 max-w-[160px] truncate">{o.result || '—'}</td>
                    <td className="px-5 py-4">
                      {(o.status === 'pending' || o.status === 'processing') && (
                        <button onClick={() => handleComplete(o.id)} className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer transition-all">
                          Mark Complete
                        </button>
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
