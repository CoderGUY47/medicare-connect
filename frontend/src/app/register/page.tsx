'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ScrollAnimate from '../../components/ScrollAnimate';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { HeartPulse, Mail, Lock, User as UserIcon, Phone, AlertCircle, ArrowRight, Stethoscope, UserCheck } from 'lucide-react';

const registerSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
  phone: zod.string().min(6, 'Please provide a valid phone number'),
  gender: zod.string().min(1, 'Please select your gender'),
  role: zod.enum(['patient', 'doctor'] as const),
  password: zod.string().min(6, 'Password must be at least 6 characters')
});

type RegisterFormValues = zod.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { registerUser } = useAuth();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', gender: '', role: 'patient', password: '' }
  });

  const selectedRole = watch('role');

  const onSubmit = async (values: RegisterFormValues) => {
    setErrorMsg(''); setLoading(true);
    try {
      const registeredUser = await registerUser(values.name, values.email, values.role, values.phone, values.gender as 'male' | 'female' | 'other');
      router.push(`/dashboard/${registeredUser.role}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="allow-rounded w-full min-h-[90vh] flex items-center justify-center p-4 md:p-8 bg-slate-50 dark:bg-zinc-950/40">
      <ScrollAnimate className="w-full max-w-5xl">
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
              <div className="text-[9px] text-purple-200/80 font-bold uppercase tracking-widest font-mono">Authentication / Register</div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">Create Your<br />Medical Account</h1>
              <p className="text-purple-100/90 text-xs leading-relaxed max-w-xs">
                Register as a patient to book consultations or as a doctor to accept appointments on the Medi-Doc platform.
              </p>
            </div>

            {/* Role cards */}
            <div className="mt-8 space-y-3">
              {[
                { icon: <UserCheck className="h-5 w-5 text-purple-300" />, role: 'Patient', desc: 'Book appointments, view prescriptions, track payments.' },
                { icon: <Stethoscope className="h-5 w-5 text-emerald-450" />, role: 'Doctor', desc: 'Manage schedules, write prescriptions, approve bookings.' },
              ].map(r => (
                <div key={r.role} className="flex items-start gap-4 bg-white/10 border border-white/10 rounded-md p-3.5 backdrop-blur-xs">
                  <div className="bg-white/15 p-2 rounded-md shrink-0">
                    {r.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide">{r.role}</div>
                    <div className="text-[10px] text-purple-100/80 mt-1 leading-relaxed">{r.desc}</div>
                  </div>
                </div>
              ))}
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
              <div className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest font-mono mb-2">auth / register</div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">Create Account</h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Fill in your details to get started.</p>
            </div>

            {errorMsg && (
              <div className="border border-red-500/20 bg-red-500/5 px-4 py-2.5 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-[11px] text-red-600 dark:text-red-400 font-medium">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Role selector */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Register As</div>
                <div className="grid grid-cols-2 gap-3">
                  {(['patient', 'doctor'] as const).map(r => (
                    <button key={r} type="button" onClick={() => setValue('role', r)}
                      className={`py-2.5 border rounded-md text-xs font-bold uppercase tracking-wider transition-all select-none ${
                        selectedRole === r 
                          ? 'border-[#4A2E80] bg-purple-500/5 text-[#4A2E80] dark:border-purple-500 dark:bg-purple-950/15 dark:text-purple-300 font-bold' 
                          : 'border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/40'
                      }`}>
                      {r}
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register('role')} />
              </div>

              {/* Text fields */}
              {[
                { label: 'Full Name', name: 'name' as const, type: 'text', icon: <UserIcon className="h-4 w-4 text-slate-400 dark:text-zinc-500" />, placeholder: 'Jane Doe' },
                { label: 'Email Address', name: 'email' as const, type: 'email', icon: <Mail className="h-4 w-4 text-slate-400 dark:text-zinc-500" />, placeholder: 'you@example.com' },
                { label: 'Phone Number', name: 'phone' as const, type: 'text', icon: <Phone className="h-4 w-4 text-slate-400 dark:text-zinc-500" />, placeholder: '+1 (555) 000-0000' },
                { label: 'Password', name: 'password' as const, type: 'password', icon: <Lock className="h-4 w-4 text-slate-400 dark:text-zinc-500" />, placeholder: '••••••••' },
              ].map(f => (
                <div key={f.name} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">{f.label}</label>
                  <div className="flex items-center border border-slate-200 dark:border-zinc-800 rounded-md bg-slate-50/50 dark:bg-zinc-900/20 focus-within:border-[#4A2E80] focus-within:ring-1 focus-within:ring-[#4A2E80] focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all">
                    <span className="ml-3 shrink-0">{f.icon}</span>
                    <input type={f.type} placeholder={f.placeholder} {...register(f.name)}
                      className="w-full bg-transparent outline-none text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 px-3 py-2.5" />
                  </div>
                  {errors[f.name] && <p className="text-[10px] text-red-500 dark:text-red-400 font-medium px-1">{errors[f.name]?.message}</p>}
                </div>
              ))}

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">Gender</label>
                <div className="flex gap-3">
                  {['male', 'female', 'other'].map(g => (
                    <label key={g} className="flex-1">
                      <input type="radio" {...register('gender')} value={g} className="sr-only peer" />
                      <div className="border border-slate-200 dark:border-zinc-800 peer-checked:border-[#4A2E80] peer-checked:bg-purple-500/5 peer-checked:text-[#4A2E80] dark:peer-checked:border-purple-500 dark:peer-checked:bg-purple-950/15 dark:peer-checked:text-purple-300 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/40 py-2 rounded-md text-center text-xs font-bold cursor-pointer transition-all capitalize select-none">
                        {g}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.gender && <p className="text-[10px] text-red-500 dark:text-red-400 font-medium px-1">{errors.gender.message}</p>}
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading}
                className="w-full bg-[#4A2E80] hover:bg-purple-750 dark:bg-purple-650 dark:hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6 cursor-pointer shadow-sm shadow-purple-500/10 active:scale-[0.98]">
                {loading ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account…</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs pt-1 border-t border-slate-100 dark:border-zinc-800">
              <span className="text-slate-400 dark:text-zinc-500">Already registered? </span>
              <Link href="/login" className="text-[#4A2E80] dark:text-purple-400 hover:text-purple-750 dark:hover:text-purple-300 font-bold transition-colors">
                Sign in →
              </Link>
            </div>

          </div>
        </div>

        </div>
      </ScrollAnimate>
    </div>
  );
}
