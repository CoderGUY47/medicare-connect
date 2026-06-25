"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db, User, Doctor, Review } from "../../../lib/mockDb";
import {
  Users,
  CalendarDays,
  DollarSign,
  TrendingUp,
  FileText,
  Activity,
  Clock,
  Bed,
  UserCheck,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Settings,
  Pill,
  FlaskConical,
  Search,
  BrainCircuit,
  Stethoscope,
  Star,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminOverviewPage() {
  const [mounted, setMounted] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
  });
  const [doctorRatings, setDoctorRatings] = useState<any[]>([]);
  const [topDoctors, setTopDoctors] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);

    // load live statistics
    const patientsCount = db
      .getUsers()
      .filter((u: User) => u.role === "patient").length;
    const doctorsCount = db.getDoctors().length;
    const appointmentsCount = db.getAppointments().length;
    setStats({
      totalPatients: patientsCount,
      totalDoctors: doctorsCount,
      totalAppointments: appointmentsCount,
    });

    // load doctor performance
    const docs = db.getDoctors();
    const revs = db.getReviews();
    const ratings = docs.map((d: Doctor) => {
      const docReviews = revs.filter((r: Review) => r.doctorId === d.id);
      let avgRating =
        docReviews.length > 0
          ? Math.round(
              (docReviews.reduce((s: number, r: Review) => s + r.rating, 0) /
                docReviews.length) *
                10,
            ) / 10
          : 0;

      // Seed a realistic default fallback rating for visual appeal in charts
      if (avgRating === 0) {
        const baseRatings: Record<string, number> = {
          "doc-1": 4.8,
          "doc-2": 4.9,
          "doc-3": 4.7,
          "doc-4": 4.3,
          "doc-5": 4.6,
          "doc-6": 4.5,
          "doc-7": 4.8,
          "doc-8": 4.9,
          "doc-9": 4.4,
          "doc-10": 4.6,
        };
        avgRating = baseRatings[d.id] || 4.5;
      }

      return {
        id: d.id,
        name: d.doctorName.replace("Dr. ", ""),
        fullName: d.doctorName,
        rating: avgRating,
        specialization: d.specialization,
        photo: d.profileImage,
        reviewsCount: docReviews.length,
      };
    });

    const sorted = [...ratings].sort((a, b) => b.rating - a.rating);
    setDoctorRatings(ratings);
    setTopDoctors(sorted.slice(0, 5));
  }, []);

  // Weekly Revenue Trend mock data
  const weeklyRevenue = [
    { day: "Mon", OPD: 1.5, IPD: 2.1, Lab: 0.3, Pharmacy: 0.2 },
    { day: "Tue", OPD: 1.8, IPD: 2.3, Lab: 0.4, Pharmacy: 0.3 },
    { day: "Wed", OPD: 1.4, IPD: 2.2, Lab: 0.3, Pharmacy: 0.2 },
    { day: "Thu", OPD: 2.1, IPD: 2.8, Lab: 0.5, Pharmacy: 0.4 },
    { day: "Fri", OPD: 1.9, IPD: 2.4, Lab: 0.4, Pharmacy: 0.3 },
    { day: "Sat", OPD: 1.2, IPD: 1.7, Lab: 0.2, Pharmacy: 0.2 },
    { day: "Sun", OPD: 0.8, IPD: 1.3, Lab: 0.1, Pharmacy: 0.1 },
  ];

  // OPD vs IPD Donut Chart data (Upscaled color tokens)
  const distributionData = [
    { name: "OPD Patients", value: 267, color: "#5B65DC" }, // Periwinkle Blue
    { name: "IPD Patients", value: 75, color: "#10b981" }, // Emerald 500
  ];

  // Department Efficiency Bar Chart data
  const departmentPerformance = [
    { name: "Emergency", efficiency: 92 },
    { name: "Surgery", efficiency: 95 },
    { name: "Pediatrics", efficiency: 88 },
    { name: "Cardiology", efficiency: 91 },
    { name: "Orthopedics", efficiency: 89 },
    { name: "Radiology", efficiency: 93 },
  ];

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "none",
    borderRadius: "10px",
    fontSize: 11,
    color: "hsl(var(--foreground))",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
  };

  const axisStyle = {
    fill: "hsl(var(--muted-foreground))",
    fontSize: 10,
    fontWeight: "500",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-zinc-900 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-zinc-550 flex items-center gap-2">
            Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Real-time clinical metrics & AI insights
          </p>
        </div>
      </div>

      {/* Modern AI Operations Command Center */}
      <div className="bg-linear-to-r from-rose-500/6 via-indigo-500/5 to-cyan-500/6 rounded-[10px] p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-500  px-2.5 py-1 rounded-[6px] text-[10px] font-extrabold uppercase tracking-wider">
              <BrainCircuit className="h-3.5 w-3.5 animate-pulse text-rose-500" />
              Medi-Doc AI Copilot Active
            </div>
            <h2 className="text-base font-extrabold text-slate-850 dark:text-zinc-150 tracking-tight">
              AI Operations Command Hub
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-3xl">
              Medi-Doc AI engine is tracking live patient admissions, bed
              status, and pharmaceutical counts. Currently monitoring 3
              predicted anomalies.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask Copilot (e.g., 'predict bed occupancy')..."
                className="w-full border border-slate-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/70 pl-9 pr-3 py-2 rounded-[10px] text-xs outline-none text-slate-850 dark:text-zinc-250 placeholder:text-slate-400 font-semibold focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <button className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-[8px] transition-all cursor-pointer shadow-md shadow-rose-500/15 whitespace-nowrap border-none">
              Run Query
            </button>
          </div>
        </div>

        {/* Live Operational Predictions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100 dark:border-zinc-800/80">
          {[
            {
              title: "Bed Capacity Prediction",
              desc: "Incoming Emergency referrals are forecast to increase occupancy to 84% by 6:00 PM. Ward ICU is at capacity.",
              action: "Divert Electives",
              color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
            },
            {
              title: "Pharmacy Supply Low",
              desc: "Amoxicillin 250mg dosage prescriptions are up 34% this week. Out of stock warning in 3 days.",
              action: "Restock Pharmacy",
              color: "text-rose-600 dark:text-rose-500  bg-rose-500/10",
            },
            {
              title: "Wait Time Optimization",
              desc: "Emergency wait times are trending high (+4 min). Staff re-assignment recommended for pediatric clinic.",
              action: "Optimize Staffing",
              color: "text-cyan-600 dark:text-cyan-405 bg-cyan-500/10",
            },
          ].map((insight) => (
            <div
              key={insight.title}
              className="bg-white/60 dark:bg-zinc-900/60 p-4 rounded-[10px] flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
            >
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  AI Forecast
                </span>
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">
                  {insight.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal font-semibold">
                  {insight.desc}
                </p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-[6px] ${insight.color}`}
                >
                  {insight.action}
                </span>
                <button className="text-[10px] font-bold text-rose-655 hover:text-rose-700 dark:text-rose-500  hover:underline border-none bg-transparent cursor-pointer">
                  Execute Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1. KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {/* Total Patients */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-[10px] flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="bg-rose-500/10 p-2 rounded-[10px] text-rose-600">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-[6px] flex items-center gap-0.5">
              <ArrowUpRight className="h-2.5 w-2.5" /> +8.2%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-800 dark:text-zinc-150 tracking-tight">
              {stats.totalPatients || 342}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
              Total Patients
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">
              OPD:{" "}
              {stats.totalPatients
                ? Math.round(stats.totalPatients * 0.78)
                : 267}{" "}
              | IPD:{" "}
              {stats.totalPatients
                ? stats.totalPatients - Math.round(stats.totalPatients * 0.78)
                : 75}
            </div>
          </div>
        </div>

        {/* Total Doctors */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-[10px] flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="bg-rose-500/10 p-2 rounded-[10px] text-rose-600">
              <Stethoscope className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-[6px] flex items-center gap-0.5">
              <ArrowUpRight className="h-2.5 w-2.5" /> +4.3%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-800 dark:text-zinc-150 tracking-tight">
              {stats.totalDoctors || 10}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
              Total Doctors
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">
              Verified active
            </div>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-[10px] flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="bg-rose-500/10 p-2 rounded-[10px] text-rose-600">
              <CalendarDays className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-[6px] flex items-center gap-0.5">
              <ArrowUpRight className="h-2.5 w-2.5" /> +15.1%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-800 dark:text-zinc-150 tracking-tight">
              {stats.totalAppointments || 5}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
              Total Bookings
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">
              All time logs
            </div>
          </div>
        </div>

        {/* New Admissions */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-[10px] flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="bg-rose-500/10 p-2 rounded-[10px] text-rose-600">
              <UserCheck className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-[6px] flex items-center gap-0.5">
              <ArrowUpRight className="h-2.5 w-2.5" /> +12.0%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-800 dark:text-zinc-150 tracking-tight">
              28
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
              New Admissions
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">
              Last 24 hours
            </div>
          </div>
        </div>

        {/* Occupied Beds */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-[10px] flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="bg-rose-500/10 p-2 rounded-[10px] text-rose-600">
              <Bed className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-red-650 bg-red-50 dark:bg-red-950/20 px-1.5 py-0.5 rounded-[6px] flex items-center gap-0.5">
              <ArrowDownRight className="h-2.5 w-2.5" /> -3.5%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-800 dark:text-zinc-150 tracking-tight">
              184/250
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
              Occupied Beds
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">
              73.6% occupancy
            </div>
          </div>
        </div>

        {/* Active Emergency */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-[10px] flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="bg-rose-500/10 p-2 rounded-[10px] text-rose-600">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-[6px] flex items-center gap-0.5">
              <ArrowUpRight className="h-2.5 w-2.5" /> +2
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-800 dark:text-zinc-150 tracking-tight">
              12
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
              Active Emergency
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">
              4 critical cases
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-[10px] flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="bg-rose-500/10 p-2 rounded-[10px] text-rose-600 flex items-center justify-center">
              <i className="fa-solid fa-bangladeshi-taka-sign text-xs shrink-0"></i>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-[6px] flex items-center gap-0.5">
              <ArrowUpRight className="h-2.5 w-2.5" /> +15.3%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-800 dark:text-zinc-150 tracking-tight">
              2.4M ৳
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
              Today's Revenue
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">
              Target: 2.8M ৳
            </div>
          </div>
        </div>

        {/* Avg Wait Time */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-[10px] flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="bg-rose-500/10 p-2 rounded-[10px] text-rose-600">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-red-650 bg-red-50 dark:bg-red-950/20 px-1.5 py-0.5 rounded-[6px] flex items-center gap-0.5">
              <ArrowDownRight className="h-2.5 w-2.5" /> -12.5%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-800 dark:text-zinc-150 tracking-tight">
              18 min
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
              Avg Wait Time
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">
              Target: &lt;20 min
            </div>
          </div>
        </div>
      </div>

      {/* 2. Charts and Revenue Summaries Row */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Weekly Revenue Trend Bar Chart */}
          <div className="bg-white dark:bg-zinc-900 rounded-[10px] p-5 shadow-sm lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">
                    Weekly Revenue Trend
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Revenue by department (in Million ETB)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select className="border border-slate-200 dark:border-zinc-800 rounded-[8px] px-2.5 py-1 text-[10px] bg-slate-50 dark:bg-zinc-950 text-slate-650 dark:text-zinc-450 font-bold outline-none cursor-pointer">
                    <option>This Week</option>
                    <option>Last Week</option>
                  </select>
                  <button className="border border-slate-200 dark:border-zinc-800 rounded-[8px] px-2.5 py-1 text-[10px] bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 text-slate-650 dark:text-zinc-450 font-bold transition-all cursor-pointer">
                    Export
                  </button>
                </div>
              </div>

              {/* Chart container — Increased bar width from 6 to 16 */}
              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyRevenue} barSize={16}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="day"
                      tick={axisStyle}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar
                      dataKey="OPD"
                      fill="#3b82f6"
                      radius={[3, 3, 0, 0]}
                      name="OPD Consults"
                    />
                    <Bar
                      dataKey="IPD"
                      fill="#1d4ed8"
                      radius={[3, 3, 0, 0]}
                      name="IPD Services"
                    />
                    <Bar
                      dataKey="Lab"
                      fill="#f59e0b"
                      radius={[3, 3, 0, 0]}
                      name="Laboratory"
                    />
                    <Bar
                      dataKey="Pharmacy"
                      fill="#10b981"
                      radius={[3, 3, 0, 0]}
                      name="Pharmacy"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom summary details */}
            <div className="grid grid-cols-4 gap-2 border-t border-slate-100 dark:border-zinc-800 pt-4 mt-4 text-center">
              <div>
                <span className="text-[9px] text-slate-400 block lowercase font-medium">
                  week total
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">
                  14.8M ETB
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block lowercase font-medium">
                  avg/day
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">
                  2.1M ETB
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block lowercase font-medium">
                  best day
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">
                  Thu (6.2M)
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block lowercase font-medium">
                  growth
                </span>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-[6px] inline-block">
                  +12.5%
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Summary and breakdowns */}
          <div className="bg-white dark:bg-zinc-900 rounded-[10px] p-5 shadow-sm lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">
                    Revenue Summary
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Today's breakdown
                  </p>
                </div>
                <Link
                  href="/dashboard/admin/payments"
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-500  hover:underline"
                >
                  View Details
                </Link>
              </div>

              {/* Rose banner container */}
              <div className="bg-rose-500/5 p-3.5 rounded-[10px] text-left mb-6">
                <span className="text-[9px] font-semibold text-rose-600/70 dark:text-rose-500 /70 tracking-wide block uppercase">
                  Total Revenue
                </span>
                <div className="text-xl font-extrabold text-rose-600 dark:text-rose-500  tracking-tight mt-0.5">
                  2.40M ETB
                </div>
                <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">
                  +15.2% from yesterday
                </span>
              </div>

              {/* Progress bars */}
              <div className="space-y-3.5">
                {[
                  {
                    label: "OPD Consultations",
                    value: "842,500 ETB",
                    percent: 35,
                    color: "bg-blue-500",
                    trend: "+0.2%",
                  },
                  {
                    label: "IPD Services",
                    value: "1,243,800 ETB",
                    percent: 52,
                    color: "bg-indigo-600",
                    trend: "+12.5%",
                  },
                  {
                    label: "Laboratory",
                    value: "186,400 ETB",
                    percent: 8,
                    color: "bg-amber-500",
                    trend: "-2.1%",
                    isDown: true,
                  },
                  {
                    label: "Pharmacy",
                    value: "125,300 ETB",
                    percent: 5,
                    color: "bg-emerald-500",
                    trend: "-5.8%",
                    isDown: true,
                  },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-zinc-300">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                        <span className="text-slate-800 dark:text-zinc-200">
                          {item.value}
                        </span>
                        <span
                          className={
                            item.isDown ? "text-red-500" : "text-emerald-500"
                          }
                        >
                          {item.trend}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-[9px] w-full overflow-hidden">
                      <div
                        className={`h-full rounded-[9px] ${item.color}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Target gauge section */}
            <div className="border-t border-slate-100 dark:border-zinc-800 pt-4 mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 dark:text-zinc-300">
                  Monthly Target
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  48.2M / 70M ETB
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded-[9px] flex-1 overflow-hidden">
                  <div
                    className="h-full rounded-[9px] bg-rose-600"
                    style={{ width: "68.5%" }}
                  />
                </div>
                <span className="text-xs font-extrabold text-rose-600 dark:text-rose-500 ">
                  68.5%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. OPD vs IPD and Department Performance grids */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* OPD vs IPD Distribution & Department list */}
          <div className="bg-white dark:bg-zinc-900 rounded-[10px] p-5 shadow-sm lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">
                    OPD vs IPD Distribution
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Patient count for today
                  </p>
                </div>
                <Link
                  href="/dashboard/admin/appointments"
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-500  hover:underline"
                >
                  View Details
                </Link>
              </div>

              {/* Pie chart — Increased height to h-60, and radii to innerRadius={65} / outerRadius={95} */}
              <div className="flex items-center justify-center h-60 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center text overlay */}
                <div className="absolute text-center">
                  <span className="text-slate-400 text-[9px] block lowercase font-medium">
                    total patients
                  </span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-zinc-200">
                    342
                  </span>
                </div>
              </div>

              {/* Legends & Ratios */}
              <div className="flex items-center justify-center gap-6 mt-2 text-xs border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <span className="text-slate-500 font-semibold text-[11px]">
                    OPD:{" "}
                    <strong className="text-slate-700 dark:text-zinc-200">
                      267
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-500 font-semibold text-[11px]">
                    IPD:{" "}
                    <strong className="text-slate-700 dark:text-zinc-200">
                      75
                    </strong>
                  </span>
                </div>
              </div>

              {/* Ratios row */}
              <div className="grid grid-cols-2 gap-2 text-center py-2.5 border-b border-slate-100 dark:border-zinc-800 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 block lowercase font-medium">
                    OPD ratio
                  </span>
                  <span className="font-extrabold text-rose-600 dark:text-rose-500  text-sm">
                    78.1%
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block lowercase font-medium">
                    IPD ratio
                  </span>
                  <span className="font-extrabold text-emerald-600 text-sm">
                    21.9%
                  </span>
                </div>
              </div>

              {/* Department breakdown horizontal list */}
              <div className="space-y-2.5 mt-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Department-wise Breakdown
                </span>
                {[
                  {
                    label: "General Medicine",
                    value: 90,
                    percent: 90,
                    color: "bg-rose-500",
                  },
                  {
                    label: "Pediatrics",
                    value: 70,
                    percent: 70,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Surgery",
                    value: 39,
                    percent: 39,
                    color: "bg-indigo-600",
                  },
                  {
                    label: "Cardiology",
                    value: 39,
                    percent: 39,
                    color: "bg-red-500",
                  },
                  {
                    label: "Orthopedics",
                    value: 37,
                    percent: 37,
                    color: "bg-amber-500",
                  },
                  {
                    label: "Others",
                    value: 67,
                    percent: 67,
                    color: "bg-slate-550",
                  },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-655 dark:text-zinc-400">
                        {item.label}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-zinc-200">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-1 bg-slate-50 dark:bg-zinc-800 rounded-[9px] w-full overflow-hidden">
                      <div
                        className={`h-full rounded-[9px] ${item.color}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Performance and efficiency bar / table */}
          <div className="bg-white dark:bg-zinc-900 rounded-[10px] p-5 shadow-sm lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">
                    Department Performance
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Today's efficiency metrics
                  </p>
                </div>
                <Link
                  href="/dashboard/admin/emergency"
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-500  hover:underline"
                >
                  Full Report
                </Link>
              </div>

              {/* Performance chart — Increased barSize from 20 to 32 */}
              <div className="h-44 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentPerformance} barSize={32}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="name"
                      tick={axisStyle}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={axisStyle}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar
                      dataKey="efficiency"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Efficiency (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Performance Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-2 font-bold">Department</th>
                      <th className="py-2 font-bold">Patients</th>
                      <th className="py-2 font-bold text-center">Efficiency</th>
                      <th className="py-2 font-bold text-right">
                        Satisfaction
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Emergency",
                        patients: 142,
                        eff: "92%",
                        sat: "88%",
                      },
                      { name: "Surgery", patients: 89, eff: "95%", sat: "94%" },
                      {
                        name: "Pediatrics",
                        patients: 126,
                        eff: "88%",
                        sat: "91%",
                        isDown: true,
                      },
                      {
                        name: "Cardiology",
                        patients: 78,
                        eff: "91%",
                        sat: "89%",
                      },
                    ].map((row) => (
                      <tr
                        key={row.name}
                        className="border-b border-slate-50 dark:border-zinc-800/50 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 font-medium"
                      >
                        <td className="py-2.5 font-bold">{row.name}</td>
                        <td className="py-2.5">{row.patients}</td>
                        <td className="py-2.5 text-center flex items-center justify-center gap-1">
                          <span className="font-semibold">{row.eff}</span>
                          <span
                            className={`text-[9px] ${row.isDown ? "text-red-500" : "text-emerald-500"}`}
                          >
                            {row.isDown ? "▼" : "▲"}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-semibold">
                          {row.sat}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom summary performance values */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-zinc-800 pt-4 mt-4 text-center text-xs">
              <div>
                <span className="text-[9px] text-slate-400 block lowercase font-medium">
                  avg efficiency
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">
                  91.2%
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block lowercase font-medium">
                  avg satisfaction
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">
                  89.8%
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block lowercase font-medium">
                  total patients
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">
                  685
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3.5 Doctor Performance Analytics Row */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
          {/* Doctor Performance Bar Chart */}
          <div className="bg-white dark:bg-zinc-900 rounded-[10px] p-5 shadow-sm lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">
                    Doctor Performance
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Average patient rating per specialist (out of 5.0)
                  </p>
                </div>
                <Link
                  href="/dashboard/admin/doctors"
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-500  hover:underline"
                >
                  Manage Doctors
                </Link>
              </div>

              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={doctorRatings} barSize={20}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="name"
                      tick={axisStyle}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 5]}
                      tick={axisStyle}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: any) => [`${v} ★`, "Avg. Rating"]}
                    />
                    <Bar dataKey="rating" fill="#5B65DC" radius={[3, 3, 0, 0]}>
                      {doctorRatings.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.rating >= 4.7 ? "#10b981" : "#5B65DC"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Rated Doctors Leaderboard */}
          <div className="bg-white dark:bg-zinc-900 rounded-[10px] p-5 shadow-sm lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">
                    Top Specialists
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Highly rated clinicians
                  </p>
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-[6px]">
                  Leaderboard
                </span>
              </div>

              <div className="space-y-4">
                {topDoctors.map((doc, idx) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center text-xs shrink-0 border border-emerald-500/10">
                        {doc.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-855 dark:text-zinc-200">
                          Dr. {doc.name}
                        </div>
                        <div className="text-[9px] text-slate-405 dark:text-zinc-500 font-medium">
                          {doc.specialization}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-0.5 text-xs font-extrabold text-amber-500">
                        <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" />
                        {doc.rating}
                      </div>
                      <span className="text-[8px] text-slate-400">
                        {doc.reviewsCount} reviews
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Quick Navigations & System Alerts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Quick Navigation Panel */}
        <div className="bg-white dark:bg-zinc-900 rounded-[10px] p-5 shadow-sm lg:col-span-8">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">
              Quick Navigation
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 mb-5">
              Access key hospital management modules
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                title: "Patient Management",
                desc: "View, admit, and manage patient records",
                count: "1,247",
                icon: Users,
                link: "/dashboard/admin/users",
              },
              {
                title: "Appointments",
                desc: "Schedule and manage appointments",
                count: "88 today",
                icon: CalendarDays,
                link: "/dashboard/admin/appointments",
              },
              {
                title: "Billing & Payments",
                desc: "Process payments and generate invoices",
                count: "2.4M today",
                icon: DollarSign,
                link: "/dashboard/admin/payments",
              },
              {
                title: "Bed Management",
                desc: "Monitor bed availability and occupancy",
                count: "184/250 occupied",
                icon: Bed,
                link: "/dashboard/admin/bed-management",
              },
              {
                title: "Pharmacy",
                desc: "Manage inventory and prescriptions",
                count: "12 low stock",
                icon: Pill,
                link: "/dashboard/admin/pharmacy",
              },
              {
                title: "Laboratory",
                desc: "Track tests and manage lab operations",
                count: "45 pending",
                icon: FlaskConical,
                link: "/dashboard/admin/laboratory",
              },
              {
                title: "Medical Records",
                desc: "Access electronic health records",
                icon: FileText,
                link: "/dashboard/admin/medical-records",
              },
              {
                title: "Emergency Management",
                desc: "Emergency department triage control",
                count: "12 active",
                icon: Activity,
                link: "/dashboard/admin/emergency",
              },
              {
                title: "System Settings",
                desc: "Configure system and user settings",
                icon: Settings,
                link: "/dashboard/admin/settings",
              },
            ].map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.title}
                  href={module.link}
                  className="p-3 bg-slate-50/30 dark:bg-zinc-950/10 rounded-[10px] hover:bg-white dark:hover:bg-zinc-900 hover:border-rose-500/20 hover:shadow-md transition-all flex flex-col justify-between h-32 group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="p-1.5 rounded-[8px] bg-rose-500/10 text-rose-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      {module.count && (
                        <span className="text-[8px] font-bold text-slate-500 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-[6px]">
                          {module.count}
                        </span>
                      )}
                    </div>
                    <div className="mt-2.5">
                      <h4 className="text-[11px] font-bold text-slate-850 dark:text-zinc-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
                        {module.title}
                      </h4>
                      <p className="text-[9px] text-slate-400 dark:text-zinc-500 leading-tight mt-0.5 line-clamp-2">
                        {module.desc}
                      </p>
                    </div>
                  </div>
                  <div className="text-[9px] font-bold text-rose-600 dark:text-rose-500  flex items-center justify-end gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Manage</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Alerts list */}
        <div className="bg-white dark:bg-zinc-900 rounded-[10px] p-5 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">
                  System Alerts
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Recent notifications
                </p>
              </div>
              <Link
                href="#"
                className="text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-500  hover:underline"
              >
                View All
              </Link>
            </div>

            {/* Alert List items */}
            <div className="space-y-3">
              {/* Critical Alert */}
              <div className="p-3 bg-red-500/5 text-red-700 dark:text-red-400 rounded-[10px] flex gap-3 items-start">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      ICU Bed Shortage
                    </span>
                    <span className="text-[8px] bg-red-100 dark:bg-red-950 px-1.5 py-0.5 rounded-[6px] shrink-0 font-extrabold">
                      ICU
                    </span>
                  </div>
                  <p className="text-[10px] leading-tight text-red-650/90 dark:text-red-400/80">
                    Only 2 ICU beds available. Consider transfer arrangements.
                  </p>
                  <span className="text-[8px] text-slate-400 block mt-1">
                    🕒 5 min ago
                  </span>
                </div>
              </div>

              {/* Warning Alert */}
              <div className="p-3 bg-amber-500/5 text-amber-700 dark:text-amber-400 rounded-[10px] flex gap-3 items-start">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-500 mt-0.5" />
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Medicine Stock Low
                    </span>
                    <span className="text-[8px] bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded-[6px] shrink-0 font-extrabold">
                      Pharmacy
                    </span>
                  </div>
                  <p className="text-[10px] leading-tight text-amber-600/90 dark:text-amber-400/80">
                    Paracetamol 500mg below minimum stock level (120 units).
                  </p>
                  <span className="text-[8px] text-slate-400 block mt-1">
                    🕒 12 min ago
                  </span>
                </div>
              </div>

              {/* Maintenance Alert */}
              <div className="p-3 bg-amber-500/5 text-amber-700 dark:text-amber-400 rounded-[10px] flex gap-3 items-start">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-500 mt-0.5" />
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Equipment Maintenance
                    </span>
                    <span className="text-[8px] bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded-[6px] shrink-0 font-extrabold">
                      Radiology
                    </span>
                  </div>
                  <p className="text-[10px] leading-tight text-amber-600/90 dark:text-amber-400/80">
                    CT Scanner #2 scheduled for maintenance at 3:00 PM.
                  </p>
                  <span className="text-[8px] text-slate-400 block mt-1">
                    🕒 45 min ago
                  </span>
                </div>
              </div>

              {/* Info Alert */}
              <div className="p-3 bg-slate-500/5 text-slate-750 dark:text-zinc-400 rounded-[10px] flex gap-3 items-start">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-slate-500 mt-0.5" />
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Staff Meeting
                    </span>
                    <span className="text-[8px] bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-[6px] shrink-0 font-extrabold">
                      General
                    </span>
                  </div>
                  <p className="text-[10px] leading-tight text-slate-655/90 dark:text-zinc-450">
                    Department heads meeting scheduled at 4:30 PM today.
                  </p>
                  <span className="text-[8px] text-slate-400 block mt-1">
                    🕒 1 hour ago
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom alert summaries */}
          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-zinc-800 pt-4 mt-4 text-center text-xs">
            <div className="flex items-center justify-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-slate-550">
                Critical:{" "}
                <strong className="text-slate-700 dark:text-zinc-200">1</strong>
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-slate-550">
                Warning:{" "}
                <strong className="text-slate-700 dark:text-zinc-200">3</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
