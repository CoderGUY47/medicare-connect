'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resetDb } from '../lib/mockDb';
import { getBackendUrl } from '../utils/backendUrl';
import {
  Settings,
  Shield,
  User as UserIcon,
  Activity,
  RefreshCw,
  Stethoscope,
  Users,
  FlaskConical,
  Pill,
  ChevronDown,
  Eye,
  EyeOff,
  LogOut,
  Copy,
  Check
} from 'lucide-react';

const ROLE_ICONS: Record<string, React.ElementType> = {
  patient: UserIcon,
  doctor: Stethoscope,
  admin: Shield,
  nurse: Users,
  lab: FlaskConical,
  pharmacist: Pill
};

const ROLE_COLORS: Record<string, string> = {
  patient: 'text-blue-500',
  doctor: 'text-green-500',
  admin: 'text-purple-500',
  nurse: 'text-pink-500',
  lab: 'text-amber-500',
  pharmacist: 'text-cyan-500'
};

const ROLE_LABELS: Record<string, string> = {
  patient: 'Patient',
  doctor: 'Doctor',
  admin: 'Admin',
  nurse: 'Nurse',
  lab: 'Lab Staff',
  pharmacist: 'Pharmacist'
};

const ROLE_ORDER = ['admin', 'doctor', 'patient', 'nurse', 'lab', 'pharmacist'];

export default function RoleSwitcher() {
  const { login, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [revealedRoles, setRevealedRoles] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [switchingRole, setSwitchingRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreds = async () => {
      try {
        const backendUrl = getBackendUrl();
        const res = await fetch(`${backendUrl}/api/auth/demo-credentials`);
        if (res.ok) {
          const data = await res.json();
          setCredentials(data);
        }
      } catch (err) {
        console.error('Failed to fetch demo credentials:', err);
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
        setSwitchingRole(roleName);
        await login(matched.email, matched.pw);
        setIsOpen(false);
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to switch role:', err);
    } finally {
      setSwitchingRole(null);
    }
  };

  const toggleReveal = (role: string) => {
    setRevealedRoles(prev => ({ ...prev, [role]: !prev[role] }));
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {}
  };

  // Sort credentials by ROLE_ORDER
  const sortedCredentials = [...credentials].sort((a, b) => {
    const ia = ROLE_ORDER.indexOf(a.role);
    const ib = ROLE_ORDER.indexOf(b.role);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        title="Demo Role Switcher"
      >
        <Settings className={`h-6 w-6 ${isOpen ? 'rotate-90' : 'animate-pulse'}`} />
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 rounded-2xl border border-border bg-card p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200 max-h-[80vh] overflow-y-auto">
          {/* Header */}
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

          {/* Active Account */}
          {user && (
            <div className="mb-3 rounded-lg bg-muted p-2 text-xs">
              <div className="font-medium text-foreground">Active Account:</div>
              <div className="truncate text-muted-foreground">{user.name} ({user.role})</div>
            </div>
          )}

          {/* Role Credential Cards */}
          <div className="space-y-2">
            {credentials.length === 0 ? (
              <div className="text-center text-[10px] text-red-500 py-3 font-semibold border border-red-500/10 rounded-lg bg-red-500/5 animate-pulse">
                Demo credentials expired or loading...
              </div>
            ) : (
              sortedCredentials.map(cred => {
                const Icon = ROLE_ICONS[cred.role] || Shield;
                const colorClass = ROLE_COLORS[cred.role] || 'text-slate-500';
                const label = ROLE_LABELS[cred.role] || cred.role;
                const isRevealed = revealedRoles[cred.role];
                const isSwitching = switchingRole === cred.role;
                const emailCopyKey = `${cred.role}-email`;
                const pwCopyKey = `${cred.role}-pw`;
                const isCurrentRole = user?.role === cred.role;

                return (
                  <div
                    key={cred.role}
                    className={`rounded-lg border transition-all ${
                      isCurrentRole
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border bg-background hover:bg-muted/40'
                    }`}
                  >
                    {/* Role Header Row */}
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Icon className={`h-4 w-4 shrink-0 ${colorClass}`} />
                      <span className="flex-1 text-xs font-semibold text-foreground">{label}</span>
                      {isCurrentRole && (
                        <span className="text-[9px] font-bold uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                      <button
                        onClick={() => toggleReveal(cred.role)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title={isRevealed ? 'Hide credentials' : 'Show credentials'}
                      >
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isRevealed ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Revealed Credentials */}
                    {isRevealed && (
                      <div className="px-3 pb-2 space-y-1.5 border-t border-border/60 pt-2">
                        {/* Email */}
                        <div className="flex items-center gap-1.5 bg-muted rounded px-2 py-1">
                          <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider w-6">Email</span>
                          <span className="flex-1 text-[10px] font-mono text-foreground truncate">{cred.email}</span>
                          <button
                            onClick={() => handleCopy(cred.email, emailCopyKey)}
                            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                            title="Copy email"
                          >
                            {copiedField === emailCopyKey
                              ? <Check className="h-3 w-3 text-green-500" />
                              : <Copy className="h-3 w-3" />
                            }
                          </button>
                        </div>
                        {/* Password */}
                        <div className="flex items-center gap-1.5 bg-muted rounded px-2 py-1">
                          <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider w-6">Pass</span>
                          <span className="flex-1 text-[10px] font-mono text-foreground truncate">
                            {isRevealed ? cred.pw : '••••••••'}
                          </span>
                          <button
                            onClick={() => handleCopy(cred.pw, pwCopyKey)}
                            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                            title="Copy password"
                          >
                            {copiedField === pwCopyKey
                              ? <Check className="h-3 w-3 text-green-500" />
                              : <Copy className="h-3 w-3" />
                            }
                          </button>
                        </div>
                        {/* Switch button */}
                        {!isCurrentRole && (
                          <button
                            onClick={() => handleRoleSwitch(cred.role)}
                            disabled={!!isSwitching}
                            className={`w-full mt-1 text-[10px] font-bold py-1.5 rounded transition-all ${colorClass.replace('text-', 'border-').replace('-500', '-500/30')} border bg-transparent hover:bg-primary/5 text-foreground disabled:opacity-50`}
                          >
                            {isSwitching ? 'Switching…' : `Login as ${label}`}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Quick Switch (when not revealed) */}
                    {!isRevealed && !isCurrentRole && (
                      <div className="px-3 pb-2">
                        <button
                          onClick={() => handleRoleSwitch(cred.role)}
                          disabled={!!isSwitching}
                          className="w-full text-[10px] font-semibold py-1 rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
                        >
                          {isSwitching ? 'Switching…' : `→ Switch to ${label}`}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Actions */}
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            {user && (
              <button
                onClick={() => { logout(); setIsOpen(false); window.location.reload(); }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 px-3 py-1.5 text-xs font-semibold transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log Out Current
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Reset database to initial seed data? This will clear all localStorage changes.')) {
                  resetDb();
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/25 text-red-500 hover:bg-red-500/10 px-3 py-1.5 text-xs font-medium transition-all"
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
