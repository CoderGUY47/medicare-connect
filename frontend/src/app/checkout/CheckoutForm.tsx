'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { db, Doctor, Appointment, Payment } from '../../lib/mockDb';
import { ShieldCheck, CreditCard, Lock, DollarSign, Calendar, Clock, HeartPulse, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams ? searchParams.get('doctorId') || '' : '';
  const date = searchParams ? searchParams.get('date') || '' : '';
  const time = searchParams ? searchParams.get('time') || '' : '';
  const symptoms = searchParams ? searchParams.get('symptoms') || '' : '';

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (doctorId) {
      const doc = db.getDoctors().find(d => d.id === doctorId);
      if (doc) setDoctor(doc);
    }
  }, [doctorId]);

  if (!user || user.role !== 'patient') {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-5">
        <Lock className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">Access Restricted</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400">Patient credentials are required to complete checkout.</p>
        <button onClick={() => router.push('/login')} className="bg-rose-600 hover:bg-rose-750 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">Login</button>
      </div>
    );
  }

  if (!doctorId || !doctor || !date || !time) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-5">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">Missing Parameters</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400">Return to doctor search directory and select a consultation slot.</p>
        <button onClick={() => router.push('/find-doctors')} className="bg-rose-600 hover:bg-rose-750 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">Find Doctors</button>
      </div>
    );
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (cardNumber.replace(/\s/g, '').length < 16) { setErrorMsg('Please enter a valid 16-digit card number.'); return; }
    if (!expiry || !cvc || !cardName) { setErrorMsg('Please fill in all card fields.'); return; }
    setLoading(true);
    setTimeout(() => {
      const mockTxn = `CH_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`.toUpperCase();
      const mockAptId = `apt-${Date.now()}`;
      const newPayment: Payment = { id: `pay-${Date.now()}`, appointmentId: mockAptId, patientId: user.id, patientName: user.name, doctorId: doctor.id, doctorName: doctor.doctorName, amount: doctor.consultationFee, transactionId: mockTxn, paymentDate: new Date().toISOString() };
      db.setPayments([newPayment, ...db.getPayments()]);
      const newAppointment: Appointment = { id: mockAptId, patientId: user.id, doctorId: doctor.id, appointmentDate: date, appointmentTime: time, appointmentStatus: 'confirmed', symptoms: symptoms || 'Routine consultation.', paymentStatus: 'paid', paymentId: newPayment.id };
      db.setAppointments([newAppointment, ...db.getAppointments()]);
      setTxnId(mockTxn); setSuccess(true); setLoading(false);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md border border-slate-100 dark:border-zinc-800 bg-card shadow-2xl rounded-2xl overflow-hidden">
          <div className="border-b border-green-500/20 bg-green-500/5 px-6 py-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center border border-green-500/25 bg-green-500/10 text-green-550 rounded-2xl mb-3">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-sm font-extrabold text-foreground uppercase tracking-widest">Consultation Confirmed</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Fee charged · Booking slot secured</p>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: 'Doctor', value: doctor.doctorName },
              { label: 'Date', value: date },
              { label: 'Time', value: time },
              { label: 'Amount', value: `$${doctor.consultationFee}.00` },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2 last:border-0">
                <span className="text-[10px] uppercase tracking-wider text-slate-450 dark:text-zinc-500 font-bold">{f.label}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{f.value}</span>
              </div>
            ))}
            <div className="border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl mt-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-550 font-bold mb-1.5">Transaction ID</div>
              <div className="text-xs text-rose-600 dark:text-rose-400 break-all font-mono">{txnId}</div>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-zinc-800 p-4">
            <button onClick={() => router.push('/dashboard/patient/appointments')}
              className="w-full bg-rose-600 hover:bg-rose-700 py-3 rounded-lg text-xs font-bold text-white uppercase tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-600/10">
              View My Appointments <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

        {/* Left — Payment form */}
        <form onSubmit={handlePaymentSubmit} className="md:col-span-7 border border-slate-100 dark:border-zinc-800 bg-card rounded-[10px] shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 dark:border-zinc-800 pb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-550 uppercase tracking-widest font-extrabold mb-1">checkout & payment</div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-rose-500" /> Stripe Secure Checkout
              </h2>
            </div>
            <span className="flex items-center gap-1 border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-655 dark:text-amber-400 font-extrabold rounded-lg">
              <Lock className="h-3 w-3" /> TEST MODE
            </span>
          </div>

          {errorMsg && (
            <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 rounded-lg flex items-center gap-2 text-xs font-bold text-red-500">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-405 dark:text-zinc-500">Cardholder Name</div>
              <input type="text" required placeholder="Jane Doe" value={cardName} onChange={e => setCardName(e.target.value)}
                className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-750 bg-background focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 px-3.5 py-2.5 text-xs text-foreground placeholder:text-slate-400 dark:placeholder:text-zinc-550 outline-none transition-all" />
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-405 dark:text-zinc-500">Card Number</div>
              <div className="flex items-center rounded-[8px] border border-slate-200 dark:border-zinc-750 bg-background focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/10 transition-all">
                <CreditCard className="h-4 w-4 text-slate-450 dark:text-zinc-500 ml-3.5 flex-shrink-0" />
                <input type="text" required placeholder="4242 4242 4242 4242" value={cardNumber}
                  onChange={e => { const v = e.target.value.replace(/\D/g,'').slice(0,16); setCardNumber(v.replace(/(\d{4})(?=\d)/g,'$1 ')); }}
                  className="w-full bg-transparent outline-none text-xs text-foreground placeholder:text-slate-400 dark:placeholder:text-zinc-550 px-3 py-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-405 dark:text-zinc-500">Expiry</div>
                <input type="text" required placeholder="MM/YY" value={expiry}
                  onChange={e => { const v = e.target.value.replace(/\D/g,'').slice(0,4); setExpiry(v.length>=3?`${v.slice(0,2)}/${v.slice(2)}`:v); }}
                  className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-750 bg-background focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 px-3.5 py-2.5 text-xs text-foreground placeholder:text-slate-400 dark:placeholder:text-zinc-550 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-405 dark:text-zinc-500">CVC</div>
                <input type="password" required placeholder="•••" value={cvc}
                  onChange={e => setCvc(e.target.value.replace(/\D/g,'').slice(0,3))}
                  className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-750 bg-background focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 px-3.5 py-2.5 text-xs text-foreground placeholder:text-slate-400 dark:placeholder:text-zinc-550 outline-none transition-all" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-[8px] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-rose-600/10 active:scale-[0.98]">
            {loading ? (
              <><div className="h-3.5 w-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" /> Processing…</>
            ) : (
              <>Charge ${doctor.consultationFee} & Book Slot</>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span className="text-[10px] font-bold text-slate-450 dark:text-zinc-500 uppercase tracking-wider">Simulated Stripe integration · No real charges</span>
          </div>
        </form>

        {/* Right — Booking summary */}
        <div className="md:col-span-5 border border-slate-100 dark:border-zinc-800 bg-card rounded-[10px] shadow-sm p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="text-[10px] text-slate-400 dark:text-zinc-550 uppercase tracking-widest font-extrabold mb-1">booking summary</div>
            <div className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-rose-500" />
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">Consultation Details</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/20 rounded-xl">
            <img src={doctor.profileImage} alt={doctor.doctorName} className="h-12 w-12 object-cover border border-slate-200 dark:border-zinc-800 rounded-xl flex-shrink-0" />
            <div className="space-y-0.5">
              <div className="text-xs font-extrabold text-slate-900 dark:text-zinc-100">{doctor.doctorName}</div>
              <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">{doctor.specialization}</div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">{doctor.hospitalName}</div>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { icon: <Calendar className="h-3.5 w-3.5 text-rose-500" />, label: 'Date', value: date },
              { icon: <Clock className="h-3.5 w-3.5 text-rose-500" />, label: 'Time Slot', value: time },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between border border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/10 px-4 py-3 rounded-xl">
                <div className="flex items-center gap-1.5">
                  {f.icon}
                  <span className="text-[10px] uppercase text-slate-450 dark:text-zinc-500 font-extrabold tracking-wider">{f.label}</span>
                </div>
                <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">{f.value}</span>
              </div>
            ))}
          </div>

          <div className="border border-slate-100 dark:border-zinc-800/80 bg-slate-50/30 dark:bg-zinc-900/10 p-4 rounded-xl">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-405 dark:text-zinc-550 mb-1.5">Symptoms Description</div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 italic leading-relaxed">&ldquo;{symptoms || 'Routine consultation.'}&rdquo;</p>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800 pt-4 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-450 dark:text-zinc-500">Total Fee</span>
            <div className="flex items-center gap-0.5 text-lg font-extrabold text-rose-600 dark:text-rose-400">
              <DollarSign className="h-4 w-4" />{doctor.consultationFee}.00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
