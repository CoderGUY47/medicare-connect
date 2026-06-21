'use client';

import React, { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { MdOutlineBedroomParent, MdLocalHospital } from 'react-icons/md';
import { BsPersonFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { db } from '../../../../lib/mockDb';

type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

interface Bed {
  id: string;
  bedNo: string;
  ward: string;
  status: BedStatus;
  patient?: string;
  admittedSince?: string;
}

const MOCK_BEDS: Bed[] = [
  { id: 'b1',  bedNo: 'A-01', ward: 'ICU',       status: 'occupied',     patient: 'Jane Doe',    admittedSince: '2026-06-18' },
  { id: 'b2',  bedNo: 'A-02', ward: 'ICU',       status: 'available' },
  { id: 'b3',  bedNo: 'A-03', ward: 'ICU',       status: 'reserved',     patient: 'John Smith' },
  { id: 'b4',  bedNo: 'A-04', ward: 'ICU',       status: 'maintenance' },
  { id: 'b5',  bedNo: 'B-01', ward: 'General',   status: 'occupied',     patient: 'Alice Brown',  admittedSince: '2026-06-17' },
  { id: 'b6',  bedNo: 'B-02', ward: 'General',   status: 'available' },
  { id: 'b7',  bedNo: 'B-03', ward: 'General',   status: 'available' },
  { id: 'b8',  bedNo: 'B-04', ward: 'General',   status: 'occupied',     patient: 'Bob Lee',      admittedSince: '2026-06-19' },
  { id: 'b9',  bedNo: 'B-05', ward: 'General',   status: 'available' },
  { id: 'b10', bedNo: 'C-01', ward: 'Emergency', status: 'occupied',     patient: 'Sara Khan',    admittedSince: '2026-06-20' },
  { id: 'b11', bedNo: 'C-02', ward: 'Emergency', status: 'available' },
  { id: 'b12', bedNo: 'C-03', ward: 'Emergency', status: 'reserved' },
  { id: 'b13', bedNo: 'D-01', ward: 'Pediatric', status: 'available' },
  { id: 'b14', bedNo: 'D-02', ward: 'Pediatric', status: 'occupied',     patient: 'Liam Park',    admittedSince: '2026-06-16' },
  { id: 'b15', bedNo: 'D-03', ward: 'Pediatric', status: 'available' },
];

const STATUS_CFG: Record<BedStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  available:   { label: 'Available',   color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
  occupied:    { label: 'Occupied',    color: 'text-rose-600 dark:text-rose-400',       bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    dot: 'bg-rose-500' },
  reserved:    { label: 'Reserved',    color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   dot: 'bg-amber-500' },
  maintenance: { label: 'Maintenance', color: 'text-slate-500 dark:text-zinc-400',      bg: 'bg-slate-200/50 dark:bg-zinc-800/50', border: 'border-slate-300 dark:border-zinc-700', dot: 'bg-slate-400' },
};

const WARD_ICONS: Record<string, React.ReactNode> = {
  ICU:       <MdLocalHospital className="h-6 w-6" />,
  General:   <MdOutlineBedroomParent className="h-6 w-6" />,
  Emergency: <MdLocalHospital className="h-6 w-6" />,
  Pediatric: <BsPersonFill className="h-5 w-5" />,
};

export default function BedManagementPage() {
  const [beds, setBeds] = useState<Bed[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mc_beds');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return MOCK_BEDS;
  });

  const [wardFilter, setWardFilter] = useState('All');

  // Modal states for assigning a bed
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [patientName, setPatientName] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');

  const patientsList = typeof window !== 'undefined' ? db.getUsers().filter(u => u.role === 'patient') : [];

  const updateBeds = (newBeds: Bed[]) => {
    setBeds(newBeds);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mc_beds', JSON.stringify(newBeds));
    }
  };

  const wards = ['All', ...Array.from(new Set(MOCK_BEDS.map(b => b.ward)))];
  const filtered = wardFilter === 'All' ? beds : beds.filter(b => b.ward === wardFilter);

  const counts = {
    total:       beds.length,
    available:   beds.filter(b => b.status === 'available').length,
    occupied:    beds.filter(b => b.status === 'occupied').length,
    reserved:    beds.filter(b => b.status === 'reserved').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
  };

  const handleOpenAssignModal = (bed: Bed) => {
    setSelectedBed(bed);
    setSelectedPatientId(patientsList[0]?.id || 'custom');
    setPatientName(patientsList[0]?.name || '');
    setAdmissionDate(new Date().toISOString().split('T')[0]);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed) return;
    
    let finalName = patientName.trim();
    if (selectedPatientId !== 'custom') {
      const match = patientsList.find(p => p.id === selectedPatientId);
      if (match) finalName = match.name;
    }

    if (!finalName) {
      toast.error('Please select or enter a patient name.');
      return;
    }

    const updated = beds.map(b => b.id === selectedBed.id ? {
      ...b,
      status: 'occupied' as const,
      patient: finalName,
      admittedSince: admissionDate
    } : b);

    updateBeds(updated);
    toast.success(`Bed ${selectedBed.bedNo} successfully assigned to ${finalName}.`);
    setSelectedBed(null);
  };

  const handleRelease = (id: string) => {
    const updated = beds.map(b => b.id === id ? { ...b, status: 'available' as const, patient: undefined, admittedSince: undefined } : b);
    updateBeds(updated);
    toast.success('Bed released and marked available.');
  };

  const occupancyPct = Math.round((counts.occupied / counts.total) * 100);

  return (
    <div className="space-y-7">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
          <span>Admin</span><FiChevronRight className="h-3 w-3" /><span className="text-rose-500">Bed Management</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <MdOutlineBedroomParent className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          Bed Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">Real-time ward occupancy and bed allocation across all departments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Beds',   value: counts.total,       color: 'text-slate-600 dark:text-zinc-300',      bg: 'bg-slate-500/10',   border: 'border-slate-200 dark:border-zinc-800' },
          { label: 'Available',    value: counts.available,   color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-900/50' },
          { label: 'Occupied',     value: counts.occupied,    color: 'text-rose-600 dark:text-rose-400',       bg: 'bg-rose-500/10',    border: 'border-rose-200 dark:border-rose-900/50' },
          { label: 'Reserved',     value: counts.reserved,    color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-500/10',   border: 'border-amber-200 dark:border-amber-900/50' },
          { label: 'Maintenance',  value: counts.maintenance, color: 'text-slate-500 dark:text-zinc-400',      bg: 'bg-slate-200/50 dark:bg-zinc-800/50', border: 'border-slate-200 dark:border-zinc-700' },
        ].map(s => (
          <div key={s.label} className={`bg-white dark:bg-zinc-900 border ${s.border} rounded-2xl p-5 flex flex-col gap-1 hover:shadow-md transition-shadow`}>
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Occupancy Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Overall Occupancy</h3>
          <span className={`text-sm font-extrabold ${occupancyPct > 80 ? 'text-rose-600' : 'text-emerald-600'}`}>{occupancyPct}%</span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${occupancyPct > 80 ? 'bg-rose-500' : occupancyPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${occupancyPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-2">
          <span>{counts.occupied} occupied</span>
          <span>{counts.available} available</span>
        </div>
      </div>

      {/* Ward Filter + Grid */}
      <div className="flex items-center gap-2 flex-wrap">
        {wards.map(w => (
          <button key={w} onClick={() => setWardFilter(w)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${wardFilter === w ? 'bg-rose-600 text-white' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:border-rose-500'}`}>
            {w}
          </button>
        ))}
      </div>

      {/* Bed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filtered.map(bed => {
          const sc = STATUS_CFG[bed.status];
          return (
            <div key={bed.id} className={`bg-white dark:bg-zinc-900 border ${sc.border} rounded-2xl p-5 flex flex-col gap-4 hover:shadow-lg transition-all justify-between relative overflow-hidden group shadow-sm hover:-translate-y-0.5`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight">{bed.bedNo}</span>
                  <span className={`inline-flex items-center gap-1.5 text-[13px] font-bold px-3 py-1 rounded-full ${sc.color} ${sc.bg} border ${sc.border}`}>
                    <span className={`h-2 w-2 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-xl ${sc.bg} flex items-center justify-center ${sc.color} transition-transform group-hover:scale-110 duration-200 shrink-0`}>
                    {WARD_ICONS[bed.ward]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-extrabold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">{bed.ward} Ward</div>
                    {bed.patient ? (
                      <div className="text-[15px] font-bold text-slate-800 dark:text-zinc-150 mt-0.5 truncate max-w-[130px]">{bed.patient}</div>
                    ) : (
                      <div className="text-[15px] font-semibold text-slate-450 dark:text-zinc-650 mt-0.5 italic">Empty</div>
                    )}
                    {bed.admittedSince && <div className="text-[13px] font-medium text-slate-400 mt-0.5">Since {bed.admittedSince}</div>}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/60">
                {bed.status === 'occupied' ? (
                  <button onClick={() => handleRelease(bed.id)}
                    className="w-full text-[13px] font-bold py-2 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-rose-500/10 text-slate-600 dark:text-zinc-350 hover:text-rose-600 border border-slate-200 dark:border-zinc-700 hover:border-rose-500/30 transition-all cursor-pointer">
                    Release Bed
                  </button>
                ) : (bed.status === 'available' || bed.status === 'reserved') ? (
                  <button onClick={() => handleOpenAssignModal(bed)}
                    className="w-full text-[13px] font-bold py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 transition-all cursor-pointer shadow-sm hover:shadow-md">
                    Assign Bed
                  </button>
                ) : (
                  <div className="w-full text-[13px] font-bold py-2 rounded-md bg-slate-50 dark:bg-zinc-800/40 text-slate-450 dark:text-zinc-550 text-center border border-dashed border-slate-200 dark:border-zinc-750">
                    Maintenance
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Patient Bed Modal */}
      {selectedBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/10">
              <div className="flex items-center gap-2">
                <MdOutlineBedroomParent className="h-5 w-5 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Assign Bed {selectedBed.bedNo}</h3>
              </div>
              <button 
                onClick={() => setSelectedBed(null)} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 transition-colors cursor-pointer border-none"
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
              <div className="text-xs text-slate-500 dark:text-zinc-400">
                Allocate this bed in <span className="font-bold text-slate-700 dark:text-zinc-300">{selectedBed.ward} Ward</span> to a patient.
              </div>

              {/* Patient Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-650 dark:text-zinc-450">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={e => {
                    setSelectedPatientId(e.target.value);
                    if (e.target.value !== 'custom') {
                      const p = patientsList.find(x => x.id === e.target.value);
                      if (p) setPatientName(p.name);
                    } else {
                      setPatientName('');
                    }
                  }}
                  className="w-full border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 p-3 py-2 rounded-lg text-xs outline-none text-slate-800 dark:text-zinc-200 font-semibold focus:border-rose-500 focus:ring-1 focus:ring-rose-500 cursor-pointer"
                >
                  {patientsList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.phone || p.email})</option>
                  ))}
                  <option value="custom">+ Assign Custom Patient Name</option>
                </select>
              </div>

              {/* Custom Patient Input */}
              {selectedPatientId === 'custom' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-650 dark:text-zinc-450">Custom Patient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter patient's full name..."
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    className="w-full border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 p-3 py-2.5 rounded-lg text-xs outline-none text-slate-800 dark:text-zinc-200 font-semibold focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              )}

              {/* Admission Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-650 dark:text-zinc-450">Admission Date</label>
                <input
                  type="date"
                  required
                  value={admissionDate}
                  onChange={e => setAdmissionDate(e.target.value)}
                  className="w-full border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 p-3 py-2 rounded-lg text-xs outline-none text-slate-850 dark:text-zinc-200 font-semibold focus:border-rose-500 focus:ring-1 focus:ring-rose-500 cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setSelectedBed(null)}
                  className="text-xs font-bold px-5 py-2.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="text-xs font-bold px-5 py-2.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer shadow-md shadow-rose-500/20"
                >
                  Assign Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

