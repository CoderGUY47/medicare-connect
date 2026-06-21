'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { db, Payment } from '../../../../lib/mockDb';
import { FiChevronRight, FiCreditCard, FiDownload } from 'react-icons/fi';
import { BsCheckCircleFill, BsArrowDownRight, BsShieldCheck } from 'react-icons/bs';
import { MdOutlinePayments, MdOutlineReceiptLong } from 'react-icons/md';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function buildChartData(payments: Payment[]) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const buckets: Record<string, number> = {};
  payments.forEach(p => {
    const m = months[new Date(p.paymentDate).getMonth()];
    buckets[m] = (buckets[m] || 0) + p.amount;
  });
  return months.slice(0, 8).map(m => ({ month: m, spent: buckets[m] || 0 }));
}

export default function PatientPaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (!user) return;
    const history = db.getPayments().filter(p => p.patientId === user.id);
    history.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
    setPayments(history);
  }, [user]);

  const totalSpent = payments.reduce((s, p) => s + p.amount, 0);
  const avgFee = payments.length > 0 ? Math.round(totalSpent / payments.length) : 0;
  const chartData = buildChartData(payments);

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
            <span>Patient</span><FiChevronRight className="h-3 w-3" /><span className="text-rose-500">Payments</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <MdOutlineReceiptLong className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            Payment History
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">All consultation fee transactions and receipts.</p>
        </div>
        <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-md transition-all shadow-lg shadow-rose-500/20 shrink-0 cursor-pointer">
          <FiDownload className="h-4 w-4" />
          Export Statement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Spent',      value: `$${totalSpent}`,                  sub: 'All time',          color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-900/50', icon: MdOutlinePayments },
          { label: 'Transactions',     value: payments.length,                   sub: 'Completed',         color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-500/10',    border: 'border-blue-200 dark:border-blue-900/50',       icon: FiCreditCard },
          { label: 'Avg. Fee',         value: `$${avgFee}`,                      sub: 'Per consultation',  color: 'text-rose-600 dark:text-rose-400',        bg: 'bg-rose-500/10',    border: 'border-rose-200 dark:border-rose-900/50',       icon: MdOutlineReceiptLong },
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
                <div className="text-[10px] text-slate-400 dark:text-zinc-500">{stat.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spending Chart */}
      {payments.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Monthly Spending</h3>
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="patientSpendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px', color: '#f1f5f9' }}
                formatter={(v: any) => [`$${v}`, 'Spent']}
              />
              <Area type="monotone" dataKey="spent" stroke="#e11d48" strokeWidth={2} fill="url(#patientSpendGrad)" dot={{ fill: '#e11d48', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Transaction List */}
      {payments.length > 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Transaction History</h2>
            <span className="text-[11px] text-slate-400 font-semibold">{payments.length} transactions</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {payments.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-rose-50/30 dark:hover:bg-zinc-800/40 transition-colors">
                {/* Icon */}
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <BsArrowDownRight className="h-4 w-4 text-emerald-500" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                    Consultation → {p.doctorName}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-mono">{p.transactionId}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15">
                      <BsShieldCheck className="h-2.5 w-2.5" /> Verified
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="text-xs text-slate-500 dark:text-zinc-400 shrink-0 text-right">
                  {new Date(p.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                {/* Amount */}
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0 text-right min-w-[60px]">
                  +${p.amount}
                </div>
              </div>
            ))}
          </div>

          {/* Table footer */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BsCheckCircleFill className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[11px] text-slate-400 font-semibold">{payments.length} transactions · 100% success rate</span>
            </div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-zinc-100">
              Total: <span className="text-emerald-600 dark:text-emerald-400">${totalSpent}.00</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl py-20 flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
            <FiCreditCard className="h-8 w-8 text-slate-300 dark:text-zinc-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No transactions yet</p>
            <p className="text-xs text-slate-400 mt-1">Payments will appear here after you book a consultation.</p>
          </div>
        </div>
      )}
    </div>
  );
}
