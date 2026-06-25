"use client";

import React, { useState, useEffect } from "react";
import { db, Appointment, Doctor, User } from "../../../../lib/mockDb";
import { toast } from "react-toastify";
import {
  FiCalendar,
  FiClock,
  FiFilter,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { BsCalendarCheck, BsClockHistory } from "react-icons/bs";
import { MdOutlineCancel, MdOutlinePendingActions } from "react-icons/md";

const STATUS_CFG = {
  confirmed: {
    label: "Confirmed",
    dot: "bg-emerald-500",
    pill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    icon: FiCheckCircle,
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-500",
    pill: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    icon: MdOutlinePendingActions,
  },
  completed: {
    label: "Completed",
    dot: "bg-blue-500",
    pill: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    icon: BsCalendarCheck,
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-500",
    pill: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
    icon: MdOutlineCancel,
  },
  rejected: {
    label: "Rejected",
    dot: "bg-red-600",
    pill: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
    icon: FiXCircle,
  },
} as const;

type StatusKey = keyof typeof STATUS_CFG;

const PAYMENT_CFG = {
  paid: {
    label: "Paid",
    cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  },
  pending: {
    label: "Pending",
    cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  },
  unpaid: {
    label: "Unpaid",
    cls: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
  },
};

const AVATARS = [
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorsMap, setDoctorsMap] = useState<{ [id: string]: Doctor }>({});
  const [patientsMap, setPatientsMap] = useState<{ [id: string]: User }>({});
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const apts = db.getAppointments();
    apts.sort(
      (a, b) =>
        new Date(b.appointmentDate).getTime() -
        new Date(a.appointmentDate).getTime(),
    );
    setAppointments(apts);
    const docMap: { [id: string]: Doctor } = {};
    db.getDoctors().forEach((d) => {
      docMap[d.id] = d;
    });
    setDoctorsMap(docMap);
    const pMap: { [id: string]: User } = {};
    db.getUsers()
      .filter((u) => u.role === "patient")
      .forEach((u) => {
        pMap[u.id] = u;
      });
    setPatientsMap(pMap);
  };

  const handleUpdateStatus = (aptId: string, status: string) => {
    db.setAppointments(
      db
        .getAppointments()
        .map((a) =>
          a.id === aptId
            ? {
                ...a,
                appointmentStatus: status as Appointment["appointmentStatus"],
              }
            : a,
        ),
    );
    loadData();
    toast.success(`Appointment status updated to ${status}.`);
  };

  const statusCounts = appointments.reduce(
    (acc, a) => {
      acc[a.appointmentStatus] = (acc[a.appointmentStatus] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const filtered =
    statusFilter === "all"
      ? appointments
      : appointments.filter((a) => a.appointmentStatus === statusFilter);

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-7">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
            <span>Admin</span>
            <FiChevronRight className="h-3 w-3" />
            <span className="text-rose-500">Appointments</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <FiCalendar className="h-5 w-5 text-rose-600 dark:text-rose-500 " />
            </div>
            Appointment Logs
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">
            All bookings across the Medi-Doc platform — sorted by most recent.
          </p>
        </div>
        <button
          onClick={() => {
            loadData();
            toast.info("Appointment data refreshed.");
          }}
          className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0"
        >
          <FiRefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Total",
            value: appointments.length,
            color: "text-slate-600 dark:text-zinc-300",
            bg: "bg-slate-500/10",
            border: "border-slate-200 dark:border-zinc-800",
            icon: FiCalendar,
          },
          {
            label: "Pending",
            value: statusCounts.pending || 0,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-200 dark:border-amber-900/50",
            icon: MdOutlinePendingActions,
          },
          {
            label: "Confirmed",
            value: statusCounts.confirmed || 0,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-200 dark:border-emerald-900/50",
            icon: FiCheckCircle,
          },
          {
            label: "Completed",
            value: statusCounts.completed || 0,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-200 dark:border-blue-900/50",
            icon: BsCalendarCheck,
          },
          {
            label: "Cancelled",
            value: (statusCounts.cancelled || 0) + (statusCounts.rejected || 0),
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-500/10",
            border: "border-red-200 dark:border-red-900/50",
            icon: FiXCircle,
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
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filter Pills ── */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-3 flex-wrap">
        <FiFilter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <button
          onClick={() => setStatusFilter("all")}
          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${statusFilter === "all" ? "bg-rose-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700"}`}
        >
          All ({appointments.length})
        </button>
        {Object.entries(STATUS_CFG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${statusFilter === key ? "bg-rose-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700"}`}
          >
            {cfg.label} ({statusCounts[key] || 0})
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      {filtered.length > 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
              Appointment Records
            </h2>
            <span className="text-[11px] text-slate-400 font-semibold">
              {filtered.length} of {appointments.length} records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                  {[
                    "#ID",
                    "Patient",
                    "Doctor",
                    "Schedule",
                    "Symptoms",
                    "Status",
                    "Payment",
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
                {filtered.map((apt, idx) => {
                  const pat = patientsMap[apt.patientId];
                  const doc = doctorsMap[apt.doctorId];
                  const sc =
                    STATUS_CFG[apt.appointmentStatus as StatusKey] ||
                    STATUS_CFG.pending;
                  const pc =
                    PAYMENT_CFG[apt.paymentStatus] || PAYMENT_CFG.pending;
                  const gradient = AVATARS[idx % AVATARS.length];
                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-rose-50/30 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 font-mono">
                          #{apt.id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          {pat?.photo ? (
                            <img
                              src={pat.photo}
                              alt={pat.name}
                              className="h-8 w-8 rounded-full object-cover border-2 border-white dark:border-zinc-700 shadow-sm shrink-0"
                            />
                          ) : (
                            <div
                              className={`h-8 w-8 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center text-white text-[10px] font-extrabold shrink-0`}
                            >
                              {initials(pat?.name || "P")}
                            </div>
                          )}
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                              {pat?.name ??
                                `Patient #${apt.patientId.slice(-4)}`}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                              {pat?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs font-semibold text-slate-800 dark:text-zinc-100 whitespace-nowrap">
                          {doc?.doctorName ??
                            `Doctor #${apt.doctorId.slice(-4)}`}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {doc?.specialization}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-slate-800 dark:text-zinc-100">
                          {apt.appointmentDate}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <FiClock className="h-3 w-3" />
                          {apt.appointmentTime}
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-[150px]">
                        <div className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                          {apt.symptoms}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg ${sc.pill}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${sc.dot}`}
                          />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-lg ${pc.cls}`}
                        >
                          {pc.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3.5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">
              Showing{" "}
              <span className="text-slate-700 dark:text-zinc-200 font-bold">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="text-slate-700 dark:text-zinc-200 font-bold">
                {appointments.length}
              </span>{" "}
              records
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-400">
                {statusCounts.confirmed || 0} confirmed today
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl py-20 flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
            <FiCalendar className="h-8 w-8 text-slate-300 dark:text-zinc-600" />
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">
            No appointments found
          </p>
          <button
            onClick={() => setStatusFilter("all")}
            className="text-xs font-bold text-rose-600 border border-rose-500/30 px-4 py-2 rounded-xl hover:bg-rose-50 transition-all cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
}
