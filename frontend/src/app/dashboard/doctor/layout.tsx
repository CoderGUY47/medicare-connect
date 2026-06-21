'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from 'next-themes';
import { HeartPulse, LayoutDashboard, CalendarDays, CalendarCheck, FileText, UserCog, ShieldAlert, LogOut, Sun, Moon } from 'lucide-react';
import { toast } from 'react-toastify';

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-1 w-48 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Authenticating workspace…</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'doctor') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wider">Access Denied</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs">
            Doctor credentials are required to access this dashboard. Please log in with the correct account.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-md text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm"
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { label: 'Overview', href: '/dashboard/doctor', icon: LayoutDashboard },
    { label: 'Schedule Settings', href: '/dashboard/doctor/schedule', icon: CalendarDays },
    { label: 'Appointments', href: '/dashboard/doctor/appointments', icon: CalendarCheck },
    { label: 'Prescriptions', href: '/dashboard/doctor/prescriptions', icon: FileText },
    { label: 'Profile Settings', href: '/dashboard/doctor/profile', icon: UserCog },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard/doctor') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'DR';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 shrink-0 flex flex-col min-h-screen">
        
        {/* Brand */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-1.5 rounded-md">
              <HeartPulse className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-zinc-100 leading-tight">Medi-Doc Hospital</h2>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Doctor Portal</p>
            </div>
          </Link>
        </div>

        {/* Doctor Info Card */}
        <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/10">
          <div className="flex items-center gap-3">
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="h-10 w-10 rounded-md object-cover border-2 border-white dark:border-zinc-700 shadow-sm shrink-0" />
            ) : (
              <div className="h-10 w-10 rounded-md bg-emerald-650 text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate">{user.name}</div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">{user.email}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Duty Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-3 px-3 space-y-0.5">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-md transition-all ${
                  active
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-600'
                    : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-800 dark:hover:text-zinc-100 border-l-4 border-transparent'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-100 dark:border-zinc-800 space-y-2">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-3 w-full px-4 py-2 text-xs font-bold text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-[8px] transition-all cursor-pointer border border-slate-200 dark:border-zinc-800 bg-transparent"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <div className="h-4 w-4 shrink-0" />
            ) : resolvedTheme === 'dark' ? (
              <Moon className="h-4 w-4 shrink-0" />
            ) : (
              <Sun className="h-4 w-4 shrink-0" />
            )}
            <span>Theme Mode</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-[8px] transition-all cursor-pointer border-none bg-transparent"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
