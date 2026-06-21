'use client';

import React, { useState, useEffect } from 'react';
import { db, User } from '../../../../lib/mockDb';
import { toast } from 'react-toastify';
import {
  FiUsers, FiSearch, FiFilter, FiTrash2, FiUserCheck,
  FiUserX, FiShieldOff, FiMoreVertical, FiChevronDown,
  FiChevronRight, FiUserPlus
} from 'react-icons/fi';
import {
  RiAdminLine, RiNurseLine
} from 'react-icons/ri';
import {
  MdOutlineLocalPharmacy, MdOutlineScience
} from 'react-icons/md';
import { Stethoscope, HeartPulse } from 'lucide-react';

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  admin:       { label: 'Admin',       color: 'text-purple-600 dark:text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20', icon: <RiAdminLine className="h-3 w-3" /> },
  doctor:      { label: 'Doctor',      color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Stethoscope className="h-3 w-3" /> },
  patient:     { label: 'Patient',     color: 'text-rose-600 dark:text-rose-400',      bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    icon: <HeartPulse className="h-3 w-3" /> },
  nurse:       { label: 'Nurse',       color: 'text-cyan-600 dark:text-cyan-400',      bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    icon: <RiNurseLine className="h-3 w-3" /> },
  lab:         { label: 'Lab Staff',   color: 'text-blue-600 dark:text-blue-400',      bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    icon: <MdOutlineScience className="h-3 w-3" /> },
  pharmacist:  { label: 'Pharmacist',  color: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: <MdOutlineLocalPharmacy className="h-3 w-3" /> },
};

const AVATARS = [
  'from-rose-500 to-pink-600','from-violet-500 to-purple-600','from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600','from-amber-500 to-orange-600','from-indigo-500 to-blue-600',
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => { loadUsers(); }, []);
  useEffect(() => {
    const h = () => setDropdownOpen(null);
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, []);

  const loadUsers = () => setUsers(db.getUsers());

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const target = db.getUsers().find(u => u.id === userId);
    db.setUsers(db.getUsers().map(u => u.id === userId ? { ...u, status: newStatus as 'active' | 'suspended' } : u));
    loadUsers();
    if (newStatus === 'suspended') {
      toast.warning(`${target?.name} has been suspended.`);
    } else {
      toast.success(`${target?.name} is now active.`);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const target = db.getUsers().find(u => u.id === userId);
    if (!confirm(`Permanently delete ${target?.name}?`)) return;
    db.setUsers(db.getUsers().filter(u => u.id !== userId));
    db.setDoctors(db.getDoctors().filter(d => d.id !== userId));
    loadUsers();
    toast.error(`${target?.name}'s account has been deleted.`);
  };

  const counts = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    doctor: users.filter(u => u.role === 'doctor').length,
    patient: users.filter(u => u.role === 'patient').length,
    nurse: users.filter(u => u.role === 'nurse').length,
    lab: users.filter(u => u.role === 'lab').length,
    pharmacist: users.filter(u => u.role === 'pharmacist').length,
  };

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-7">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
            <span>Admin</span>
            <FiChevronRight className="h-3 w-3" />
            <span className="text-rose-500">User Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <FiUsers className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            Manage Accounts
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">
            Control access, roles, and account status across all registered users.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-md transition-all shadow-lg shadow-rose-500/20 cursor-pointer shrink-0">
          <FiUserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { label: 'Total', value: counts.total, color: 'text-slate-600 dark:text-zinc-300', bg: 'bg-slate-500/10', border: 'border-slate-200 dark:border-zinc-800' },
          { label: 'Admins', value: counts.admin, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-200 dark:border-purple-900/50' },
          { label: 'Doctors', value: counts.doctor, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-900/50' },
          { label: 'Patients', value: counts.patient, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-200 dark:border-rose-900/50' },
          { label: 'Nurses', value: counts.nurse, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-200 dark:border-cyan-900/50' },
          { label: 'Lab', value: counts.lab, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-200 dark:border-blue-900/50' },
          { label: 'Pharmacy', value: counts.pharmacist, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-200 dark:border-amber-900/50' },
        ].map(stat => (
          <div key={stat.label} className={`bg-white dark:bg-zinc-900 border ${stat.border} rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover:shadow-md transition-shadow text-center`}>
            <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Search & Filters ── */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-800/50 px-3 py-2 w-full sm:w-72 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition-all">
          <FiSearch className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="bg-transparent outline-none text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 w-full"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FiFilter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          {(['all', 'admin', 'doctor', 'patient', 'nurse', 'lab', 'pharmacist'] as const).map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                roleFilter === role
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              {role === 'all' ? `All (${counts.total})` : role}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      {filtered.length > 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">User Registry</h2>
            <span className="text-[11px] text-slate-400 font-semibold">
              {filtered.length} of {users.length} users
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                  {['User', 'Role', 'Contact', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {filtered.map((u, idx) => {
                  const rc = ROLE_CONFIG[u.role] || ROLE_CONFIG.patient;
                  const gradient = AVATARS[idx % AVATARS.length];
                  const isOpen = dropdownOpen === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-rose-50/30 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {u.photo ? (
                            <img src={u.photo} alt={u.name} className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-zinc-700 shadow-sm shrink-0" />
                          ) : (
                            <div className={`h-10 w-10 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center text-white text-xs font-extrabold shrink-0`}>
                              {initials(u.name)}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-bold text-slate-800 dark:text-zinc-100 leading-tight">{u.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[160px]">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${rc.color} ${rc.bg} ${rc.border}`}>
                          {rc.icon}
                          {rc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs font-semibold text-slate-700 dark:text-zinc-200">{u.phone || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400 capitalize mt-0.5">{u.gender || '—'}</div>
                      </td>
                      <td className="px-5 py-4">
                        {u.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Suspended
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs text-slate-500 dark:text-zinc-400">
                          {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {u.status === 'active' ? (
                            <button
                              onClick={() => handleToggleStatus(u.id, u.status)}
                              className="flex items-center gap-1.5 text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              <FiShieldOff className="h-3.5 w-3.5" />
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(u.id, u.status)}
                              className="flex items-center gap-1.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                              <FiUserCheck className="h-3.5 w-3.5" />
                              Activate
                            </button>
                          )}
                          <div className="relative">
                            <button
                              onClick={e => { e.stopPropagation(); setDropdownOpen(isOpen ? null : u.id); }}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 rounded-lg transition-colors cursor-pointer"
                            >
                              <FiMoreVertical className="h-4 w-4" />
                            </button>
                            {isOpen && (
                              <div className="absolute right-0 top-8 z-20 w-40 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden">
                                <button
                                  onClick={() => { setDropdownOpen(null); handleDeleteUser(u.id); }}
                                  className="flex items-center gap-2 w-full px-3 py-2.5 text-[11px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                                >
                                  <FiTrash2 className="h-3.5 w-3.5" />
                                  Delete Account
                                </button>
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
          <div className="px-6 py-3.5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">
              Showing <span className="text-slate-700 dark:text-zinc-200 font-bold">{filtered.length}</span> of <span className="text-slate-700 dark:text-zinc-200 font-bold">{users.length}</span> users
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-400">{users.filter(u => u.status === 'active').length} active accounts</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl py-20 flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
            <FiUsers className="h-8 w-8 text-slate-300 dark:text-zinc-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No users found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or role filter.</p>
          </div>
          <button onClick={() => { setSearch(''); setRoleFilter('all'); }} className="text-xs font-bold text-rose-600 border border-rose-500/30 px-4 py-2 rounded-xl hover:bg-rose-50 transition-all cursor-pointer">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
