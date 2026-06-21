'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, HeartPulse, ArrowRight } from 'lucide-react';
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
    setTimeout(() => {
      toast.success(`Message sent to the ${department} department!`);
      setName(''); setEmail(''); setSubject(''); setMessage('');
      setDepartment('General Inquiry');
      setIsSubmitting(false);
    }, 1000);
  };

  const contactDetails = [
    {
      icon: <Phone className="h-5 w-5 text-rose-400" />,
      label: 'Phone Support',
      value: '+251 11 678-1234',
      sub: 'Open daily, 08:00 AM – 06:00 PM',
    },
    {
      icon: <Mail className="h-5 w-5 text-rose-400" />,
      label: 'Email Support',
      value: 'contact@medi-doc-hospital.org',
      sub: 'Response within 12–24 business hours',
    },
    {
      icon: <MapPin className="h-5 w-5 text-rose-400" />,
      label: 'Central Campus',
      value: 'Bole Sub-City, Addis Ababa',
      sub: 'Road 3, Ring Road Gate 4',
    },
  ];

  const inputClass =
    'w-full rounded-xl border border-zinc-800 bg-zinc-950 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200';

  return (
    <ScrollAnimate>
      <section className="w-full bg-zinc-950 text-white select-none pt-16 md:pt-20 overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* ── Left Column: Info Panel ── */}
            <div className="lg:col-span-5 relative flex flex-col gap-8">
              {/* Decorative blobs */}
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-rose-500/8 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest">
                  <HeartPulse className="h-3.5 w-3.5" />
                  <span>Contact Our Team</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white font-outfit tracking-tight leading-tight">
                  Reach out to our care coordinators
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium max-w-sm">
                  Have questions about booking appointments, services, or records? We are here to help you get the expert care you need.
                </p>
              </div>

              {/* Contact Info Cards */}
              <div className="relative z-10 space-y-3">
                {contactDetails.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-all duration-200 group"
                  >
                    <div className="mt-0.5 p-2.5 rounded-lg bg-rose-500/15 shrink-0 group-hover:bg-rose-500/25 transition-colors duration-200">
                      {item.icon}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest block">
                        {item.label}
                      </span>
                      <div className="text-sm font-bold text-white truncate">{item.value}</div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours tag */}
              <div className="relative z-10 flex items-center gap-2 text-zinc-500 text-[11px] font-semibold pt-2">
                <Clock className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span>24/7 Emergency line available. Regular hours 08:00–18:00</span>
              </div>
            </div>

            {/* ── Right Column: Form + Image ── */}
            <div className="lg:col-span-7 flex flex-col lg:flex-row gap-6 items-stretch">

              {/* Form */}
              <div className="flex-1 space-y-6">
                {/* Form header */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs uppercase tracking-widest">
                    <span className="text-sm font-black">+</span>
                    <span>Send Secure Inquiry</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white font-outfit tracking-tight">
                    We'll respond within 24 hours
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Abebe Kebede"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. abebe@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Department <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className={inputClass}
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Emergency Desk">Emergency & Critical Care</option>
                        <option value="Billing & Admissions">Billing & Admissions</option>
                        <option value="Laboratory Services">Laboratory & Diagnostics</option>
                        <option value="Pharmacy Desk">Pharmacy Services</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Subject <span className="text-zinc-600 font-normal normal-case tracking-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Appointment rescheduling"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please describe your query in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center gap-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-sm px-7 py-3.5 shadow-md hover:shadow-rose-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="h-4 w-4 group-hover:-rotate-12 transition-transform duration-200" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && (
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    )}
                  </button>
                </form>
              </div>

              {/* Side Image */}
              <div className="hidden lg:block w-48 xl:w-56 shrink-0 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400"
                  alt="Healthcare coordination"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>
        </div>
      </section>
    </ScrollAnimate>
  );
}
