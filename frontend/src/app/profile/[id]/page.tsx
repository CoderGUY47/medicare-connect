'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { db, User, Doctor } from '@/lib/mockDb';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldAlert, 
  ChevronRight, 
  ArrowLeft, 
  Stethoscope, 
  Award, 
  DollarSign, 
  Building2, 
  Clock, 
  CheckCircle,
  FolderHeart
} from 'lucide-react';

export default function UserPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profileDoctor, setProfileDoctor] = useState<Doctor | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const allUsers = db.getUsers();
    const foundUser = allUsers.find(u => u.id === id);

    if (foundUser) {
      setProfileUser(foundUser);
      if (foundUser.role === 'doctor') {
        const foundDoc = db.getDoctors().find(d => d.userId === foundUser.id || d.id === foundUser.id);
        if (foundDoc) {
          setProfileDoctor(foundDoc);
        }
      }
    } else {
      setNotFound(true);
    }
  }, [id]);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl">
          <ShieldAlert className="h-16 w-16 text-rose-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Profile Not Found</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
            The profile you are looking for does not exist or has been removed.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="mt-6 inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-2.5 rounded-md cursor-pointer transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="h-8 w-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 mt-4">Loading profile details...</p>
      </div>
    );
  }

  const memberSince = profileUser.createdAt 
    ? new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
    : 'N/A';

  return (
    <div className="container mx-auto px-6 py-10 max-w-[1100px] space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
        <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-rose-600 dark:text-rose-400">Profile</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-600 dark:text-zinc-300">{profileUser.name}</span>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Avatar Card */}
        <div className="md:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col items-center p-6 text-center h-full">
          <Avatar className="h-28 w-28 border-4 border-rose-50 dark:border-zinc-800 shadow-lg">
            {profileUser.photo && (
              <AvatarImage src={profileUser.photo} alt={profileUser.name} />
            )}
            <AvatarFallback className="bg-rose-700 text-white font-extrabold text-2xl flex items-center justify-center w-full h-full">
              {getInitials(profileUser.name)}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-5 leading-snug">
            {profileUser.name}
          </h2>
          <span className="inline-flex items-center border border-rose-200 dark:border-rose-800/40 bg-rose-50/50 dark:bg-rose-950/20 px-3 py-1 rounded-full text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider mt-2.5">
            {profileUser.role}
          </span>

          <div className="w-full border-t border-slate-100 dark:border-zinc-800/60 mt-6 pt-5 text-left space-y-4">
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-zinc-350">
              <Mail className="h-4 w-4 text-rose-600 shrink-0" />
              <div className="truncate">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Email Address</div>
                <div className="font-medium mt-0.5 truncate">{profileUser.email}</div>
              </div>
            </div>

            {profileUser.phone && (
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-zinc-350">
                <Phone className="h-4 w-4 text-rose-600 shrink-0" />
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Phone Number</div>
                  <div className="font-medium mt-0.5">{profileUser.phone}</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-zinc-350">
              <Calendar className="h-4 w-4 text-rose-600 shrink-0" />
              <div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Member Since</div>
                <div className="font-medium mt-0.5">{memberSince}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Details or General Info */}
        <div className="md:col-span-8 h-full">
          {profileUser.role === 'doctor' && profileDoctor ? (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col justify-between">
              <div>
                <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/20 flex items-center gap-2.5">
                  <Stethoscope className="h-5 w-5 text-rose-600" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Professional Directory Profile</h3>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex items-start gap-3 bg-slate-50 dark:bg-zinc-800/30 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800/30">
                      <Award className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-widest">Qualifications</div>
                        <div className="text-base font-bold text-slate-800 dark:text-zinc-200 mt-1">{profileDoctor.qualifications}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-slate-50 dark:bg-zinc-800/30 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800/30">
                      <Stethoscope className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-400 dark:text-zinc-555 uppercase tracking-widest">Specialization</div>
                        <div className="text-base font-bold text-slate-800 dark:text-zinc-200 mt-1">{profileDoctor.specialization}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-slate-50 dark:bg-zinc-800/30 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800/30">
                      <Building2 className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-400 dark:text-zinc-555 uppercase tracking-widest">Hospital / Clinic</div>
                        <div className="text-base font-bold text-slate-800 dark:text-zinc-200 mt-1">{profileDoctor.hospitalName}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-slate-50 dark:bg-zinc-800/30 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800/30">
                      <i className="fa-solid fa-bangladeshi-taka-sign text-[15px] text-rose-650 shrink-0 mt-1"></i>
                      <div>
                        <div className="text-xs font-bold text-slate-400 dark:text-zinc-555 uppercase tracking-widest">Consultation Fee</div>
                        <div className="text-base font-extrabold text-slate-800 dark:text-white mt-1">৳{profileDoctor.consultationFee}</div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Checkmark */}
                  {profileDoctor.verificationStatus === 'verified' && (
                    <div className="flex items-center gap-2 bg-rose-500/5 border border-rose-500/10 rounded-xl px-4 py-3 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                      <CheckCircle className="h-4.5 w-4.5 text-rose-600" />
                      <span>This doctor is fully verified and licensed by Medi-Doc Health Systems.</span>
                    </div>
                  )}

                  {/* Availability info */}
                  <div className="border-t border-slate-100 dark:border-zinc-800/60 pt-6 space-y-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Availability Schedule</div>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 w-24 shrink-0">Available Days:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {profileDoctor.availableDays.map(day => (
                            <span key={day} className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-2.5 py-1 rounded-md text-[10px] font-bold">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 w-24 shrink-0">Active Hours:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {profileDoctor.availableSlots.map(slot => (
                            <span key={slot} className="bg-rose-100/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden p-6 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-3 flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-rose-600" />
                    Account Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-base font-semibold text-slate-700 dark:text-zinc-300">
                  <div className="flex justify-between py-3 border-b border-slate-100 dark:border-zinc-800/40">
                    <span className="text-slate-400 font-medium">Account Type</span>
                    <span className="capitalize font-bold text-slate-800 dark:text-zinc-100">{profileUser.role}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100 dark:border-zinc-800/40">
                    <span className="text-slate-400 font-medium">Status</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold capitalize">{profileUser.status}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100 dark:border-zinc-800/40">
                    <span className="text-slate-400 font-medium">Gender</span>
                    <span className="capitalize font-bold text-slate-800 dark:text-zinc-100">{profileUser.gender || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100 dark:border-zinc-800/40">
                    <span className="text-slate-400 font-medium">Verified Member</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">Yes</span>
                  </div>
                </div>

                <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 flex items-start gap-3 mt-4">
                  <FolderHeart className="h-5 w-5 text-rose-650 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100">Care Center Services</h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      This user holds a patient registry account in the Medi-Doc system. All clinical appointments, prescription directories, and lab diagnostics are encrypted and stored within the patient's secure dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Row */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-2.5 rounded-md cursor-pointer transition-all shadow-sm shadow-rose-500/15"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
