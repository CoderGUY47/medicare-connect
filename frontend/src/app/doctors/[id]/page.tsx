'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBackendUrl } from '../../../utils/backendUrl';
import { useAuth } from '../../../context/AuthContext';
import { db, Doctor, Review } from '../../../lib/mockDb';
import {
  Star, MapPin, Award, ShieldCheck, Clock, DollarSign, Stethoscope,
  AlertCircle, ArrowLeft, Calendar, FileText, CheckCircle2, Loader2
} from 'lucide-react';

export default function DoctorDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [bookedSlots, setBookedSlots] = useState<{ [date: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const backendUrl = getBackendUrl();

    // Try backend first
    fetch(`${backendUrl}/doctors/${id}`, { signal: AbortSignal.timeout(7000) })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then((docData: Doctor) => {
        setDoctor(docData);
        if (docData.availableDays?.length > 0) setSelectedDay(docData.availableDays[0]);
      })
      .catch(() => {
        // Fallback to local mockDb
        const docData = db.getDoctors().find(d => d.id === id);
        if (docData) {
          setDoctor(docData);
          if (docData.availableDays.length > 0) setSelectedDay(docData.availableDays[0]);
        }
      })
      .finally(() => setIsLoading(false));

    // Reviews still come from local data
    setReviews(db.getReviews().filter(r => r.doctorId === id));

    // Booked slots from local appointments
    const bookings: { [date: string]: string[] } = {};
    db.getAppointments()
      .filter(a => a.doctorId === id && ['confirmed', 'pending'].includes(a.appointmentStatus))
      .forEach(a => {
        if (!bookings[a.appointmentDate]) bookings[a.appointmentDate] = [];
        bookings[a.appointmentDate].push(a.appointmentTime);
      });
    setBookedSlots(bookings);
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 flex flex-col items-center gap-4 text-slate-400 dark:text-zinc-500">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
        <span className="text-sm font-semibold">Loading doctor profile from database…</span>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-5">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h2 className="font-extrabold text-base uppercase text-slate-800 dark:text-zinc-100 tracking-wider">Doctor Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">This profile registry entry does not exist or was removed.</p>
        <button onClick={() => router.push('/find-doctors')} className="bg-rose-600 hover:bg-rose-700 px-6 py-2.5 rounded-[8px] text-xs font-bold text-white uppercase tracking-wider transition-all shadow-lg shadow-rose-600/10 active:scale-[0.98]">Back to Directory</button>
      </div>
    );
  }

  const getNextDateForDay = (dayName: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayIndex = days.indexOf(dayName);
    if (targetDayIndex === -1) return new Date().toISOString().split('T')[0];
    const today = new Date();
    let diff = targetDayIndex - today.getDay();
    if (diff <= 0) diff += 7;
    const target = new Date(today.setDate(today.getDate() + diff));
    return target.toISOString().split('T')[0];
  };

  const selectedDateStr = getNextDateForDay(selectedDay);
  const isSlotBooked = (slot: string) => bookedSlots[selectedDateStr]?.includes(slot) || false;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setErrorMsg('');
    if (!user) { router.push(`/login?redirect=/doctors/${id}`); return; }
    if (user.role !== 'patient') { setErrorMsg('Only patient accounts can book appointments.'); return; }
    if (!selectedDay || !selectedSlot) { setErrorMsg('Please select a date and a time slot.'); return; }
    if (!symptoms.trim()) { setErrorMsg('Please describe your symptoms so the doctor can prepare.'); return; }
    router.push(`/checkout?${new URLSearchParams({ doctorId: doctor.id, date: selectedDateStr, time: selectedSlot, symptoms: symptoms.trim() }).toString()}`);
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '4.9';

  return (
    <div className="container px-4 py-8 sm:px-6 lg:px-8 space-y-6">

      {/* Back */}
      <button onClick={() => router.push('/find-doctors')} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left column */}
        <div className="lg:col-span-8 space-y-5">

          {/* Doctor identity card */}
          <div className="border border-slate-100 dark:border-zinc-800 bg-card rounded-[10px] shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50">
              <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Registry Profile</span>
              <span className="flex items-center gap-1 border border-green-500/25 bg-green-500/10 px-2.5 py-1 text-[10px] font-bold text-green-600 dark:text-green-400 rounded-lg">
                <ShieldCheck className="h-3.5 w-3.5" /> VERIFIED SPECIALIST
              </span>
            </div>

            <div className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <img src={doctor.profileImage} alt={doctor.doctorName} className="h-28 w-28 object-cover rounded-2xl border border-slate-200 dark:border-zinc-800 flex-shrink-0 shadow-sm" />
              <div className="space-y-4 flex-1">
                <div>
                  <span className="inline-block border border-rose-500/25 bg-rose-500/5 px-2.5 py-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest rounded-lg mb-2">{doctor.specialization}</span>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">{doctor.doctorName}</h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" /> {doctor.hospitalName}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400">
                      <Award className="h-3.5 w-3.5 text-rose-500" /> {doctor.experience} Yrs Experience
                    </span>
                    <span className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> {avgRating} Avg Rating
                    </span>
                  </div>
                </div>
                <div className="border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/20 p-4 rounded-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5">CREDENTIALS & DEGREES</div>
                  <div className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">{doctor.qualifications}</div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="border-t border-slate-100 dark:border-zinc-800 grid grid-cols-3 divide-x divide-slate-100 dark:divide-zinc-800 bg-slate-50/30 dark:bg-zinc-900/10">
              {[
                { label: 'Clinical Experience', value: `${doctor.experience} Years` },
                { label: 'Consultation Fee', value: `৳${doctor.consultationFee}` },
                { label: 'Patient Reviews', value: reviews.length },
              ].map(s => (
                <div key={s.label} className="px-4 py-4 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">{s.label}</div>
                  <div className="text-base font-extrabold text-rose-600 dark:text-rose-400 mt-1">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* About section */}
          <div className="border border-slate-100 dark:border-zinc-800 bg-card rounded-[10px] shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 dark:border-zinc-800 px-6 py-4 flex items-center gap-2 bg-slate-50/50 dark:bg-zinc-900/50">
              <Stethoscope className="h-4 w-4 text-rose-500" />
              <span className="text-xs uppercase tracking-wider text-slate-800 dark:text-zinc-100 font-extrabold">About the Doctor</span>
            </div>
            <div className="p-6">
              <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                {doctor.doctorName} is a highly committed specialist with {doctor.experience} years of clinical excellence practicing at {doctor.hospitalName}. Experienced in addressing complex cases, prescribing personalized pathways, and guiding patients toward sustained recovery.
              </p>
            </div>
          </div>

          {/* Reviews */}
          <div className="border border-slate-100 dark:border-zinc-800 bg-card rounded-[10px] shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-xs uppercase tracking-wider text-slate-800 dark:text-zinc-100 font-extrabold">Patient Reviews ({reviews.length})</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-extrabold text-amber-500 bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded-lg">★ {avgRating} Avg Rating</span>
            </div>

            {reviews.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {reviews.map(rev => (
                  <div key={rev.id} className="flex gap-4 p-6 items-start">
                    <img src={rev.patientPhoto} alt={rev.patientName} className="h-10 w-10 object-cover rounded-full border border-slate-200 dark:border-zinc-800 flex-shrink-0 shadow-sm" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-zinc-100">{rev.patientName}</div>
                          <div className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">{new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        </div>
                        <div className="flex text-amber-400 gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current stroke-current" />)}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">{rev.reviewText}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-transparent">
                <FileText className="h-8 w-8 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-extrabold tracking-wider">No reviews registered yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right — Booking widget */}
        <div className="lg:col-span-4 border border-slate-100 dark:border-zinc-800 bg-card rounded-[10px] shadow-sm sticky top-24 overflow-hidden">
          <div className="border-b border-slate-100 dark:border-zinc-800 px-5 py-3.5 flex items-center gap-2 bg-slate-50/50 dark:bg-zinc-900/50">
            <Calendar className="h-4 w-4 text-rose-500" />
            <span className="text-xs uppercase tracking-wider text-slate-800 dark:text-zinc-100 font-extrabold">Schedule Consultation</span>
          </div>

          <form onSubmit={handleBookingSubmit} className="p-5 space-y-5">
            {/* Fee */}
            <div className="flex items-center justify-between border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/20 px-4 py-3 rounded-xl">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-555">
                <i className="fa-solid fa-bangladeshi-taka-sign text-xs text-rose-500 mr-0.5"></i> Consultation Fee
              </span>
              <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400">৳{doctor.consultationFee}.00</span>
            </div>

            {/* Day picker */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">1. Choose Day</div>
              <div className="grid grid-cols-2 gap-2">
                {doctor.availableDays.map(day => (
                  <button key={day} type="button" onClick={() => { setSelectedDay(day); setSelectedSlot(''); }}
                    className={`py-2 px-1 text-center border rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${selectedDay === day ? 'bg-rose-600 border-rose-600 text-white shadow-sm' : 'border-slate-200 dark:border-zinc-800 text-slate-650 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                    {day}
                    <span className="block text-[9px] opacity-75 font-normal normal-case mt-0.5">{getNextDateForDay(day).split('-').slice(1).join('/')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slot picker */}
            {selectedDay && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  <Clock className="h-4 w-4 text-rose-500" /> 2. Choose Time Slot
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {doctor.availableSlots.map(slot => {
                    const booked = isSlotBooked(slot);
                    return (
                      <button key={slot} type="button" disabled={booked} onClick={() => setSelectedSlot(slot)}
                        className={`py-2 text-center border rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedSlot === slot ? 'bg-rose-600 border-rose-600 text-white shadow-sm' :
                          booked ? 'border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-800/10 text-slate-300 dark:text-zinc-650 line-through cursor-not-allowed' :
                          'border-slate-200 dark:border-zinc-800 text-slate-650 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                        }`}>
                        {slot}
                        {booked && <span className="block text-[9px] font-normal normal-case mt-0.5">(Booked)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Symptoms */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">3. Describe Symptoms</div>
              <textarea rows={4} required placeholder="Describe any symptoms, conditions or concerns..." value={symptoms} onChange={e => setSymptoms(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-background focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 p-3.5 text-xs text-foreground placeholder:text-slate-400 dark:placeholder:text-zinc-550 outline-none transition-all resize-none leading-relaxed" />
            </div>

            {errorMsg && (
              <div className="border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold text-red-500">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase py-3.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/10 active:scale-[0.98] cursor-pointer">
              <CheckCircle2 className="h-4 w-4" /> Proceed to Payment
            </button>

            {!user && <p className="text-[10px] text-center text-slate-400 dark:text-zinc-500 font-semibold">* You will be asked to sign in to Medi-Doc to complete checkout.</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
