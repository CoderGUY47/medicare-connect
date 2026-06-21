'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { db, Appointment, Prescription, User } from '../../../../lib/mockDb';
import { FileText, ArrowLeft, HeartPulse, User as UserIcon, Calendar, Clock, Phone, Mail, Sparkles, Activity } from 'lucide-react';
import { toast } from 'react-toastify';

export default function PrescriptionEditor() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId') || '';

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<User | null>(null);
  const [existingPrescription, setExistingPrescription] = useState<Prescription | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  useEffect(() => {
    if (!appointmentId) return;
    const apt = db.getAppointments().find(a => a.id === appointmentId);
    if (apt) {
      setAppointment(apt);
      const pat = db.getUsers().find(u => u.id === apt.patientId);
      if (pat) setPatient(pat);
      const rx = db.getPrescriptions().find(p => p.appointmentId === appointmentId);
      if (rx) { 
        setExistingPrescription(rx); 
        setDiagnosis(rx.diagnosis); 
        setMedications(rx.medications); 
        setNotes(rx.notes); 
      }
    }
  }, [appointmentId]);

  useEffect(() => {
    if (user) {
      const rxList = db.getPrescriptions().filter(p => p.doctorId === user.id);
      rxList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPrescriptions(rxList);
    }
  }, [user, appointmentId]);

  if (!appointmentId) {
    const filteredRx = prescriptions.filter(p => 
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      p.medications.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="space-y-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
              <span>Doctor</span><FileText className="h-3 w-3" /><span className="text-emerald-500">Prescriptions</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              Prescriptions Directory
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">Search and review digital prescriptions you have issued to patients.</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/doctor/appointments')}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-md transition-all shadow-md shadow-emerald-500/10 cursor-pointer shrink-0"
          >
            New Prescription
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 px-3.5 py-2.5 w-full sm:w-80 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all shadow-sm">
          <FileText className="h-4 w-4 text-slate-400 shrink-0" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search by patient, diagnosis, or meds…" 
            className="bg-transparent outline-none text-xs text-slate-900 dark:text-zinc-150 placeholder:text-slate-400 w-full font-semibold border-none" 
          />
        </div>

        {/* Prescription List Grid */}
        {filteredRx.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRx.map((rx) => (
              <div key={rx.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-105 dark:border-zinc-800 pb-3">
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-zinc-100">{rx.patientName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Issued on {new Date(rx.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">#{rx.id.toUpperCase()}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 block mb-1">Diagnosis</span>
                    <span className="inline-block border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      {rx.diagnosis}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 block mb-1">Medications</span>
                    <div className="text-xs text-slate-600 dark:text-zinc-350 line-clamp-2 leading-relaxed whitespace-pre-line font-semibold">
                      {rx.medications}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-zinc-800 pt-3.5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedRx(rx)}
                    className="border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-650 dark:text-zinc-300 px-3.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/doctor/prescriptions?appointmentId=${rx.appointmentId}`)}
                    className="bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-600 text-emerald-650 hover:text-white px-3.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer shadow-sm"
                  >
                    Edit Prescription
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-dashed border-slate-250 dark:border-zinc-800 rounded-2xl py-20 flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No prescriptions found</p>
              <p className="text-xs text-slate-400 mt-1">There are no records matching your query.</p>
            </div>
          </div>
        )}

        {/* View Prescription Modal */}
        {selectedRx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/10">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Prescription Details</h3>
                </div>
                <button 
                  onClick={() => setSelectedRx(null)} 
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 transition-colors cursor-pointer border-none"
                >
                  <span className="text-lg">×</span>
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4 text-xs">
                  <div>
                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Patient Name</div>
                    <div className="font-bold text-slate-800 dark:text-zinc-200">{selectedRx.patientName}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Date Prescribed</div>
                    <div className="font-bold text-slate-800 dark:text-zinc-200">{new Date(selectedRx.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Diagnosis</div>
                  <div className="text-xs font-bold text-emerald-650 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/15 w-fit uppercase">
                    {selectedRx.diagnosis}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Medications</div>
                  <div className="bg-slate-50 dark:bg-zinc-800/40 border border-slate-150 dark:border-zinc-800 rounded-xl p-4 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-mono tracking-wide">
                    {selectedRx.medications}
                  </div>
                </div>

                {selectedRx.notes && (
                  <div>
                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Instruction Notes</div>
                    <div className="bg-slate-50 dark:bg-zinc-800/40 border border-slate-150 dark:border-zinc-800 rounded-xl p-4 text-xs text-slate-650 dark:text-zinc-400 leading-relaxed font-semibold italic">
                      &ldquo;{selectedRx.notes}&rdquo;
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20 flex justify-end gap-2">
                <button 
                  onClick={() => setSelectedRx(null)}
                  className="text-xs font-bold px-5 py-2 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 transition-all cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={() => { setSelectedRx(null); toast.success('Downloading PDF receipt...'); }}
                  className="text-xs font-bold px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-sm"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (appointmentId && (!appointment || !patient)) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-5 shadow-sm mt-10">
        <HeartPulse className="h-12 w-12 text-red-500 mx-auto animate-pulse" />
        <h3 className="text-base font-bold text-slate-800 dark:text-zinc-150 uppercase tracking-wider">Invalid Appointment ID</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          The requested appointment record does not exist or is not assigned to your account.
        </p>
        <button 
          onClick={() => router.push('/dashboard/doctor/appointments')} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-md text-xs uppercase tracking-widest transition-all cursor-pointer"
        >
          Back to Appointments
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!user || !patient || !appointment) return;
    if (!diagnosis.trim()) { 
      toast.error('Clinical diagnosis is required.'); 
      return; 
    }
    if (!medications.trim()) { 
      toast.error('Medication details are required.'); 
      return; 
    }
    
    const prescriptions = db.getPrescriptions();
    if (existingPrescription) {
      db.setPrescriptions(prescriptions.map(p => p.id === existingPrescription.id ? { ...p, diagnosis: diagnosis.trim(), medications: medications.trim(), notes: notes.trim() } : p));
      toast.success('Prescription updated successfully.');
    } else {
      const newRx: Prescription = { 
        id: `rx-${Date.now()}`, 
        doctorId: user.id, 
        doctorName: user.name, 
        patientId: patient.id, 
        patientName: patient.name, 
        appointmentId: appointment.id, 
        diagnosis: diagnosis.trim(), 
        medications: medications.trim(), 
        notes: notes.trim(), 
        createdAt: new Date().toISOString() 
      };
      db.setPrescriptions([newRx, ...prescriptions]);
      if (appointment.appointmentStatus !== 'completed') {
        db.setAppointments(db.getAppointments().map(a => a.id === appointment.id ? { ...a, appointmentStatus: 'completed' as const } : a));
      }
      toast.success('Prescription published and shared with patient!');
    }
    setTimeout(() => { 
      router.push('/dashboard/doctor/appointments'); 
    }, 1500);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PT';

  if (!patient || !appointment) return null;

  return (
    <div className="space-y-7">
      
      {/* Back button link */}
      <button 
        onClick={() => router.push('/dashboard/doctor/appointments')} 
        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-zinc-550 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors uppercase tracking-wider cursor-pointer w-fit"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Appointments
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
          <span>Doctor</span><ArrowLeft className="h-3 w-3" /><span className="text-emerald-500">Prescription Editor</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          Write Digital Prescription
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">
          Document patient findings, issue medical doses, and publish scripts for <span className="text-slate-800 dark:text-zinc-150 font-semibold">{patient.name}</span>.
        </p>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Prescription details form */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Prescription Details</h2>
            </div>
            {existingPrescription && (
              <span className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Edit Mode
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {[
              { label: 'Clinical Diagnosis', value: diagnosis, setter: setDiagnosis, rows: 3, placeholder: 'Describe your clinical findings and patient diagnosis...', mono: false, req: true },
              { label: 'Medications (one per line)', value: medications, setter: setMedications, rows: 5, placeholder: 'e.g. Paracetamol 500mg — 3 times daily after meals\nAmoxicillin 250mg — twice daily for 5 days...', mono: true, req: true },
              { label: 'Special Instructions / Notes (Optional)', value: notes, setter: setNotes, rows: 3, placeholder: 'e.g. Bed rest for 3 days, drink warm fluids, review in case symptoms persist...', mono: false, req: false },
            ].map(f => (
              <div key={f.label} className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400">{f.label}</label>
                <textarea 
                  rows={f.rows} 
                  required={f.req} 
                  placeholder={f.placeholder} 
                  value={f.value}
                  onChange={e => f.setter(e.target.value)}
                  className={`w-full border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white dark:focus:bg-zinc-900 rounded-xl p-3.5 text-xs text-slate-900 dark:text-zinc-150 placeholder:text-slate-400 outline-none transition-all resize-none ${f.mono ? 'font-mono tracking-wide' : 'font-sans font-semibold'}`} 
                />
              </div>
            ))}

            <button 
              type="submit" 
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-md transition-all shadow-md shadow-emerald-550/20 cursor-pointer w-fit"
            >
              <FileText className="h-4 w-4" />
              {existingPrescription ? 'Update Prescription' : 'Save & Publish Prescription'}
            </button>
          </form>
        </div>

        {/* Patient Profile / Context Card */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Patient Context Card */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-emerald-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Patient Context</h2>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
                {patient.photo ? (
                  <img src={patient.photo} alt={patient.name} className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-zinc-700 shadow-sm shrink-0" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center text-sm shrink-0 border border-emerald-500/10">
                    {getInitials(patient.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-150 truncate">{patient.name}</div>
                  <span className="inline-block border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded-lg text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-1">Patient</span>
                </div>
              </div>

              {/* Patient Fields */}
              <div className="space-y-3.5">
                {[
                  { label: 'Email', value: patient.email, icon: Mail },
                  { label: 'Phone', value: patient.phone || 'N/A', icon: Phone },
                  { label: 'Consult Date', value: appointment.appointmentDate, icon: Calendar },
                  { label: 'Time Slot', value: appointment.appointmentTime, icon: Clock },
                ].map(f => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="flex items-start justify-between gap-3 text-xs">
                      <span className="text-slate-450 dark:text-zinc-450 flex items-center gap-1.5 shrink-0 font-semibold">
                        <Icon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {f.label}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-zinc-200 text-right break-all">{f.value}</span>
                    </div>
                  );
                })}
              </div>

              {/* Reported Symptoms */}
              <div className="border border-slate-150 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20 p-4 rounded-xl">
                <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5 flex items-center gap-1">
                  <Activity className="h-3 w-3 text-emerald-500" /> Reported Symptoms
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 italic leading-relaxed">
                  &ldquo;{appointment.symptoms || 'No description provided.'}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/15 rounded-2xl p-5 text-xs text-slate-600 dark:text-zinc-350 leading-relaxed">
            <div className="flex items-center gap-2 mb-2 font-bold text-emerald-650 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
              <Sparkles className="h-4 w-4 shrink-0 text-emerald-500" /> clinical guidance
            </div>
            Make sure to list dosage amounts, daily frequency, and the course duration clearly in the medication script.
          </div>

        </div>

      </div>
    </div>
  );
}

