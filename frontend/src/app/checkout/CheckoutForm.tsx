"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { db, Doctor } from "../../lib/mockDb";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  DollarSign,
  Calendar,
  Clock,
  HeartPulse,
  AlertCircle,
} from "lucide-react";

export default function CheckoutForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams ? searchParams.get("doctorId") || "" : "";
  const date = searchParams ? searchParams.get("date") || "" : "";
  const time = searchParams ? searchParams.get("time") || "" : "";
  const symptoms = searchParams ? searchParams.get("symptoms") || "" : "";
  const canceled = searchParams
    ? searchParams.get("canceled") === "true"
    : false;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (doctorId) {
      const doc = db.getDoctors().find((d) => d.id === doctorId);
      if (doc) setDoctor(doc);
    }
  }, [doctorId]);

  useEffect(() => {
    if (canceled) {
      setErrorMsg(
        "Payment was canceled -- feel free to continue to book when you are ready.",
      );
    }
  }, [canceled]);

  if (!user || user.role !== "patient") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-5">
        <Lock className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
          Access Restricted
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Patient credentials are required to complete checkout.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-rose-600 hover:bg-rose-750 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          Login
        </button>
      </div>
    );
  }

  if (!doctorId || !doctor || !date || !time) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-5">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
          Missing Parameters
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Return to doctor search directory and select a consultation slot.
        </p>
        <button
          onClick={() => router.push("/find-doctors")}
          className="bg-rose-600 hover:bg-rose-755 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          Find Doctors
        </button>
      </div>
    );
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          doctorName: doctor.doctorName,
          patientId: user.id,
          patientName: user.name,
          date,
          time,
          symptoms,
          amount: doctor.consultationFee,
        }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        // Redirect the user to Stripe Checkout page
        window.location.href = data.url;
      } else {
        setErrorMsg(data.error || "Failed to initialize payment session.");
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left — Stripe secure redirect widget */}
        <form
          onSubmit={handlePaymentSubmit}
          className="md:col-span-7 border border-slate-100 dark:border-zinc-800 bg-card rounded-[10px] shadow-sm p-6 sm:p-8 space-y-6"
        >
          <div className="border-b border-slate-100 dark:border-zinc-800 pb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-550 uppercase tracking-widest font-extrabold mb-1">
                secure checkout
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-rose-500" /> Stripe Secure
                Checkout
              </h2>
            </div>
            <span className="flex items-center gap-1 border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-650 dark:text-emerald-400 font-extrabold rounded-lg">
              <Lock className="h-3 w-3" /> SECURE GATEWAY
            </span>
          </div>

          {errorMsg && (
            <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 rounded-lg flex items-center gap-2 text-xs font-bold text-red-500">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4 text-slate-600 dark:text-zinc-300">
            <p className="text-xs leading-relaxed font-semibold">
              You are booking a medical consultation with{" "}
              <strong className="text-slate-900 dark:text-zinc-100">
                {doctor.doctorName}
              </strong>
              . The consultation fee is{" "}
              <strong className="text-rose-600 dark:text-rose-500 ">
                ৳{doctor.consultationFee}.00
              </strong>
              .
            </p>
            <p className="text-xs leading-relaxed font-semibold">
              By clicking the button below, you will be redirected securely to
              the Stripe hosted checkout page to complete your payment. Once
              paid, your booking slot will be confirmed immediately.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-[8px] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-rose-600/10 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />{" "}
                Initializing Stripe Secure Payment…
              </>
            ) : (
              <>Pay with Stripe (৳{doctor.consultationFee})</>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 pt-2">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
              Stripe Securely Processes All Payments
            </span>
          </div>
        </form>

        {/* Right — Booking summary */}
        <div className="md:col-span-5 border border-slate-100 dark:border-zinc-800 bg-card rounded-[10px] shadow-sm p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="text-[10px] text-slate-400 dark:text-zinc-550 uppercase tracking-widest font-extrabold mb-1">
              booking summary
            </div>
            <div className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-rose-500" />
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                Consultation Details
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/20 rounded-xl">
            <img
              src={doctor.profileImage}
              alt={doctor.doctorName}
              className="h-12 w-12 object-cover border border-slate-200 dark:border-zinc-800 rounded-xl flex-shrink-0"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-extrabold text-slate-900 dark:text-zinc-100">
                {doctor.doctorName}
              </div>
              <div className="text-[10px] font-bold text-rose-600 dark:text-rose-500  uppercase tracking-wider">
                {doctor.specialization}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">
                {doctor.hospitalName}
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              {
                icon: <Calendar className="h-3.5 w-3.5 text-rose-500" />,
                label: "Date",
                value: date,
              },
              {
                icon: <Clock className="h-3.5 w-3.5 text-rose-500" />,
                label: "Time Slot",
                value: time,
              },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between border border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/10 px-4 py-3 rounded-xl"
              >
                <div className="flex items-center gap-1.5">
                  {f.icon}
                  <span className="text-[10px] uppercase text-slate-450 dark:text-zinc-500 font-extrabold tracking-wider">
                    {f.label}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">
                  {f.value}
                </span>
              </div>
            ))}
          </div>

          <div className="border border-slate-100 dark:border-zinc-800/80 bg-slate-50/30 dark:bg-zinc-900/10 p-4 rounded-xl">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-405 dark:text-zinc-555 mb-1.5">
              Symptoms Description
            </div>
            <p className="text-xs text-slate-655 dark:text-zinc-400 italic leading-relaxed">
              &ldquo;{symptoms || "Routine consultation."}&rdquo;
            </p>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800 pt-4 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-450 dark:text-zinc-500">
              Total Fee
            </span>
            <div className="flex items-center gap-0.5 text-lg font-extrabold text-rose-600 dark:text-rose-500 ">
              <i className="fa-solid fa-bangladeshi-taka-sign text-[13px] mr-1"></i>
              {doctor.consultationFee}.00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
