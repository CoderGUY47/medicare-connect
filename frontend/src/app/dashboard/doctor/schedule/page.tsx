'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { db, Doctor } from '../../../../lib/mockDb';
import { Calendar, Clock, Plus, Trash2, CheckCircle, AlertCircle, Save, Settings, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

export default function DoctorSchedulePage() {
  const { user } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState('');
  const [slots, setSlots] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const docData = db.getDoctors().find(d => d.id === user.id);
    if (docData) { 
      setDoctorProfile(docData); 
      setSelectedDays(docData.availableDays); 
      setSlots(docData.availableSlots); 
    }
  }, [user]);

  const handleDayToggle = (day: string) => {
    let updated = selectedDays.includes(day) ? selectedDays.filter(d => d !== day) : [...selectedDays, day];
    updated.sort((a, b) => weekdays.indexOf(a) - weekdays.indexOf(b));
    setSelectedDays(updated);
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.trim()) return;
    const timeMatch = newSlot.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])\s*(AM|PM)?$/i);
    if (!timeMatch) { 
      toast.error('Use correct format: 09:00 AM or 14:30'); 
      return; 
    }
    const formattedSlot = newSlot.toUpperCase();
    if (slots.includes(formattedSlot)) { 
      toast.warning('This time slot already exists.'); 
      return; 
    }
    const updatedSlots = [...slots, formattedSlot].sort((a, b) => {
      const getMin = (t: string) => { 
        const [time, mod] = t.split(' '); 
        let [h, m] = time.split(':').map(Number); 
        if (h === 12) h = 0; 
        if (mod === 'PM') h += 12; 
        return h * 60 + m; 
      };
      return getMin(a) - getMin(b);
    });
    setSlots(updatedSlots); 
    setNewSlot('');
    toast.success(`Slot ${formattedSlot} added (unsaved).`);
  };

  const handleSaveSchedule = () => {
    if (!user || !doctorProfile) return;
    if (selectedDays.length === 0) { 
      toast.error('Select at least one available day.'); 
      return; 
    }
    if (slots.length === 0) { 
      toast.error('Add at least one time slot.'); 
      return; 
    }
    db.setDoctors(db.getDoctors().map(d => d.id === user.id ? { ...d, availableDays: selectedDays, availableSlots: slots } : d));
    toast.success('Your weekly schedule has been updated successfully!');
  };

  return (
    <div className="space-y-7">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
            <span>Doctor</span><Calendar className="h-3 w-3" /><span className="text-emerald-500">Schedule</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            Manage Schedule
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">Configure your weekly consulting days and active appointment slots.</p>
        </div>
        <button 
          onClick={handleSaveSchedule} 
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-md transition-all shadow-md shadow-emerald-550/20 shrink-0 cursor-pointer"
        >
          <Save className="h-4 w-4" /> Save Schedule
        </button>
      </div>

      {/* Two-column layout grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Days Column */}
        <div className="md:col-span-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">1 / Available Days</h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedDays.length} of 7 Selected</span>
          </div>
          <div className="p-5 space-y-2">
            {weekdays.map((day) => {
              const checked = selectedDays.includes(day);
              return (
                <button 
                  key={day} 
                  type="button" 
                  onClick={() => handleDayToggle(day)}
                  className={`w-full flex items-center justify-between px-4 py-3 border font-bold text-xs rounded-xl transition-all cursor-pointer ${
                    checked 
                      ? 'border-emerald-550/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                      : 'border-slate-150 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <span>{day}</span>
                  <div className={`h-5 w-5 border rounded-lg flex items-center justify-center transition-all ${
                    checked ? 'bg-emerald-550 border-emerald-550' : 'border-slate-300 dark:border-zinc-650'
                  }`}>
                    {checked && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slots Column */}
        <div className="md:col-span-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-500" />
                <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100">2 / Time Slots</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{slots.length} Active Slots</span>
            </div>
            
            <div className="p-5 space-y-5">
              {/* Add slot form */}
              <form onSubmit={handleAddSlot} className="flex gap-2">
                <div className="flex-1 flex items-center border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800 px-3 py-2 rounded-xl focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all">
                  <Clock className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="e.g. 09:30 AM or 14:00" 
                    value={newSlot} 
                    onChange={e => setNewSlot(e.target.value)}
                    className="w-full bg-transparent outline-none text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 border-none font-semibold" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 text-xs rounded-md transition-all shadow-sm shadow-emerald-500/10 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </form>

              {/* Slots grid */}
              {slots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {slots.map((slot) => (
                    <div 
                      key={slot} 
                      className="group flex items-center justify-between border border-slate-150 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 px-3.5 py-2.5 rounded-xl hover:border-red-500/20 transition-all"
                    >
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">{slot}</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          setSlots(slots.filter(s => s !== slot));
                          toast.info(`Slot ${slot} removed (unsaved).`);
                        }}
                        className="text-slate-400 hover:text-red-500 hover:scale-110 transition-all ml-2 cursor-pointer p-0.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 dark:border-zinc-800 py-16 text-center rounded-xl">
                  <Clock className="h-8 w-8 text-slate-300 dark:text-zinc-600 mx-auto mb-2.5" />
                  <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">No time slots configured</p>
                  <p className="text-[10px] text-slate-450 mt-1 max-w-xs mx-auto">Please add active consultation hours using the time input above.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/10 text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Note: Don&apos;t forget to click <strong>Save Schedule</strong> to apply changes.</span>
          </div>
        </div>

      </div>
    </div>
  );
}

