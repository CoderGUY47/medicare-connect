'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/mockDb';
import {
  Bell, X, CheckCheck, Calendar, CreditCard,
  AlertCircle, Info, CheckCircle, ChevronRight
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'appointment' | 'payment' | 'system' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const TYPE_CFG = {
  appointment: { icon: Calendar,     bg: 'bg-blue-500/10',    icon_cls: 'text-blue-500',    badge: 'bg-blue-500' },
  payment:     { icon: CreditCard,   bg: 'bg-emerald-500/10', icon_cls: 'text-emerald-500', badge: 'bg-emerald-500' },
  system:      { icon: Info,         bg: 'bg-violet-500/10',  icon_cls: 'text-violet-500',  badge: 'bg-violet-500' },
  alert:       { icon: AlertCircle,  bg: 'bg-rose-500/10',    icon_cls: 'text-rose-500',    badge: 'bg-rose-500' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function buildUserNotifications(userId: string, role: string): Notification[] {
  const notes: Notification[] = [];

  if (role === 'patient') {
    const apts = db.getAppointments().filter(a => a.patientId === userId);
    const pays = db.getPayments().filter(p => p.patientId === userId);
    const docs = db.getDoctors();

    apts.slice(0, 3).forEach(apt => {
      const doc = docs.find(d => d.id === apt.doctorId);
      if (!apt || !doc) return;
      const statusLabel =
        apt.appointmentStatus === 'confirmed' ? '✅ Confirmed' :
        apt.appointmentStatus === 'completed' ? '✔ Completed' :
        apt.appointmentStatus === 'cancelled' ? '❌ Cancelled' : '⏳ Pending';
      notes.push({
        id: `apt-${apt.id}`,
        type: apt.appointmentStatus === 'cancelled' ? 'alert' : 'appointment',
        title: `Appointment ${statusLabel}`,
        message: `With ${doc.doctorName} on ${apt.appointmentDate} at ${apt.appointmentTime}`,
        time: apt.appointmentDate + 'T' + (apt.appointmentTime || '09:00'),
        read: false,
        link: '/dashboard/patient/appointments',
      });
    });

    pays.slice(0, 2).forEach(pay => {
      notes.push({
        id: `pay-${pay.id}`,
        type: 'payment',
        title: 'Payment Received',
        message: `৳${pay.amount} paid for consultation with ${pay.doctorName}`,
        time: pay.paymentDate,
        read: false,
        link: '/dashboard/patient/payments',
      });
    });
  }

  if (role === 'doctor') {
    const apts = db.getAppointments().filter(a => a.doctorId === userId);
    apts.slice(0, 3).forEach(apt => {
      notes.push({
        id: `apt-${apt.id}`,
        type: 'appointment',
        title: 'New Appointment Request',
        message: `Patient appointment on ${apt.appointmentDate} at ${apt.appointmentTime}`,
        time: apt.appointmentDate + 'T09:00',
        read: false,
        link: '/dashboard/doctor/appointments',
      });
    });
  }

  if (role === 'admin') {
    const users = db.getUsers();
    const recentUsers = users.filter(u => !['admin-1','doc-1','doc-2','pat-1','pat-2','nurse-1','lab-1','pharm-1'].includes(u.id));
    recentUsers.slice(0, 2).forEach(u => {
      notes.push({
        id: `user-${u.id}`,
        type: 'system',
        title: 'New User Registered',
        message: `${u.name} joined as ${u.role}`,
        time: u.createdAt,
        read: false,
        link: '/dashboard/admin/users',
      });
    });
  }

  // System / platform notifications (always shown)
  notes.push(
    {
      id: 'sys-fixes-1',
      type: 'system',
      title: 'Platform Update',
      message: 'Payment history & spending chart fixes are now live.',
      time: new Date(Date.now() - 5 * 60000).toISOString(),
      read: false,
    },
    {
      id: 'sys-2',
      type: 'system',
      title: 'Welcome to Medi-Doc!',
      message: 'Book consultations, manage prescriptions, and track payments all in one place.',
      time: new Date(Date.now() - 30 * 60000).toISOString(),
      read: false,
    }
  );

  // Sort by time desc
  notes.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  return notes;
}

const STORAGE_KEY = 'mc_read_notifications';

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);
  const toastFiredRef = useRef(false);

  // Load read state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setReadIds(new Set(JSON.parse(stored)));
  }, []);

  // Build notifications when user changes
  useEffect(() => {
    if (!user) return;
    const notes = buildUserNotifications(user.id, user.role);
    setNotifications(notes);

    // Fire toast for the most recent unread notification (once per session)
    if (!toastFiredRef.current) {
      toastFiredRef.current = true;
      const stored = localStorage.getItem(STORAGE_KEY);
      const ids: string[] = stored ? JSON.parse(stored) : [];
      const firstUnread = notes.find(n => !ids.includes(n.id));
      if (firstUnread) {
        setTimeout(() => {
          toast.info(firstUnread.title, {
            autoClose: 4000,
            icon: '🔔',
          });
        }, 1500);
      }
    }
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter(n => !readIds.has(n.id)).length;

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    const newSet = new Set([...readIds, ...allIds]);
    setReadIds(newSet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSet]));
    toast.success('All notifications marked as read', { autoClose: 2000 });
  };

  const markRead = (id: string) => {
    const newSet = new Set([...readIds, id]);
    setReadIds(newSet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSet]));
  };

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative flex items-center">
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-rose-500 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-extrabold text-white shadow-sm animate-pulse">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown Dialog */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[360px] max-h-[520px] origin-top-right rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-black/20 z-[60] flex flex-col overflow-hidden animate-in slide-in-from-top-2 duration-200">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-zinc-800 shrink-0">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-rose-500" />
              <span className="text-sm font-extrabold text-slate-900 dark:text-zinc-50">Notifications</span>
              {unread > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-rose-600 text-[10px] font-extrabold text-white">
                  {unread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-zinc-800">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-slate-300 dark:text-zinc-600" />
                </div>
                <p className="text-sm font-semibold text-slate-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => {
                const cfg = TYPE_CFG[n.type];
                const Icon = cfg.icon;
                const isRead = readIds.has(n.id);
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex items-start gap-3 px-4 py-3.5 transition-colors cursor-pointer group ${
                      isRead
                        ? 'hover:bg-slate-50/60 dark:hover:bg-zinc-800/40'
                        : 'bg-rose-500/[0.03] hover:bg-rose-500/[0.06] dark:bg-rose-500/[0.04] dark:hover:bg-rose-500/[0.07]'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`h-9 w-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className={`h-4 w-4 ${cfg.icon_cls}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs font-bold leading-tight ${isRead ? 'text-slate-700 dark:text-zinc-300' : 'text-slate-900 dark:text-zinc-50'}`}>
                          {n.title}
                        </span>
                        {!isRead && (
                          <span className={`mt-0.5 h-2 w-2 rounded-full ${cfg.badge} shrink-0`} />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 font-medium block">
                        {timeAgo(n.time)}
                      </span>
                    </div>

                    {n.link && (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-zinc-600 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100 dark:border-zinc-800 shrink-0 bg-slate-50/50 dark:bg-zinc-800/20">
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 text-center font-medium">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''} · Medi-Doc Health System
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
