'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ScrollAnimate from '../../components/ScrollAnimate';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { signIn } from '../../lib/auth-client';
import { 
  HeartPulse, 
  Lock, 
  AlertCircle, 
  Shield, 
  Users, 
  Stethoscope, 
  FlaskConical, 
  Pill,
  User,
  Info
} from 'lucide-react';

const loginSchema = zod.object({
  email: zod.string().min(1, 'Username / Email is required').email('Invalid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormValues = zod.infer<typeof loginSchema>;

const ROLES = [
  { id: 'patient', label: 'Patient', icon: User, email: 'patient@medi-doc.com', pw: 'patient123' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, email: 'jenkins@medi-doc.com', pw: 'doctor123' },
  { id: 'nurse', label: 'Nurse', icon: Users, email: 'nurse@medi-doc.com', pw: 'nurse123' },
  { id: 'lab', label: 'Lab Staff', icon: FlaskConical, email: 'lab@medi-doc.com', pw: 'lab123' },
  { id: 'pharmacist', label: 'Pharmacist', icon: Pill, email: 'pharmacist@medi-doc.com', pw: 'pharmacist123' },
  { id: 'admin', label: 'Administrator', icon: Shield, email: 'admin@medi-doc.com', pw: 'admin123' }
];

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('admin');

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('oauth_selected_role', selectedRole);
      }
      await signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed.');
    }
  };

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@medi-doc.com', password: 'admin123' } // Default administrator
  });

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    const matchedRole = ROLES.find(r => r.id === roleId);
    if (matchedRole) {
      setValue('email', matchedRole.email);
      setValue('password', matchedRole.pw);
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const loggedInUser = await login(values.email, values.password);
      router.push(redirect || `/dashboard/${loggedInUser.role}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activeRoleDetails = ROLES.find(r => r.id === selectedRole);

  return (
    <div className="container mx-auto px-4 py-12 max-w-[1100px] w-full min-h-[90vh] flex items-center justify-center">
      <ScrollAnimate className="w-full max-w-[1000px]">
        <div className="w-full bg-white dark:bg-zinc-900 shadow-2xl rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[720px] border border-slate-100 dark:border-zinc-800">
        
        {/* Left Branding Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#4A2E80] via-indigo-900 to-purple-950 p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-20 -translate-y-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl transform -translate-x-20 translate-y-20 pointer-events-none" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-white p-2.5 rounded-md flex items-center justify-center shadow-sm">
                <HeartPulse className="h-6 w-6 text-[#4A2E80]" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white leading-tight">Medi-Doc Hospital</h2>
                <p className="text-[10px] text-purple-200/70 font-semibold uppercase tracking-wider font-mono">Hospital Management System</p>
              </div>
            </div>

            {/* Welcoming statements */}
            <div className="mt-14 space-y-4">
              <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">Welcome Back</h1>
              <p className="text-purple-100/90 text-xs leading-relaxed max-w-xs">
                Secure access to the Hospital Management System for healthcare professionals
              </p>
            </div>
          </div>

          {/* Features check-list */}
          <div className="space-y-6 my-10 relative z-10">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 border border-white/20 p-2.5 rounded-md flex items-center justify-center shrink-0 w-11 h-11">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">Secure Authentication</h3>
                <p className="text-[11px] text-purple-100/75 mt-0.5">End-to-end encrypted login system</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 border border-white/20 p-2.5 rounded-md flex items-center justify-center shrink-0 w-11 h-11">
                <HeartPulse className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">Real-time Updates</h3>
                <p className="text-[11px] text-purple-100/75 mt-0.5">Live patient data and notifications</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 border border-white/20 p-2.5 rounded-md flex items-center justify-center shrink-0 w-11 h-11">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">Role-based Access</h3>
                <p className="text-[11px] text-purple-100/75 mt-0.5">Customized access for each department</p>
              </div>
            </div>
          </div>

          {/* Left panel footer */}
          <div className="pt-6 border-t border-white/10 text-[10px] text-purple-200/60 relative z-10 flex flex-col gap-1">
            <span>&copy; 2026 Medi-Doc Hospital. All rights reserved.</span>
            <span className="font-medium tracking-wide uppercase text-[8px] opacity-80">Tertiary Care Hospital System</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-center bg-white dark:bg-zinc-900/20">
          <div className="w-full max-w-md mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">Sign In</h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Select your role and enter credentials</p>
            </div>

            {errorMsg && (
              <div className="border border-red-500/20 bg-red-500/5 px-4 py-2.5 rounded-md flex items-center gap-2">
                 <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-[11px] text-red-600 dark:text-red-400 font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Role selection */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2.5">
                Select Your Role
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleSelect(role.id)}
                      className={`flex flex-col items-center justify-center p-3 h-20 rounded-md border transition-all select-none text-center ${
                        isSelected
                          ? 'border-[#4A2E80] bg-purple-500/5 dark:border-purple-500 dark:bg-purple-950/15 shadow-sm shadow-purple-500/5'
                          : 'border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-slate-50 dark:hover:bg-zinc-800/40'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mb-1.5 transition-colors ${
                        isSelected ? 'text-[#4A2E80] dark:text-purple-400' : 'text-slate-400 dark:text-zinc-500'
                      }`} />
                      <span className={`text-[11px] font-semibold transition-colors ${
                        isSelected ? 'text-[#4A2E80] dark:text-purple-300 font-bold' : 'text-slate-600 dark:text-zinc-400'
                      }`}>
                        {role.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  Username
                </label>
                <div className="flex items-center border border-slate-200 dark:border-zinc-800 rounded-md bg-slate-50/50 dark:bg-zinc-900/20 focus-within:border-[#4A2E80] focus-within:ring-1 focus-within:ring-[#4A2E80] focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all">
                  <User className="h-4 w-4 text-slate-400 dark:text-zinc-500 ml-3 shrink-0" />
                  <input 
                    type="email" 
                    placeholder="Enter your username" 
                    {...register('email')}
                    className="w-full bg-transparent outline-none text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 px-3 py-2.5" 
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-red-500 dark:text-red-400 font-medium px-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  Password
                </label>
                <div className="flex items-center border border-slate-200 dark:border-zinc-800 rounded-md bg-slate-50/50 dark:bg-zinc-900/20 focus-within:border-[#4A2E80] focus-within:ring-1 focus-within:ring-[#4A2E80] focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all">
                  <Lock className="h-4 w-4 text-slate-400 dark:text-zinc-500 ml-3 shrink-0" />
                  <input 
                    type="password" 
                    placeholder="Enter your password" 
                    {...register('password')}
                    className="w-full bg-transparent outline-none text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 px-3 py-2.5" 
                  />
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-500 dark:text-red-400 font-medium px-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Extra options */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 dark:border-zinc-700 text-[#4A2E80] focus:ring-[#4A2E80] focus:ring-offset-0 w-3.5 h-3.5 transition-colors cursor-pointer" 
                  />
                  <span className="text-[11px] font-medium">Remember me</span>
                </label>
                <Link 
                  href="#" 
                  className="text-[11px] text-[#4A2E80] dark:text-purple-400 hover:text-purple-750 dark:hover:text-purple-300 font-bold transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#4A2E80] hover:bg-purple-750 dark:bg-purple-650 dark:hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6 cursor-pointer shadow-sm shadow-purple-500/10 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In…</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-3.5 w-3.5" />
                    <span>Sign In Securely</span>
                  </>
                )}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-zinc-800"></div>
                <span className="flex-shrink mx-4 text-slate-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider">or</span>
                <div className="flex-grow border-t border-slate-200 dark:border-zinc-800"></div>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-white hover:bg-slate-50 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-800 dark:text-zinc-100 font-bold py-3 px-4 rounded-md border-none flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm hover:shadow active:scale-[0.98] text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>

            <div className="text-center text-xs pt-1 border-t border-slate-100 dark:border-zinc-800">
              <span className="text-slate-400 dark:text-zinc-500">Don't have an account? </span>
              <Link 
                href="/register" 
                className="text-[#4A2E80] dark:text-purple-400 hover:text-purple-750 dark:hover:text-purple-300 font-bold transition-colors"
              >
                Register here
              </Link>
            </div>

            {/* IT support contact info */}
            <div className="text-center text-[10px] text-slate-400 dark:text-zinc-500">
              <span>Need help? Contact IT Support: </span>
              <a 
                href="tel:+251911000000" 
                className="text-[#4A2E80] dark:text-purple-400 hover:text-purple-750 dark:hover:text-purple-300 font-bold transition-colors"
              >
                +251-911-000000
              </a>
            </div>

          </div>
        </div>

        </div>
      </ScrollAnimate>
    </div>
  );
}
