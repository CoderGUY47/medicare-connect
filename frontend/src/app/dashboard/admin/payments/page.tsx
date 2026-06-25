"use client";

import React, { useState, useEffect } from "react";
import { db, Payment } from "../../../../lib/mockDb";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  FiChevronRight,
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,
  FiDownload,
} from "react-icons/fi";
import { BsArrowDownRight, BsCheckCircleFill } from "react-icons/bs";
import { MdOutlineReceiptLong } from "react-icons/md";

// Generate monthly chart data from payments
function buildMonthlyData(payments: Payment[]) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const buckets: Record<string, number> = {};
  payments.forEach((p) => {
    const m = months[new Date(p.paymentDate).getMonth()];
    buckets[m] = (buckets[m] || 0) + p.amount;
  });
  return months.map((m) => ({ month: m, revenue: buckets[m] || 0 }));
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const history = db.getPayments();
    history.sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
    );
    setPayments(history);
  }, []);

  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const avgTx =
    payments.length > 0 ? Math.round(totalRevenue / payments.length) : 0;
  const chartData = buildMonthlyData(payments);

  return (
    <div className="space-y-7">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
            <span>Admin</span>
            <FiChevronRight className="h-3 w-3" />
            <span className="text-rose-500">Reports & Revenue</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <MdOutlineReceiptLong className="h-5 w-5 text-rose-600 dark:text-rose-500 " />
            </div>
            Financial Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">
            All consultation fee receipts, transaction logs, and revenue
            analytics.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-md transition-all shadow-lg shadow-rose-500/20 cursor-pointer shrink-0">
          <FiDownload className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Gross Revenue",
            value: `৳${totalRevenue.toLocaleString()}`,
            sub: "All time",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-200 dark:border-emerald-900/50",
            icon: FiDollarSign,
          },
          {
            label: "Transactions",
            value: payments.length,
            sub: "Completed",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-200 dark:border-blue-900/50",
            icon: FiCreditCard,
          },
          {
            label: "Avg. Transaction",
            value: `৳${avgTx}`,
            sub: "Per consultation",
            color: "text-rose-600 dark:text-rose-500 ",
            bg: "bg-rose-500/10",
            border: "border-rose-200 dark:border-rose-900/50",
            icon: FiTrendingUp,
          },
          {
            label: "Success Rate",
            value: "100%",
            sub: "No failed payments",
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-500/10",
            border: "border-violet-200 dark:border-violet-900/50",
            icon: BsCheckCircleFill,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-white dark:bg-zinc-900 border ${stat.border} rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}
            >
              <div
                className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-extrabold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-zinc-500">
                  {stat.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                Monthly Revenue
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Consultation fee revenue by month
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">
              2026
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B65DC" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5B65DC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.1)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  fontSize: "11px",
                  color: "#f1f5f9",
                }}
                formatter={(v: any) => [`৳${v}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#5B65DC"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                dot={{ fill: "#5B65DC", r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
              By Doctor
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Revenue per specialist
            </p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={(() => {
                const byDoc: Record<string, number> = {};
                payments.forEach((p) => {
                  byDoc[p.doctorName.replace("Dr. ", "")] =
                    (byDoc[p.doctorName.replace("Dr. ", "")] || 0) + p.amount;
                });
                return Object.entries(byDoc).map(([name, val]) => ({
                  name,
                  revenue: val,
                }));
              })()}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.1)"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  fontSize: "11px",
                  color: "#f1f5f9",
                }}
                formatter={(v: any) => [`৳${v}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#5B65DC" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Transactions Table ── */}
      {payments.length > 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
              Transaction Ledger
            </h2>
            <span className="text-[11px] text-slate-400 font-semibold">
              {payments.length} transactions
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                  {[
                    "#",
                    "Transaction ID",
                    "Patient",
                    "Doctor",
                    "Amount",
                    "Date",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {payments.map((p, i) => (
                  <tr
                    key={p.id}
                    className="hover:bg-rose-50/30 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="px-5 py-4 text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <BsArrowDownRight className="h-3 w-3 text-emerald-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 font-mono whitespace-nowrap">
                          {p.transactionId}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-800 dark:text-zinc-100 whitespace-nowrap">
                      {p.patientName}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-800 dark:text-zinc-100 whitespace-nowrap">
                      {p.doctorName}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-0.5 text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-outfit">
                        <i className="fa-solid fa-bangladeshi-taka-sign text-xs mr-0.5"></i>
                        {p.amount}.00
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                      {new Date(p.paymentDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <BsCheckCircleFill className="h-3 w-3" />
                        Success
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3.5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">
              {payments.length} transactions · 100% success rate
            </span>
            <div className="text-sm font-extrabold text-slate-700 dark:text-zinc-200">
              Total:{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                ${totalRevenue.toLocaleString()}.00
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl py-20 flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
            <FiCreditCard className="h-8 w-8 text-slate-300 dark:text-zinc-600" />
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">
            No transactions recorded yet
          </p>
        </div>
      )}
    </div>
  );
}
