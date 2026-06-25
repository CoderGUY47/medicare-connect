"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  ShieldAlert,
  HeartPulse,
  Clock,
} from "lucide-react";
import ScrollAnimate from "../../components/ScrollAnimate";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("General Inquiry");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(
        `Message sent successfully to the ${department} department!`,
      );
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setDepartment("General Inquiry");
      setIsSubmitting(false);
    }, 1000);
  };

  const contactCards = [
    {
      icon: <ShieldAlert className="h-6 w-6 text-rose-500 animate-pulse" />,
      label: "Emergency Hotline",
      sub: "Available 24/7/365 for urgent cases",
      value: "907 (Direct Toll-Free)",
      desc: "Or dial +251 11 899-0000 for local emergency dispatch.",
      bg: "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 dark:border-rose-500/30",
    },
    {
      icon: <Phone className="h-6 w-6 text-rose-500" />,
      label: "General Registry",
      sub: "Mon–Fri, 08:00 AM – 06:00 PM",
      value: "+251 11 678-1234",
      desc: "Main hospital reception, patient inquiries, and appointments desk.",
      bg: "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 dark:border-rose-500/30",
    },
    {
      icon: <Mail className="h-6 w-6 text-rose-550" />,
      label: "Email Support",
      sub: "Response within 12-24 hours",
      value: "contact@medi-doc-hospital.org",
      desc: "Reach out to administrative desks, billing inquiries, or lab support.",
      bg: "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 dark:border-rose-500/30",
    },
  ];

  return (
    <div className="container px-4 py-12 sm:px-6 lg:px-8 space-y-12 pb-24">
      {/* Page Header */}
      <ScrollAnimate>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-500 ">
            <HeartPulse className="h-3.5 w-3.5" /> Medi-Doc Support Center
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact Our Care Teams
          </h1>
          <p className="text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
            Have questions about booking appointments, hospital admission,
            diagnostic services, or medical records? We are here to help. Reach
            out using any of the channels below or send a secure direct inquiry
            message.
          </p>
        </div>
      </ScrollAnimate>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Contact Cards & Campus Location */}
        <ScrollAnimate className="lg:col-span-5">
          <div className="space-y-6">
            <div className="space-y-4">
              {contactCards.map((c) => (
                <div
                  key={c.label}
                  className={`p-5 rounded-[10px] border flex gap-4 ${c.bg}`}
                >
                  <div className="p-3 h-fit rounded-lg bg-white dark:bg-zinc-900 shadow-sm shrink-0">
                    {c.icon}
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                      {c.label}
                    </span>
                    <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {c.value}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      {c.sub}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-medium pt-1">
                      {c.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Campus Location Card */}
            <div className="p-6 rounded-[10px] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800">
                  <MapPin className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Central Campus Address
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                Medi-Doc Tertiary Care Hospital, Bole Sub-City, Road 3, Ring
                Road Gate 4, Addis Ababa.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 border-t border-slate-100 dark:border-zinc-800/80 pt-3">
                <Clock className="h-4 w-4" />
                <span>
                  Outpatient Visiting Hours: 08:00 AM – 08:00 PM Daily
                </span>
              </div>
            </div>
          </div>
        </ScrollAnimate>

        {/* Right Side: Message Form */}
        <ScrollAnimate className="lg:col-span-7">
          <div className="w-full rounded-[10px] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 dark:border-zinc-800/80 px-6 py-4 flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-rose-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Send Secure Inquiry
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abebe Kebede"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-800 bg-background focus:border-rose-500 focus:ring-rose-500/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. abebe@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-800 bg-background focus:border-rose-500 focus:ring-rose-500/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                    Target Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-800 bg-background focus:border-rose-500 focus:ring-rose-500/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-colors cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Emergency Desk">
                      Emergency & Critical Care
                    </option>
                    <option value="Billing & Admissions">
                      Billing & Admissions
                    </option>
                    <option value="Laboratory Services">
                      Laboratory & Diagnostic Wing
                    </option>
                    <option value="Pharmacy Desk">Pharmacy Services</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Appointment rescheduling help"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-800 bg-background focus:border-rose-500 focus:ring-rose-500/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                  Message / Inquiry Details{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Please describe your query in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-[8px] border border-slate-200 dark:border-zinc-800 bg-background focus:border-rose-500 focus:ring-rose-500/10 p-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm px-6 py-3 shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Sending Message..." : "Send secure message"}
              </button>
            </form>
          </div>
        </ScrollAnimate>
      </div>
    </div>
  );
}
