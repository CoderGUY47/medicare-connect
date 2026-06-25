"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "next-themes";
import {
  ShieldAlert,
  HeartPulse,
  LayoutDashboard,
  Settings,
  Search,
  Bell,
  LogOut,
  Pill,
  ClipboardList,
  AlertTriangle,
  History,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import LoadingScreen from "../../../components/LoadingScreen";

export default function PharmacistDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "pharmacist")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      setCurrentTime(now.toLocaleDateString("en-US", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Authenticating pharmacy workspace..." />;
  }

  if (!user || user.role !== "pharmacist") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-rose-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wide">
          Access Denied
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 text-xs">
          Pharmacist credentials required to access this dashboard.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
        >
          Authenticate
        </button>
      </div>
    );
  }

  const sidebarLinks = [
    { label: "Overview", href: "/dashboard/pharmacist", icon: LayoutDashboard },
    {
      label: "Prescriptions",
      href: "#",
      icon: ClipboardList,
      isPlaceholder: true,
    },
    { label: "Stock Inventory", href: "#", icon: Pill, isPlaceholder: true },
    {
      label: "Dispense History",
      href: "#",
      icon: History,
      isPlaceholder: true,
    },
    {
      label: "Stock Warnings",
      href: "#",
      icon: AlertTriangle,
      isPlaceholder: true,
    },
    { label: "Settings", href: "#", icon: Settings, isPlaceholder: true },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-900 shrink-0 flex flex-col min-h-screen transition-transform duration-300 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        {/* Sidebar Header Brand Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-rose-500/10 p-1.5 rounded-xl">
              <HeartPulse className="h-5 w-5 text-rose-600 dark:text-rose-500 " />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-zinc-100 leading-tight">
                Medi-Doc Hospital
              </h2>
              <p className="text-[10px] text-slate-450 dark:text-zinc-500 font-bold uppercase tracking-wider">
                Pharmacy Station
              </p>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-rose-555 dark:hover:text-zinc-150 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer bg-transparent border-none"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
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
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-500  border-l-4 border-rose-600"
                    : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-zinc-200 border-l-4 border-transparent"
                }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 ${active ? "text-rose-600 dark:text-rose-500 " : "text-slate-400"}`}
                />
                <span className="flex-1 tracking-wide">{link.label}</span>
                {link.isPlaceholder && (
                  <span className="text-[8px] bg-slate-100 dark:bg-zinc-800 text-slate-450 px-1.5 py-0.5 rounded">
                    Sim
                  </span>
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
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">
                {user.name}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">
                {user.role}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="text-slate-400 hover:text-red-550 p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
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
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 mr-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-550 dark:text-zinc-400 rounded-lg md:hidden cursor-pointer bg-transparent border-none shrink-0"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex items-center border border-slate-100 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-950/20 px-3 py-1.5 w-64 md:w-80 focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition-all">
              <Search className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-555 mr-2" />
              <input
                type="text"
                placeholder="Search prescriptions, medications, inventory..."
                className="bg-transparent text-xs text-slate-900 dark:text-zinc-150 outline-none border-none w-full placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 hidden lg:inline">
              {currentTime}
            </span>

            {/* Theme Toggle Button */}
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-550 rounded-[8px] transition-colors cursor-pointer border-none bg-transparent"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="h-4.5 w-4.5" />
              ) : resolvedTheme === "dark" ? (
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
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="hidden sm:block text-left leading-none">
                <div className="text-[11px] font-bold text-slate-800 dark:text-zinc-200">
                  {user.name}
                </div>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                  Pharmacist
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="text-xs font-bold text-slate-500 hover:text-red-500 hover:underline transition-colors ml-2 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
