'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { User as UserIcon, Phone, Image as ImageIcon, Award, Stethoscope, DollarSign, Building2, Save, Sparkles, Shield } from 'lucide-react';
import { db } from '../../../../lib/mockDb';
import { toast } from 'react-toastify';

const docProfileSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  phone: zod.string().min(6, 'Please enter a valid phone number'),
  photo: zod.string().url('Please enter a valid photo URL').or(zod.literal('')),
  specialization: zod.string().min(2, 'Specialization must be at least 2 characters'),
  qualifications: zod.string().min(5, 'Credentials must be at least 5 characters'),
  experience: zod.number().min(1, 'Experience must be at least 1 year'),
  consultationFee: zod.number().min(10, 'Fee must be at least $10'),
  hospitalName: zod.string().min(2, 'Hospital name must be at least 2 characters')
});

type DocProfileFormValues = zod.infer<typeof docProfileSchema>;

export default function DoctorProfilePage() {
  const { user, updateProfile } = useAuth();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<DocProfileFormValues>({
    resolver: zodResolver(docProfileSchema),
    defaultValues: { name: '', phone: '', photo: '', specialization: '', qualifications: '', experience: 1, consultationFee: 50, hospitalName: '' }
  });

  const photoVal = watch('photo');

  useEffect(() => {
    if (user) {
      const docData = db.getDoctors().find(d => d.id === user.id);
      reset({ 
        name: user.name, 
        phone: user.phone || '', 
        photo: user.photo || '', 
        specialization: docData?.specialization || '', 
        qualifications: docData?.qualifications || '', 
        experience: docData?.experience || 1, 
        consultationFee: docData?.consultationFee || 50, 
        hospitalName: docData?.hospitalName || '' 
      });
    }
  }, [user, reset]);

  const onSubmit = (values: DocProfileFormValues) => {
    if (!user) return;
    updateProfile({ name: values.name, phone: values.phone, photo: values.photo });
    db.setDoctors(db.getDoctors().map(d => d.id === user.id ? { 
      ...d, 
      doctorName: values.name, 
      profileImage: values.photo, 
      specialization: values.specialization, 
      qualifications: values.qualifications, 
      experience: values.experience, 
      consultationFee: values.consultationFee, 
      hospitalName: values.hospitalName 
    } : d));
    toast.success('Professional profile updated successfully!');
  };

  const textFields = [
    { label: 'Full Name', name: 'name' as const, icon: <UserIcon className="h-4 w-4 text-slate-400" />, placeholder: 'Dr. Jane Doe' },
    { label: 'Specialization', name: 'specialization' as const, icon: <Stethoscope className="h-4 w-4 text-slate-400" />, placeholder: 'e.g. Cardiology' },
    { label: 'Photo URL', name: 'photo' as const, icon: <ImageIcon className="h-4 w-4 text-slate-400" />, placeholder: 'https://...' },
    { label: 'Credentials & Degrees', name: 'qualifications' as const, icon: <Award className="h-4 w-4 text-slate-400" />, placeholder: 'MD, MBBS — Harvard Medical' },
    { label: 'Hospital / Clinic', name: 'hospitalName' as const, icon: <Building2 className="h-4 w-4 text-slate-400" />, placeholder: 'City General Hospital' },
    { label: 'Contact Phone', name: 'phone' as const, icon: <Phone className="h-4 w-4 text-slate-400" />, placeholder: '+1 (555) 000-0000' },
  ];

  const initials = user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'DR';

  return (
    <div className="space-y-7">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
          <span>Doctor</span><Stethoscope className="h-3 w-3" /><span className="text-emerald-500">Profile Settings</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          Professional Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">Modify clinical credentials, consult fees, contact details, and visibility settings.</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

        {/* Left side: Doctor Profile card */}
        <div className="md:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-5 shadow-sm text-center">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 text-left border-b border-slate-100 dark:border-zinc-800 pb-2.5">
            Profile Card Preview
          </div>

          <div className="flex flex-col items-center">
            {photoVal ? (
              <img 
                src={photoVal} 
                alt="Preview" 
                className="h-24 w-24 object-cover rounded-2xl border-4 border-slate-100 dark:border-zinc-800 shadow-md" 
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
              />
            ) : (
              <div className="h-24 w-24 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-4 border-slate-100 dark:border-zinc-800 shadow-md flex items-center justify-center text-2xl font-extrabold">
                {initials}
              </div>
            )}
            
            <div className="mt-3.5 space-y-1">
              <div className="text-sm font-bold text-slate-800 dark:text-zinc-150">{user?.name}</div>
              <div className="text-[10px] text-slate-400">{user?.email}</div>
              <span className="inline-block border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5 rounded-lg text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-2.5">
                Doctor Specialist
              </span>
            </div>
          </div>

          {/* Numeric fields */}
          <div className="border-t border-slate-100 dark:border-zinc-800 pt-4 space-y-3.5 text-left">
            {[
              { label: 'Clinical Experience', name: 'experience' as const, icon: <Award className="h-4 w-4 text-slate-450" />, suffix: ' Years' },
              { label: 'Consultation Fee', name: 'consultationFee' as const, icon: <DollarSign className="h-4 w-4 text-slate-450" />, prefix: '$' },
            ].map(f => (
              <div key={f.name} className="space-y-1.5">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">{f.label}</label>
                <div className="flex items-center border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800 px-3 py-2 rounded-xl focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all font-semibold text-xs">
                  {f.prefix && <span className="text-slate-405 mr-1">{f.prefix}</span>}
                  {f.icon}
                  <input 
                    type="number" 
                    {...register(f.name, { valueAsNumber: true })}
                    className="w-full bg-transparent outline-none text-slate-900 dark:text-zinc-150 pl-2 pr-1 border-none font-bold" 
                  />
                  {f.suffix && <span className="text-slate-450 text-[10px] shrink-0 font-bold">{f.suffix}</span>}
                </div>
                {errors[f.name] && <p className="text-[10px] text-red-500 font-bold mt-1">{(errors[f.name] as any)?.message}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Professional Details Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-emerald-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Professional Details</h2>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {textFields.map(f => (
                  <div key={f.name} className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400">{f.label}</label>
                    <div className="flex items-center border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800 px-3 py-2.5 rounded-xl focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all font-semibold text-xs">
                      <span className="shrink-0 mr-2">{f.icon}</span>
                      <input 
                        type="text" 
                        placeholder={f.placeholder} 
                        {...register(f.name)}
                        className="w-full bg-transparent outline-none text-slate-900 dark:text-zinc-150 placeholder:text-slate-400 border-none font-bold" 
                      />
                    </div>
                    {errors[f.name] && <p className="text-[10px] text-red-500 font-bold mt-1">{(errors[f.name] as any)?.message}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-5 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/10 flex items-center justify-between flex-wrap gap-2.5">
            <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-500" /> All details undergo credentials check.
            </span>
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-md transition-all shadow-md shadow-emerald-550/20 cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save Professional Profile
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

