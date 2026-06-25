"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "next-themes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Search,
  Plus,
  Home,
  Users,
  Calendar,
  Stethoscope,
  CreditCard,
  FileText,
  Package,
  MoreHorizontal,
  Volume2,
  VolumeX,
} from "lucide-react";
import NotificationBell from "./NotificationBell";

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.type = "sine";
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch { /* noop */ }
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    if (next) playChime();
  };

  useEffect(() => {
    setMounted(true);

    // Focus search on Ctrl + K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("header-search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/find-doctors?search=${encodeURIComponent(searchVal)}`);
    } else {
      router.push("/find-doctors");
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    return `/dashboard/${user.role}`;
  };

  const getProfileLink = () => {
    if (!user) return "/login";
    return `/profile/${user.id}`;
  };

  // Define tab navigation based on logged in user
  const subNavLinks = [
    {
      label: "Dashboard",
      href: user ? getDashboardLink() : "/login",
      icon: Home,
    },
    {
      label: "Patients",
      href: user
        ? `/dashboard/${user.role === "patient" ? "patient" : user.role === "doctor" ? "doctor" : "admin"}`
        : "/login",
      icon: Users,
    },
    {
      label: "Appointments",
      href: user ? `/dashboard/${user.role}/appointments` : "/login",
      icon: Calendar,
    },
    { label: "Doctors", href: "/find-doctors", icon: Stethoscope },
    {
      label: "Billing",
      href: user
        ? `/dashboard/${user.role === "patient" ? "patient/payments" : user.role === "doctor" ? "doctor" : "admin"}`
        : "/login",
      icon: CreditCard,
    },
    {
      label: "Reports",
      href: user ? `/dashboard/${user.role}/prescriptions` : "/login",
      icon: FileText,
    },
    {
      label: "Inventory",
      href: user
        ? `/dashboard/${user.role === "pharmacist" ? "pharmacist" : user.role === "admin" ? "admin" : user.role}`
        : "/login",
      icon: Package,
    },
  ];

  const moreLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  const isTabActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    return pathname === href || pathname?.startsWith(href);
  };

  return (
    <div className="w-full sticky top-0 z-50 shadow-xs border-b border-slate-200/80 dark:border-zinc-900 bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* Top Header Navbar */}
      <nav className="w-full px-0 py-3 bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-900 transition-colors duration-300">
        <div className="w-full px-6 md:px-12 lg:px-16 mx-auto flex items-center justify-between gap-4">
          {/* Logo Section (Unchanged) */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <svg
                className="h-7 w-auto text-slate-800 dark:text-white shrink-0 group-hover:text-rose-500 transition-colors duration-200"
                viewBox="0 0 42 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 28V4h6.5l10 15.5V4h5v24h-6.2L9.3 12.5V28H4z" fill="currentColor" />
                <rect x="27.5" y="4" width="3.2" height="24" rx="0.5" fill="currentColor" />
                <rect x="33" y="10" width="3.2" height="18" rx="0.5" fill="currentColor" className="opacity-80" />
                <rect x="38.5" y="16" width="3.2" height="12" rx="0.5" fill="currentColor" className="opacity-60" />
              </svg>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight font-outfit text-[15px] leading-none text-slate-800 dark:text-white">
                  MEDI-DOC
                </span>
                <span className="text-[8px] font-extrabold tracking-[0.25em] text-rose-500 uppercase leading-none mt-0.5">
                  HEALTH
                </span>
              </div>
            </Link>
          </div>

          {/* Right-side Controls */}
          <div className="flex items-center gap-4.5">
            {/* Search Hover-Expand (Desktop only) */}
            <div
              onMouseEnter={() => setIsSearchExpanded(true)}
              onMouseLeave={() => {
                if (!searchVal) {
                  setIsSearchExpanded(false);
                }
              }}
              className="hidden md:flex items-center gap-2 text-[12.5px] font-bold text-slate-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-indigo-400 transition-all cursor-pointer relative h-9 px-3 rounded-[10px] hover:bg-slate-50 dark:hover:bg-zinc-900"
            >
              <Search className="h-4.5 w-4.5 text-slate-500 dark:text-zinc-400 shrink-0" />
              <span
                className={`transition-all duration-300 select-none ${isSearchExpanded ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}
              >
                Search
              </span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchVal.trim()) {
                    router.push(
                      `/find-doctors?search=${encodeURIComponent(searchVal)}`,
                    );
                  }
                }}
                className={`transition-all duration-300 overflow-hidden ${
                  isSearchExpanded
                    ? "w-44 opacity-100 px-1"
                    : "w-0 opacity-0 pointer-events-none"
                }`}
              >
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search doctors, specialties..."
                  className="bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 border border-slate-200 dark:border-zinc-800 rounded-[10px] px-2.5 py-1 text-xs outline-none focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650 w-full font-medium"
                />
              </form>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="keep-rounded p-2 rounded-[10px] hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:text-rose-500 transition-colors bg-transparent border-none cursor-pointer"
              aria-label="Toggle sound"
              title={soundOn ? "Mute sounds" : "Enable sounds"}
            >
              {soundOn ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </button>

            {/* Theme toggle */}
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="keep-rounded p-2 rounded-[10px] hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:text-rose-500 transition-colors bg-transparent border-none cursor-pointer"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="h-5 w-5" />
              ) : resolvedTheme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Separator line */}
            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

            {/* Profile Dropdown Component */}
            <div className="relative shrink-0 hidden sm:block">
              {user ? (
                <button
                  onClick={toggleProfile}
                  className="keep-rounded flex items-center gap-3 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-[10px] transition-all cursor-pointer border border-transparent hover:border-slate-200/50 dark:hover:border-zinc-800"
                >
                  <div className="relative">
                    <Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-850 shadow-sm">
                      {user.photo && (
                        <AvatarImage src={user.photo} alt={user.name} />
                      )}
                      <AvatarFallback className="bg-rose-500 text-white font-bold text-xs flex items-center justify-center h-full w-full">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white dark:border-zinc-950" />
                  </div>
                  <div className="text-left leading-none hidden md:block">
                    <div className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[100px]">
                      {user.name}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 mt-1 uppercase tracking-wide">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={toggleProfile}
                  className="keep-rounded flex items-center gap-3 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-[10px] transition-all cursor-pointer border border-transparent hover:border-slate-200/50 dark:hover:border-zinc-800"
                >
                  <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-zinc-900 border-0 dark:border-0 flex items-center justify-center text-slate-500 dark:text-zinc-400">
                      <UserIcon className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="text-left leading-none">
                    <div className="text-xs font-bold text-slate-800 dark:text-white">
                      Guest User
                    </div>
                    <div className="text-[9px] font-bold text-rose-500 dark:text-rose-500   mt-1 uppercase tracking-wide">
                      Sign In / Register
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              )}

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 origin-top-right border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-xl rounded-[10px] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {user ? (
                    <>
                      <div className="px-3 py-2.5 border-b border-slate-100 dark:border-zinc-800 mb-1.5 flex items-center gap-2.5">
                        <Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-700 shadow-sm shrink-0 rounded-[10px]">
                          {user.photo && (
                            <AvatarImage
                              src={user.photo}
                              alt={user.name}
                              className="rounded-[10px]"
                            />
                          )}
                          <AvatarFallback className="bg-rose-500 text-white font-bold text-xs flex items-center justify-center h-full w-full rounded-[10px]">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">
                            {user.name}
                          </div>
                          <div className="text-[10px] text-slate-450 dark:text-zinc-500 truncate mt-0.5">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={getProfileLink()}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors rounded-[10px]"
                      >
                        <UserIcon className="h-4 w-4 text-slate-400" />
                        My Profile
                      </Link>

                      <Link
                        href={getDashboardLink()}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors rounded-[10px]"
                      >
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        Dashboard Home
                      </Link>

                      <button
                        onClick={async () => {
                          await logout();
                          setIsProfileOpen(false);
                          window.location.href = "/";
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/5 transition-colors rounded-[10px] cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout Account
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors rounded-[10px]"
                      >
                        Log In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors rounded-[10px]"
                      >
                        Register Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={toggleMenu}
              className="keep-rounded md:hidden p-2 rounded-[10px] text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Sub-Navbar (Horizontal Navigation Links) */}
      <div className="w-full bg-white dark:bg-zinc-950 border-b border-slate-200/50 dark:border-zinc-900/60 hidden md:block">
        <div className="max-w-7xl mx-auto px-0 flex items-center justify-start gap-1.5 h-12">
          {subNavLinks.map((tab) => {
            const active = isTabActive(tab.href);
            const TabIcon = tab.icon;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`text-[12.5px] font-bold px-4 py-1.5 flex items-center gap-2 transition-all duration-200 rounded-[10px] cursor-pointer ${
                  active
                    ? "bg-indigo-50/70 dark:bg-indigo-950/30 text-rose-500 dark:text-rose-500   font-extrabold"
                    : "text-slate-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                {TabIcon && (
                  <TabIcon
                    className={`h-4 w-4 shrink-0 ${active ? "text-rose-500 dark:text-rose-500  " : "text-slate-400 dark:text-zinc-500"}`}
                  />
                )}
                <span>{tab.label}</span>
              </Link>
            );
          })}

          {/* Separator line */}
          <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800 mx-2" />

          {/* More menu with dropdown links */}
          <div className="relative group flex items-center h-full">
            <button className="text-[12.5px] font-bold px-4 py-1.5 flex items-center gap-2 text-slate-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-[10px] cursor-pointer bg-transparent border-none">
              <MoreHorizontal className="h-4 w-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              <span>More</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Dropdown containing About, Contact, and Home */}
            <div className="absolute left-0 top-full hidden group-hover:block w-48 border border-slate-250/20 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-lg rounded-[10px] z-50 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <Link
                href="/"
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors rounded-[10px]"
              >
                Home Page
              </Link>
              {moreLinks.map((ml) => (
                <Link
                  key={ml.label}
                  href={ml.href}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors rounded-[10px]"
                >
                  {ml.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-4 py-3.5 space-y-2 animate-in slide-in-from-top duration-200">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[10px] px-3 py-1.5 mb-2.5"
          >
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search doctors..."
              className="bg-transparent text-slate-800 dark:text-white placeholder:text-slate-400 text-xs outline-none w-full ml-2 font-medium"
            />
          </form>

          {/* Navigation Links */}
          {subNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block rounded-[10px] px-3 py-2 text-sm font-bold transition-colors ${
                isTabActive(link.href)
                  ? "bg-indigo-50/70 dark:bg-indigo-950/30 text-rose-500 dark:text-rose-500  "
                  : "text-slate-600 dark:text-zinc-400 hover:text-rose-500"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* More Links */}
          <div className="border-t border-slate-100 dark:border-zinc-850 pt-2 mt-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block rounded-[10px] px-3 py-2 text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-indigo-655"
            >
              Home Page
            </Link>
            {moreLinks.map((ml) => (
              <Link
                key={ml.label}
                href={ml.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-[10px] px-3 py-2 text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-indigo-655"
              >
                {ml.label}
              </Link>
            ))}
          </div>

          {/* Mobile Profile options */}
          <div className="border-t border-slate-100 dark:border-zinc-850 pt-3 mt-3 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-1 mb-2">
                  <Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-700 shadow-sm shrink-0 rounded-[10px]">
                    {user.photo && (
                      <AvatarImage
                        src={user.photo}
                        alt={user.name}
                        className="rounded-[10px]"
                      />
                    )}
                    <AvatarFallback className="bg-rose-500 text-white font-bold text-xs flex items-center justify-center h-full w-full rounded-[10px]">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-450 dark:text-zinc-500 mt-0.5">
                      {user.email}
                    </div>
                  </div>
                </div>

                <Link
                  href={getProfileLink()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-xs font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900"
                >
                  <UserIcon className="h-4.5 w-4.5 text-slate-400" />
                  My Profile
                </Link>

                <button
                  onClick={async () => {
                    await logout();
                    setIsOpen(false);
                    window.location.href = "/";
                  }}
                  className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/5 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  Logout Account
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-[10px] border border-slate-200 dark:border-zinc-800 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-[10px] bg-rose-500 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
