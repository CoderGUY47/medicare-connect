'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, HeartPulse, Clock } from 'lucide-react';
import ScrollAnimate from './ScrollAnimate';
import { toast } from 'react-toastify';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('General Inquiry');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Message sent successfully to the ${department} department!`);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setDepartment('General Inquiry');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <ScrollAnimate>
      <section className="w-full bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-white select-none border-b border-slate-200/60 dark:border-zinc-900 rounded-none py-16 md:py-24 transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-7xl rounded-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Heading & Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-500 font-bold text-xs uppercase tracking-wider">
                  <span className="text-sm font-black">+</span>
                  <span>Contact Our Team</span>
                </div>
                <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">
                  Reach out to our care coordinators
                </h2>
                <div className="text-base text-slate-650 dark:text-zinc-400 leading-relaxed font-semibold max-w-xl">
                  Have questions about booking appointments, services, or records? We are here to help you get the expert care you need.
                </div>
              </div>

              {/* Information Cards List */}
              <div className="space-y-4 pt-2">
                <div className="flex gap-4 p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-[10px] shadow-xs">
                  <div className="p-3 h-fit rounded-lg bg-rose-50 dark:bg-zinc-850/50 shadow-sm shrink-0">
                    <Phone className="h-5 w-5 text-rose-600 dark:text-rose-500" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Phone Support</span>
                    <div className="text-base font-bold text-slate-900 dark:text-white tracking-tight">+251 11 678-1234</div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Registry desk open daily, 08:00 AM – 06:00 PM</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-[10px] shadow-xs">
                  <div className="p-3 h-fit rounded-lg bg-rose-50 dark:bg-zinc-850/50 shadow-sm shrink-0">
                    <Mail className="h-5 w-5 text-rose-600 dark:text-rose-500" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Email Support</span>
                    <div className="text-base font-bold text-slate-900 dark:text-white tracking-tight">contact@medi-doc-hospital.org</div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Response within 12 to 24 business hours</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-[10px] shadow-xs">
                  <div className="p-3 h-fit rounded-lg bg-rose-50 dark:bg-zinc-850/50 shadow-sm shrink-0">
                    <MapPin className="h-5 w-5 text-rose-600 dark:text-rose-500" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Central Campus</span>
                    <div className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Bole Sub-City, Addis Ababa</div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Road 3, Ring Road Gate 4, Addis Ababa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Message Form */}
            <div className="lg:col-span-7 w-full rounded-[10px] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 dark:border-zinc-800/80 px-6 py-4 flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-rose-600 dark:text-rose-500" />
                <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">Send Secure Inquiry</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Your Full Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abebe Kebede"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-650 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Email Address <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. abebe@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-650 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Target Department <span className="text-rose-500">*</span></label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Emergency Desk">Emergency & Critical Care</option>
                      <option value="Billing & Admissions">Billing & Admissions</option>
                      <option value="Laboratory Services">Laboratory & Diagnostic Wing</option>
                      <option value="Pharmacy Desk">Pharmacy Services</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Subject (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Appointment rescheduling help"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-650 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Message / Inquiry Details <span className="text-rose-500">*</span></label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please describe your query in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 p-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-650 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-6 py-3 shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Sending Message...' : 'Send secure message'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </ScrollAnimate>
  );
}
