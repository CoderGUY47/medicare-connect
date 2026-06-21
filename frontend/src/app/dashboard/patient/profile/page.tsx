'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { FiChevronRight, FiSave, FiCamera } from 'react-icons/fi';
import { FaUser, FaPhone, FaLink, FaVenusMars, FaEnvelope, FaIdCard, FaShieldAlt } from 'react-icons/fa';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { BsCheckCircleFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { db } from '../../../../lib/mockDb';

const profileSchema = zod.object({
  name:   zod.string().min(2, 'Name must be at least 2 characters'),
  phone:  zod.string().min(6, 'Please enter a valid phone number'),
  photo:  zod.string().url('Please enter a valid photo URL').or(zod.literal('')),
  gender: zod.string(),
});

type ProfileFormValues = zod.infer<typeof profileSchema>;

export default function PatientProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'stats'>('info');

  const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', phone: '', photo: '', gender: 'male' },
  });

  const photoVal = watch('photo');

  useEffect(() => {
    if (user) reset({ name: user.name, phone: user.phone || '', photo: user.photo || '', gender: user.gender || 'male' });
  }, [user, reset]);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile({ name: values.name, phone: values.phone, photo: values.photo, gender: values.gender as 'male' | 'female' | 'other' });
    toast.success('Profile updated successfully!');
  };

  // Stats
  const appointments = db.getAppointments().filter(a => a.patientId === user?.id);
  const payments = db.getPayments().filter(p => p.patientId === user?.id);
  const reviews = db.getReviews().filter(r => r.patientId === user?.id);
  const stats = {
    totalApts: appointments.length,
    completed: appointments.filter(a => a.appointmentStatus === 'completed').length,
    totalSpent: payments.reduce((s, p) => s + p.amount, 0),
    reviews: reviews.length,
  };

  const initials = user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A';

  return (
    <div className="space-y-7">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
          <span>Patient</span><FiChevronRight className="h-3 w-3" /><span className="text-rose-500">Profile</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <MdOutlineManageAccounts className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          My Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">Manage your personal information and account settings.</p>
      </div>

      {/* Profile Hero Card */}
      <div className="relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Cover */}
        <div className="h-28 bg-linear-to-r from-rose-600 via-rose-500 to-pink-500 relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar + Name row — both left-aligned, connected */}
          <div className="flex items-end gap-5">
            {/* Avatar with negative margin to overlap the cover */}
            <div className="relative shrink-0 -mt-14">
              {(photoVal || user?.photo) ? (
                <img
                  src={photoVal || user?.photo}
                  alt={user?.name}
                  className="h-24 w-24 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-xl"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="h-24 w-24 rounded-2xl bg-rose-600 border-4 border-white dark:border-zinc-900 shadow-xl flex items-center justify-center text-white text-2xl font-extrabold">
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
            </div>

            {/* Name + role — inline next to avatar */}
            <div className="pb-1 min-w-0">
              <div className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 truncate">{user?.name}</div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs font-bold text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 uppercase tracking-wider">Patient</span>
                <span className="text-xs text-slate-400 dark:text-zinc-500">Member since {memberSince}</span>
              </div>
            </div>
          </div>

          {/* Stat mini-row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {[
              { label: 'Appointments', value: stats.totalApts,        color: 'text-rose-600 dark:text-rose-400' },
              { label: 'Completed',    value: stats.completed,        color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Total Spent',  value: `$${stats.totalSpent}`, color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Reviews',      value: stats.reviews,          color: 'text-amber-600 dark:text-amber-400' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3 text-center">
                <div className={`text-lg font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-1.5 w-fit flex-wrap">
        {([
          { id: 'info',     label: 'Personal Info' },
          { id: 'security', label: 'Security' },
          { id: 'stats',    label: 'Activity' },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${activeTab === tab.id ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Personal Info Tab ── */}
      {activeTab === 'info' && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-2">
            <FaUser className="h-4 w-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Personal Information</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Photo preview inline */}
            <div className="flex items-start gap-5">
              <div>
                {(photoVal || user?.photo) ? (
                  <img src={photoVal || user?.photo} alt="Preview"
                    className="h-16 w-16 rounded-xl object-cover border-2 border-slate-200 dark:border-zinc-700 shadow-sm"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-slate-100 dark:bg-zinc-800 border-2 border-dashed border-slate-300 dark:border-zinc-600 flex items-center justify-center">
                    <FiCamera className="h-5 w-5 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-1.5">
                  <span className="flex items-center gap-1.5"><FaLink className="h-3 w-3" /> Profile Photo URL</span>
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  {...register('photo')}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
                {errors.photo && <p className="text-[10px] text-red-500 mt-1">{errors.photo.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-1.5">
                  <span className="flex items-center gap-1.5"><FaUser className="h-3 w-3" /> Full Name</span>
                </label>
                <input type="text" placeholder="Jane Doe" {...register('name')}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" />
                {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-1.5">
                  <span className="flex items-center gap-1.5"><FaPhone className="h-3 w-3" /> Phone Number</span>
                </label>
                <input type="text" placeholder="+1 (555) 000-0000" {...register('phone')}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" />
                {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone.message}</p>}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-1.5">
                  <span className="flex items-center gap-1.5"><FaEnvelope className="h-3 w-3" /> Email Address</span>
                </label>
                <div className="w-full bg-slate-100 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-slate-500 dark:text-zinc-400 select-none">
                  {user?.email}
                  <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Immutable</span>
                </div>
              </div>

              {/* Role (read-only) */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-1.5">
                  <span className="flex items-center gap-1.5"><FaIdCard className="h-3 w-3" /> Account Role</span>
                </label>
                <div className="w-full bg-slate-100 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-slate-500 dark:text-zinc-400 capitalize select-none">
                  {user?.role}
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-2">
                <span className="flex items-center gap-1.5"><FaVenusMars className="h-3 w-3" /> Gender</span>
              </label>
              <div className="flex gap-3">
                {(['male','female','other'] as const).map(g => (
                  <label key={g} className="flex-1 cursor-pointer">
                    <input type="radio" {...register('gender')} value={g} className="sr-only peer" />
                    <div className="py-2.5 text-center text-xs font-bold rounded-md border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 peer-checked:border-rose-500 peer-checked:bg-rose-500/10 peer-checked:text-rose-600 dark:peer-checked:text-rose-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all capitalize">
                      {g}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit"
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2.5 rounded-md transition-all shadow-lg shadow-rose-500/20 cursor-pointer">
                <FiSave className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Security Tab ── */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-2">
            <FaShieldAlt className="h-4 w-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Account Security</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: 'Account Status', value: user?.status || 'active', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border border-emerald-500/20' },
              { label: 'Patient ID',     value: user?.id || '—',         color: 'text-slate-600 dark:text-zinc-300',      bg: 'bg-slate-100 dark:bg-zinc-800' },
              { label: 'Role',           value: user?.role || '—',       color: 'text-rose-600 dark:text-rose-400',       bg: 'bg-rose-500/10 border border-rose-500/20' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-zinc-800 last:border-0">
                <div className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{item.label}</div>
                <div className={`text-xs font-bold px-3 py-1.5 rounded-xl capitalize font-mono ${item.bg} ${item.color}`}>{item.value}</div>
              </div>
            ))}

            <div className="mt-4 bg-blue-500/5 border border-blue-500/15 rounded-xl p-4 flex items-start gap-3">
              <FaShieldAlt className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-slate-800 dark:text-zinc-100">Account Protected</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Your account is secured via Medi-Doc's authentication system. 
                  Contact an administrator to change your password or role.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Activity Tab ── */}
      {activeTab === 'stats' && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Activity Summary</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: 'Total Appointments Booked', value: stats.totalApts,         color: 'text-rose-600 dark:text-rose-400',       icon: '📅' },
              { label: 'Completed Consultations',   value: stats.completed,         color: 'text-emerald-600 dark:text-emerald-400', icon: '✅' },
              { label: 'Total Amount Paid (USD)',    value: `$${stats.totalSpent}`,  color: 'text-blue-600 dark:text-blue-400',       icon: '💳' },
              { label: 'Doctor Reviews Written',     value: stats.reviews,           color: 'text-amber-600 dark:text-amber-400',     icon: '⭐' },
              { label: 'Member Since',               value: memberSince,             color: 'text-violet-600 dark:text-violet-400',   icon: '🏥' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-zinc-800 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{item.label}</span>
                </div>
                <span className={`text-sm font-extrabold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
