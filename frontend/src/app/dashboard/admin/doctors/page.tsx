'use client';

import React, { useState, useEffect, useCallback } from 'react';

import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Stethoscope,
  Star,
  BadgeCheck,
  TrendingUp,
  UserCheck,
  Filter,
  MoreVertical,
  Eye,
  ChevronDown,
  Loader2,
  WifiOff,
} from 'lucide-react';

interface MongoDoctor {
  _id?: string;
  id: string;
  doctorName: string;
  specialization: string;
  qualifications: string;
  experience: number;
  consultationFee: number;
  hospitalName: string;
  profileImage: string;
  verificationStatus: string;
  availableDays: string[];
  availableSlots: string[];
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<MongoDoctor[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const getBackendUrl = () =>
    (typeof window !== 'undefined' && localStorage.getItem('mc_backend_url')) ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'https://backend-nu-rosy-20.vercel.app';

  const loadDoctors = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${getBackendUrl()}/doctors`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data: MongoDoctor[] = await res.json();
      setDoctors(data);
    } catch (err: any) {
      setFetchError('Could not reach the server. Retrying…');
      console.error('Failed to load doctors:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadDoctors(); }, [loadDoctors]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = () => setDropdownOpen(null);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const handleUpdateStatus = async (docId: string, status: 'verified' | 'rejected' | 'pending') => {
    // Optimistic update in local state
    setDoctors(prev => prev.map(d => d.id === docId ? { ...d, verificationStatus: status } : d));
    setSuccessMsg(`Doctor status updated to ${status.toUpperCase()}`);
    setDropdownOpen(null);
    setTimeout(() => setSuccessMsg(''), 3500);
    // TODO: persist status change to backend via PATCH /doctors/:id when that endpoint is ready
  };

  const counts = {
    total: doctors.length,
    verified: doctors.filter(d => d.verificationStatus === 'verified').length,
    pending: doctors.filter(d => d.verificationStatus === 'pending').length,
    rejected: doctors.filter(d => d.verificationStatus === 'rejected').length,
  };

  const filtered = doctors.filter(d => {
    const matchSearch = !search || d.doctorName.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase()) || d.hospitalName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === 'all' || d.verificationStatus === filterStatus;
    return matchSearch && matchFilter;
  });

  const statusConfig = {
    verified: {
      label: 'Verified',
      icon: BadgeCheck,
      pill: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400',
      dot: 'bg-emerald-500',
    },
    pending: {
      label: 'Pending',
      icon: Clock,
      pill: 'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400',
      dot: 'bg-amber-500',
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      pill: 'bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400',
      dot: 'bg-red-500',
    },
  };

  const specializationColors: Record<string, string> = {
    'Cardiology': 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    'Neurology': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    'Orthopedics': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'Pediatrics': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    'Dermatology': 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    'General Practice': 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  };

  const getSpecColor = (spec: string) =>
    specializationColors[spec] || 'bg-slate-500/10 text-slate-600 dark:text-slate-400';

  const initials = (name: string) =>
    name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const avatarGradients = [
    'from-rose-500 to-pink-600',
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-indigo-500 to-blue-600',
  ];

  return (
    <div className="space-y-7">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
            <span>Admin</span>
            <ChevronDown className="h-3 w-3 -rotate-90" />
            <span className="text-rose-500">Doctors</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            Doctor Verification
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">
            Audit credentials and manage specialist approvals across the network.
          </p>
        </div>

        {/* Action: Refresh button */}
        <button
          onClick={loadDoctors}
          disabled={isLoading}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-md transition-all shadow-lg shadow-rose-500/20 cursor-pointer shrink-0 disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {isLoading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Doctors', value: counts.total, icon: Stethoscope, color: 'text-slate-600 dark:text-zinc-300', bg: 'bg-slate-500/10', border: 'border-slate-200 dark:border-zinc-800' },
          { label: 'Verified', value: counts.verified, icon: BadgeCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-900/50' },
          { label: 'Pending Review', value: counts.pending, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-200 dark:border-amber-900/50' },
          { label: 'Rejected', value: counts.rejected, icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10', border: 'border-red-200 dark:border-red-900/50' },
        ].map((stat) => {
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

      {/* ── Filters & Search ── */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="flex items-center gap-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-800/50 px-3 py-2 w-full sm:w-72 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition-all">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, specialty, hospital…"
            className="bg-transparent outline-none text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 w-full"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          {(['all', 'verified', 'pending', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                filterStatus === f
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              {f === 'all' ? `All (${counts.total})` : f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading / Error states ── */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 gap-3 text-slate-400 dark:text-zinc-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm font-semibold">Loading doctors from MongoDB…</span>
        </div>
      )}
      {!isLoading && fetchError && (
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl px-4 py-3">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span className="text-xs font-semibold">{fetchError}</span>
          <button onClick={loadDoctors} className="ml-auto text-xs font-bold underline cursor-pointer">Retry</button>
        </div>
      )}

      {/* ── Success Toast ── */}
      {successMsg && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl px-4 py-3 animate-pulse">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span className="text-xs font-semibold">{successMsg}</span>
        </div>
      )}

      {/* ── Table Card ── */}
      {filtered.length > 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Table header bar */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
              Doctor Registry
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-semibold">
              {filtered.length} of {doctors.length} doctors
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                  {['Doctor', 'Specialization', 'Hospital', 'Experience', 'Fee', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {filtered.map((d, idx) => {
                  const sc = statusConfig[d.verificationStatus] || statusConfig.pending;
                  const StatusIcon = sc.icon;
                  const gradient = avatarGradients[idx % avatarGradients.length];
                  const isOpen = dropdownOpen === d.id;

                  return (
                    <tr key={d.id} className="hover:bg-rose-50/30 dark:hover:bg-zinc-800/40 transition-colors group">

                      {/* Doctor identity cell */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {d.profileImage ? (
                            <img
                              src={d.profileImage}
                              alt={d.doctorName}
                              className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-zinc-700 shadow-sm shrink-0"
                            />
                          ) : (
                            <div className={`h-10 w-10 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center text-white text-xs font-extrabold shrink-0 shadow-sm`}>
                              {initials(d.doctorName)}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-bold text-slate-800 dark:text-zinc-100 leading-tight">
                              {d.doctorName}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
                              {d.qualifications}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ${getSpecColor(d.specialization)}`}>
                          <Stethoscope className="h-3 w-3" />
                          {d.specialization}
                        </span>
                      </td>

                      {/* Hospital */}
                      <td className="px-5 py-4 max-w-[160px]">
                        <div className="text-xs font-semibold text-slate-700 dark:text-zinc-200 truncate">{d.hospitalName}</div>
                      </td>

                      {/* Experience */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="h-3 w-3 text-rose-400" />
                          <span className="text-sm font-bold text-slate-800 dark:text-zinc-100">{d.experience}</span>
                          <span className="text-[10px] text-slate-400">yrs</span>
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="px-5 py-4">
                        <div className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                          ৳{d.consultationFee}
                        </div>
                        <div className="text-[10px] text-slate-400">per visit</div>
                      </td>

                      {/* Status badge */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg ${sc.pill}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${sc.dot} shrink-0`} />
                          {sc.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {d.verificationStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(d.id, 'verified')}
                                className="flex items-center gap-1.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                              >
                                <BadgeCheck className="h-3.5 w-3.5" />
                                Verify
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(d.id, 'rejected')}
                                className="flex items-center gap-1.5 text-[11px] font-bold bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Reject
                              </button>
                            </>
                          )}
                          {d.verificationStatus === 'verified' && (
                            <button
                              onClick={() => handleUpdateStatus(d.id, 'pending')}
                              className="flex items-center gap-1.5 text-[11px] font-bold bg-slate-100 dark:bg-zinc-800 hover:bg-amber-500/10 text-slate-600 dark:text-zinc-300 hover:text-amber-600 border border-slate-200 dark:border-zinc-700 hover:border-amber-500/30 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                              Revoke
                            </button>
                          )}
                          {d.verificationStatus === 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(d.id, 'verified')}
                              className="flex items-center gap-1.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Re-verify
                            </button>
                          )}

                          {/* More options dropdown */}
                          <div className="relative">
                            <button
                              onClick={e => { e.stopPropagation(); setDropdownOpen(isOpen ? null : d.id); }}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 rounded-lg transition-colors cursor-pointer"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {isOpen && (
                              <div className="absolute right-0 top-8 z-20 w-40 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden">
                                <button className="flex items-center gap-2 w-full px-3 py-2.5 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer">
                                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                                  View Profile
                                </button>
                                <button className="flex items-center gap-2 w-full px-3 py-2.5 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer">
                                  <Star className="h-3.5 w-3.5 text-amber-400" />
                                  Reviews
                                </button>
                                {d.verificationStatus !== 'pending' && (
                                  <button
                                    onClick={() => handleUpdateStatus(d.id, 'pending')}
                                    className="flex items-center gap-2 w-full px-3 py-2.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                                  >
                                    <Clock className="h-3.5 w-3.5" />
                                    Set Pending
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-6 py-3.5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-semibold">
              Showing <span className="text-slate-700 dark:text-zinc-200 font-bold">{filtered.length}</span> of <span className="text-slate-700 dark:text-zinc-200 font-bold">{doctors.length}</span> doctors
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-400">{counts.verified} verified active</span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl py-20 flex flex-col items-center justify-center text-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
            <Stethoscope className="h-8 w-8 text-slate-300 dark:text-zinc-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No doctors found</p>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Try adjusting your search or filter criteria.</p>
          </div>
          <button
            onClick={() => { setSearch(''); setFilterStatus('all'); }}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 border border-rose-500/30 px-4 py-2 rounded-xl hover:bg-rose-50 transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
