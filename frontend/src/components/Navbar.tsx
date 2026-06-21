'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from 'next-themes';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const getInitials = (name?: string) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};
import {
  Sun,
  Moon,
  Menu,
  X,
  HeartPulse,
  ChevronDown,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  CalendarCheck,
  MapPin,
  ClipboardList,
  Search,
  FolderHeart
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const isActive = (path: string) => pathname === path;

  const getDashboardLink = () => {
    if (!user) return '/login';
    return `/dashboard/${user.role}`;
  };

  const getProfileLink = () => {
    if (!user) return '/login';
    return `/profile/${user.id}`;
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Find Doctors', href: '/find-doctors' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <div className="w-full sticky top-0 z-50 shadow-md">

      {/* Main Navbar (Outside Container, Spans Full Width) */}
      <nav className="w-full bg-zinc-950 border-b border-zinc-900 dark:bg-zinc-950 dark:border-zinc-900 transition-colors duration-300">
        <div className="w-full px-6 md:px-12 lg:px-16">
          <div className="flex h-16 items-center justify-between">

            {/* Logo and Brand with Stylized N ||| */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:opacity-95">
                <svg className="h-7 w-auto text-white shrink-0" viewBox="0 0 42 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* N shape */}
                  <path d="M4 28V4h6.5l10 15.5V4h5v24h-6.2L9.3 12.5V28H4z" fill="currentColor" />
                  {/* Accent vertical lines */}
                  <rect x="27.5" y="4" width="3.2" height="24" rx="0.5" fill="currentColor" />
                  <rect x="33" y="10" width="3.2" height="18" rx="0.5" fill="currentColor" className="opacity-80" />
                  <rect x="38.5" y="16" width="3.2" height="12" rx="0.5" fill="currentColor" className="opacity-60" />
                </svg>
                <div className="flex flex-col">
                  <span className="font-extrabold tracking-tight font-outfit text-[15px] leading-none text-white">MEDI-DOC</span>
                  <span className="text-[8px] font-extrabold tracking-[0.25em] text-rose-500 uppercase leading-none mt-0.5">HEALTH</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation & Actions (Right Side Container) */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Navigation Links (Capitalized Case, Clean Links) */}
              <div className="flex items-center space-x-1 h-16">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-base font-semibold px-3 py-2 transition-colors flex items-center gap-1 cursor-pointer ${
                      isActive(link.href)
                        ? 'text-rose-500 font-bold'
                        : 'text-zinc-300 hover:text-rose-500'
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Separator line */}
              <div className="h-4 w-px bg-white/15" />

              {/* Actions: Theme Toggle & User Profile */}
              <div className="flex items-center space-x-5">
                {/* Search */}
                <div
                  onMouseEnter={() => setIsSearchExpanded(true)}
                  onMouseLeave={() => {
                    if (!searchVal) {
                      setIsSearchExpanded(false);
                    }
                  }}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-300 hover:text-rose-500 transition-all cursor-pointer relative"
                >
                  <Search className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span className={`transition-all duration-300 ${isSearchExpanded ? 'w-0 opacity-0 overflow-hidden font-semibold' : 'w-auto opacity-100 font-semibold'}`}>
                    Search
                  </span>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (searchVal.trim()) {
                        router.push(`/find-doctors?search=${encodeURIComponent(searchVal)}`);
                      }
                    }}
                    className={`transition-all duration-300 overflow-hidden ${
                      isSearchExpanded ? 'w-40 opacity-100 px-1' : 'w-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <input
                      type="text"
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      placeholder="Search doctors..."
                      className="bg-zinc-900/60 text-white placeholder:text-zinc-500 border border-zinc-800 rounded-md px-2.5 py-1 text-xs outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 w-full font-medium"
                    />
                  </form>
                </div>

                {/* Theme Toggle as Icon Only */}
                <button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-rose-500 transition-colors bg-transparent border-none cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {!mounted ? (
                    <div className="h-4.5 w-4.5" />
                  ) : resolvedTheme === 'dark' ? (
                    <Moon className="h-4.5 w-4.5 text-zinc-400 group-hover:text-white" />
                  ) : (
                    <Sun className="h-4.5 w-4.5 text-zinc-400 group-hover:text-white" />
                  )}
                </button>

                {/* "I Want To..." Pill Button / User Avatar */}
                <div className="relative flex items-center">
                  {user ? (
                    <button
                      onClick={toggleProfile}
                      className="hover:scale-105 transition-all cursor-pointer shrink-0 flex items-center"
                    >
                      <Avatar className="h-9 w-9 border border-white/20 shadow-md">
                        {user.photo && (
                          <AvatarImage
                            src={user.photo}
                            alt={user.name}
                          />
                        )}
                        <AvatarFallback className="bg-rose-650 text-white font-bold text-xs flex items-center justify-center h-full w-full">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  ) : (
                    <button
                      onClick={toggleProfile}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 text-[13px] font-semibold rounded-full transition-all shadow-md flex items-center gap-1 cursor-pointer"
                    >
                      <span>Login / Register</span>
                      <ChevronDown className="h-3.5 w-3.5 text-white" />
                    </button>
                  )}

                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 origin-top-right border border-slate-150 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-xl rounded-xl z-50">
                      {user ? (
                        <>
                          <div className="px-3 py-2.5 border-b border-slate-100 dark:border-zinc-800 mb-1.5 flex items-center gap-2.5">
                            <Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-700 shadow-sm shrink-0">
                              {user.photo && (
                                <AvatarImage
                                  src={user.photo}
                                  alt={user.name}
                                />
                              )}
                              <AvatarFallback className="bg-rose-650 text-white font-bold text-xs flex items-center justify-center h-full w-full">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                              <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{user.name}</div>
                              <div className="text-base text-slate-400 dark:text-zinc-400 truncate leading-none mt-1">{user.email}</div>
                              <div className="mt-1.5 inline-flex items-center border border-rose-500/20 bg-rose-500/5 px-2 py-0.5 text-[8px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase rounded-md">
                                {user.role}
                              </div>
                            </div>
                          </div>

                          <Link
                            href={getProfileLink()}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors rounded-lg"
                          >
                            <UserIcon className="h-4 w-4 text-slate-400" />
                            Profile
                          </Link>

                          <Link
                            href={getDashboardLink()}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors rounded-lg"
                          >
                            <LayoutDashboard className="h-4 w-4 text-slate-400" />
                            Dashboard
                          </Link>

                          <button
                            onClick={async () => {
                              await logout();
                              setIsProfileOpen(false);
                              window.location.href = '/';
                            }}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/5 transition-colors rounded-lg cursor-pointer"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors rounded-lg"
                          >
                            Log In
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors rounded-lg"
                          >
                            Register Account
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Mobile header controls */}
            <div className="flex items-center md:hidden space-x-2">
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="rounded-xl p-2 text-zinc-400 hover:text-rose-500 hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {!mounted ? (
                  <div className="h-5 w-5" />
                ) : resolvedTheme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={toggleMenu}
                className="rounded-xl p-2 text-zinc-400 hover:text-rose-500 hover:bg-white/10 transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-zinc-900 bg-zinc-950 px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-xl px-3 py-2 text-base font-semibold transition-colors hover:bg-white/10 ${
                  isActive(link.href) ? 'text-rose-500 bg-white/10' : 'text-zinc-300 hover:text-rose-500'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="border-t border-zinc-900 pt-3 mt-3 space-y-2">
                <div className="flex items-center gap-3 px-3 py-1 mb-2">
                  <Avatar className="h-9 w-9 border border-white/10 shadow-sm shrink-0">
                    {user.photo && (
                      <AvatarImage
                        src={user.photo}
                        alt={user.name}
                      />
                    )}
                    <AvatarFallback className="bg-rose-650 text-white font-bold text-xs flex items-center justify-center h-full w-full">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-bold text-white">{user.name}</div>
                    <div className="text-xs text-zinc-450 truncate">{user.email}</div>
                  </div>
                </div>

                <Link
                  href={getProfileLink()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-base text-zinc-300 hover:text-rose-500 hover:bg-white/10"
                >
                  <UserIcon className="h-5 w-5 text-zinc-400" />
                  Profile
                </Link>

                <Link
                  href={getDashboardLink()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-base text-zinc-300 hover:text-rose-500 hover:bg-white/10"
                >
                  <LayoutDashboard className="h-5 w-5 text-zinc-400" />
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    window.location.href = '/';
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-base text-red-300 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-zinc-900 pt-3 mt-3 flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-white/10 py-2 text-base font-bold text-zinc-300 hover:bg-white/10"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-rose-600 py-2 text-base font-bold text-white hover:bg-rose-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
