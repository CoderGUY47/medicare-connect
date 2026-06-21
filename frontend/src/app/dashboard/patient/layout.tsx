'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from 'next-themes';
import { HeartPulse, ShieldAlert, LogOut, Bell, Sun, Moon } from 'lucide-react';
import { FiHome, FiCalendar, FiCreditCard, FiStar, FiUser, FiChevronRight } from 'react-icons/fi';
import { ToastContainer } from 'react-toastify';

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'patient')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }));
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-1.5 w-48 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-rose-600 rounded-full animate-pulse" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
            Authenticating…
          </span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'patient') {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-rose-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wide">
          Access Denied
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 text-xs">
          Patient credentials required to access this dashboard.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
        >
          Login
        </button>
      </div>
    );
  }

  const navLinks = [
    { label: 'Overview',     href: '/dashboard/patient',              icon: FiHome },
    { label: 'Appointments', href: '/dashboard/patient/appointments', icon: FiCalendar },
    { label: 'Payments',     href: '/dashboard/patient/payments',     icon: FiCreditCard },
    { label: 'Reviews',      href: '/dashboard/patient/reviews',      icon: FiStar },
    { label: 'Profile',      href: '/dashboard/patient/profile',      icon: FiUser },
  ];

  const isActive = (href: string) => pathname === href;
  const initials = user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col md:flex-row transition-colors duration-300">

      {/* ── Sidebar ── */}
      <aside className="w-full md:w-64 border-r border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-900 shrink-0 flex flex-col min-h-screen">

        {/* Brand */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-rose-500/10 p-1.5 rounded-xl">
              <HeartPulse className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-zinc-100 leading-tight">Medi-Doc Hospital</h2>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Patient Portal</p>
            </div>
          </Link>
        </div>

        {/* Patient Info Card */}
        <div className="mx-3 mt-4 mb-2 p-3 rounded-2xl bg-linear-to-br from-rose-500/10 via-pink-500/5 to-transparent border border-rose-500/10">
          <div className="flex items-center gap-3">
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-zinc-700 shadow-sm shrink-0" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-rose-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate">{user.name}</div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">{user.email}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-3 px-3 space-y-0.5">
          {navLinks.map(link => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  active
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-l-4 border-rose-600'
                    : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-800 dark:hover:text-zinc-100 border-l-4 border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`} />
                <span className="flex-1">{link.label}</span>
                {active && <FiChevronRight className="h-3 w-3 text-rose-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-zinc-800">
          <button
            onClick={() => { logout(); window.location.href = '/'; }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-16 border-b border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-900 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
            <HeartPulse className="h-4 w-4 text-rose-500" />
            <span className="font-bold text-slate-700 dark:text-zinc-200">{user.name}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline capitalize">{user.role} Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 hidden lg:inline">{currentTime}</span>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 rounded-[8px] transition-colors cursor-pointer border-none bg-transparent"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="h-4 w-4" />
              ) : resolvedTheme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            {/* Notification bell */}
            <button className="relative p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 rounded-[8px] transition-colors cursor-pointer border-none bg-transparent">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-rose-500 rounded-full" />
            </button>
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="h-8 w-8 rounded-full object-cover border-2 border-rose-500/30 shadow-sm" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-rose-600 text-white text-xs font-extrabold flex items-center justify-center">
                {initials}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
