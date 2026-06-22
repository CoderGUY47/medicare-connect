'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resetDb } from '../lib/mockDb';
import { Settings, Shield, User as UserIcon, Activity, RefreshCw } from 'lucide-react';

export default function RoleSwitcher() {
  const { login, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [credentials, setCredentials] = useState<any[]>([]);

  useEffect(() => {
    const fetchCreds = async () => {
      try {
        const backendUrl = localStorage.getItem('mc_backend_url') || process.env.NEXT_PUBLIC_SERVER_URL || 'https://backend-nu-rosy-20.vercel.app';
        const res = await fetch(`${backendUrl}/api/auth/demo-credentials`);
        if (res.ok) {
          const data = await res.json();
          setCredentials(data);
        }
      } catch (err) {
        console.error("Failed to fetch demo credentials:", err);
      }
    };
    if (isOpen) {
      fetchCreds();
    }
  }, [isOpen]);

  const handleRoleSwitch = async (roleName: string) => {
    try {
      const matched = credentials.find(c => c.role === roleName);
      if (matched) {
        await login(matched.email, matched.pw);
        setIsOpen(false);
        window.location.reload(); // Reload to sync state on all pages
      }
    } catch (err) {
      console.error('Failed to switch role:', err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        title="Demo Controls"
      >
        <Settings className={`h-6 w-6 ${isOpen ? 'rotate-90' : 'animate-pulse'}`} />
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 rounded-2xl border border-border bg-card p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
            <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
              <Activity className="h-4 w-4 text-primary" />
              Demo Role Switcher
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>

          {user && (
            <div className="mb-3 rounded-lg bg-muted p-2 text-xs">
              <div className="font-medium text-foreground">Active Account:</div>
              <div className="truncate text-muted-foreground">{user.name} ({user.role})</div>
            </div>
          )}

          <div className="space-y-2">
            {credentials.length === 0 ? (
              <div className="text-center text-[10px] text-red-500 py-3 font-semibold border border-red-500/10 rounded-lg bg-red-500/5 animate-pulse">
                Demo credentials expired or loading...
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleRoleSwitch('patient')}
                  className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-left text-xs font-medium text-foreground hover:bg-secondary transition-all"
                >
                  <UserIcon className="h-3.5 w-3.5 text-blue-500" />
                  Switch to Patient (Jannatul Ferdous)
                </button>

                <button
                  onClick={() => handleRoleSwitch('doctor')}
                  className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-left text-xs font-medium text-foreground hover:bg-secondary transition-all"
                >
                  <Shield className="h-3.5 w-3.5 text-green-500" />
                  Switch to Doctor (Dr. Sarah Jahan)
                </button>

                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-left text-xs font-medium text-foreground hover:bg-secondary transition-all"
                >
                  <Shield className="h-3.5 w-3.5 text-purple-500" />
                  Switch to Admin (Admin)
                </button>
              </>
            )}

            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  window.location.reload();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 px-3 py-1.5 text-xs font-semibold transition-all mt-2"
              >
                Log Out Current
              </button>
            ) : (
              <div className="text-center text-[10px] text-muted-foreground py-1">
                Currently Logged Out (Guest Mode)
              </div>
            )}

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset the database to initial seed data? This will clear all localStorage changes.')) {
                  resetDb();
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/25 text-red-500 hover:bg-red-500/10 px-3 py-1.5 text-xs font-medium transition-all mt-4"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Mock DB Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
