'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from 'next-themes';
import { 
  ShieldAlert,
  HeartPulse,
  LayoutDashboard,
  Activity,
  Settings,
  Search,
  Bell,
  LogOut,
  FlaskConical,
  FileText,
  FileCheck,
  Sun,
  Moon
} from 'lucide-react';

export default function LabDashboardLayout({
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
    if (!isLoading && (!user || user.role !== 'lab')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-1.5 w-48 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-rose-600 rounded-full animate-infinite-scroll" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest animate-pulse">Authenticating…</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'lab') {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-rose-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wide">Access Denied</h2>
        <p className="text-slate-500 dark:text-zinc-400 text-xs">Lab Staff credentials required to access this dashboard.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
        >
          Authenticate
        </button>
      </div>
    );
  }

  const sidebarLinks = [
    { label: 'Overview', href: '/dashboard/lab', icon: LayoutDashboard },
    { label: 'Specimens Queue', href: '#', icon: FlaskConical, isPlaceholder: true },
    { label: 'Requisitions', href: '#', icon: FileText, isPlaceholder: true },
    { label: 'Completed Reports', href: '#', icon: FileCheck, isPlaceholder: true },
    { label: 'Equipment Status', href: '#', icon: Activity, isPlaceholder: true },
    { label: 'Settings', href: '#', icon: Settings, isPlaceholder: true },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-900 shrink-0 flex flex-col min-h-screen">
        
        {/* Sidebar Header Brand Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-rose-500/10 p-1.5 rounded-xl">
              <HeartPulse className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-zinc-100 leading-tight">Medi-Doc Hospital</h2>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Laboratory Station</p>
            </div>
          </Link>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all relative ${
                  active
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-l-4 border-rose-600'
                    : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-zinc-200 border-l-4 border-transparent'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`} />
                <span className="flex-1 tracking-wide">{link.label}</span>
                {link.isPlaceholder && (
                  <span className="text-[8px] bg-slate-100 dark:bg-zinc-800 text-slate-400 px-1.5 py-0.5 rounded">Sim</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Profile Card footer */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2.5 bg-slate-50/50 dark:bg-zinc-950/20">
          <div className="flex items-center gap-2.5 min-w-0">
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="h-8.5 w-8.5 rounded-full object-cover border border-slate-100 dark:border-zinc-800"
              />
            ) : (
              <div className="h-8.5 w-8.5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{user.name}</div>
              <div className="text-[10px] text-slate-400 capitalize">{user.role}</div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-900 flex items-center justify-between px-6 md:px-8 shrink-0 transition-colors">
          
          <div className="flex items-center border border-slate-100 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-950/20 px-3 py-1.5 w-64 md:w-80 focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition-all">
            <Search className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search tests, specimens, patients..." 
              className="bg-transparent text-xs text-slate-900 dark:text-zinc-150 outline-none border-none w-full placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 hidden lg:inline">
              {currentTime}
            </span>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 rounded-[8px] transition-colors cursor-pointer border-none bg-transparent"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="h-4.5 w-4.5" />
              ) : resolvedTheme === 'dark' ? (
                <Moon className="h-4.5 w-4.5" />
              ) : (
                <Sun className="h-4.5 w-4.5" />
              )}
            </button>

            {/* Notification bell */}
            <button className="relative p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 rounded-[8px] transition-colors cursor-pointer border-none bg-transparent">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            <div className="flex items-center gap-2">
              <div className="h-8.5 w-8.5 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-zinc-200">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left leading-none">
                <div className="text-[11px] font-bold text-slate-800 dark:text-zinc-200">{user.name}</div>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Lab Staff</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              className="text-xs font-bold text-slate-500 hover:text-red-500 hover:underline transition-colors ml-2 cursor-pointer"
            >
              Logout
            </button>
          </div>

        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}

