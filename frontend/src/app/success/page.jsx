'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { db } from '../../lib/mockDb'
import { CheckCircle, Calendar, Clock, DollarSign, CreditCard, ArrowRight, Home, HeartPulse, User } from 'lucide-react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const session_id = searchParams ? searchParams.get('session_id') : ''

  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [details, setDetails] = useState(null)

  useEffect(() => {
    if (!session_id) {
      setErrorMsg('No session ID found. Please make sure you are redirected here from a valid checkout.')
      setLoading(false)
      return
    }

    const verifyAndRecord = async () => {
      try {
        // 1. Retrieve the session from Next.js API
        const res = await fetch(`/api/retrieve_session?session_id=${session_id}`)
        if (!res.ok) {
          throw new Error('Failed to retrieve checkout details.')
        }
        const session = await res.json()

        if (session.status !== 'complete' && session.payment_status !== 'paid') {
          throw new Error('Payment was not completed successfully.')
        }

        // 2. Parse metadata from the Stripe Session
        const {
          doctorId,
          doctorName,
          patientId,
          patientName,
          date,
          time,
          symptoms,
          amount
        } = session.metadata || {}

        if (!doctorId || !patientId || !date || !time) {
          throw new Error('Stripe session metadata is incomplete.')
        }

        const amountNum = Number(amount || 0)
        const paymentDetails = {
          doctorName,
          patientName,
          date,
          time,
          symptoms: symptoms || 'Routine consultation',
          amount: amountNum,
          transactionId: session.id,
          customerEmail: session.customer_details?.email
        }
        setDetails(paymentDetails)

        // 3. Prevent duplicate insertion using localStorage cache
        const processedSessions = JSON.parse(localStorage.getItem('mc_processed_sessions') || '[]')
        if (!processedSessions.includes(session_id)) {
          // Generate IDs
          const appointmentId = `apt-${Date.now()}`
          const paymentId = `pay-${Date.now()}`

          const newApt = {
            id: appointmentId,
            patientId,
            doctorId,
            appointmentDate: date,
            appointmentTime: time,
            appointmentStatus: 'confirmed',
            symptoms: symptoms || 'Routine consultation',
            paymentStatus: 'paid',
            paymentId
          }

          const newPayment = {
            id: paymentId,
            appointmentId,
            patientId,
            patientName,
            doctorId,
            doctorName,
            amount: amountNum,
            transactionId: session.id,
            paymentDate: new Date().toISOString()
          }

          // Update localStorage mockDb
          const appointments = db.getAppointments()
          const duplicate = appointments.some(
            a => a.patientId === patientId && 
                 a.doctorId === doctorId && 
                 a.appointmentDate === date && 
                 a.appointmentTime === time
          )

          if (!duplicate) {
            db.setAppointments([...appointments, newApt])
            
            const payments = db.getPayments()
            db.setPayments([...payments, newPayment])
          }

          // Update backend MongoDB collections (Express server)
          try {
            const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://backend-nu-rosy-20.vercel.app'
            await fetch(`${backendUrl}/api/payment-confirm`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ appointment: newApt, payment: newPayment })
            })
          } catch (backendErr) {
            console.error('Failed to sync appointment with MongoDB backend:', backendErr)
          }

          // Mark session as processed in cache
          processedSessions.push(session_id)
          localStorage.setItem('mc_processed_sessions', JSON.stringify(processedSessions))
        }

        // Trigger confetti explosion!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        })

        setLoading(false)
      } catch (err) {
        setErrorMsg(err.message || 'An error occurred during verification.')
        setLoading(false)
      }
    }

    verifyAndRecord()
  }, [session_id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="h-10 w-10 border-4 border-rose-500 border-t-transparent animate-spin rounded-full" />
        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Verifying secure payment transaction...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center space-y-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm my-12">
        <div className="h-14 w-14 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-zinc-50 uppercase tracking-wider">Verification Failed</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-semibold">{errorMsg}</p>
        <button onClick={() => router.push('/find-doctors')} className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">Find Doctors</button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[20px] shadow-lg p-6 sm:p-10 space-y-8 relative overflow-hidden"
      >
        {/* Subtle decorative glowing background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Status Block */}
        <div className="text-center space-y-3 relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle className="h-10 w-10" />
          </motion.div>
          
          <div className="text-[10px] text-emerald-650 dark:text-emerald-450 uppercase tracking-widest font-extrabold">booking confirmed</div>
          <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-zinc-50 font-outfit tracking-tight">Payment Successful!</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold leading-relaxed max-w-md mx-auto">
            Your appointment has been successfully scheduled and payment verified. A confirmation receipt has been sent to <strong className="text-slate-700 dark:text-zinc-200">{details?.customerEmail || 'your email'}</strong>.
          </p>
        </div>

        {/* Detail Grid */}
        <div className="border border-slate-100 dark:border-zinc-800/80 bg-slate-50/30 dark:bg-zinc-950/20 rounded-[14px] p-6 space-y-6 relative z-10">
          <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-250 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-zinc-800 pb-3">
            <HeartPulse className="h-4 w-4 text-rose-500" /> Appointment Summary
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-655 dark:text-zinc-400">
            {/* Column 1: Doctor & Patient */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-extrabold block">Specialist</span>
                <span className="font-extrabold text-slate-800 dark:text-zinc-200 text-sm flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-rose-500" /> {details?.doctorName}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-extrabold block">Patient Name</span>
                <span className="font-bold text-slate-700 dark:text-zinc-300">{details?.patientName}</span>
              </div>
            </div>

            {/* Column 2: Date & Time */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-extrabold block">Date & Time</span>
                <span className="font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-rose-500" /> {details?.date} at <Clock className="h-3.5 w-3.5 text-rose-500" /> {details?.time}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-extrabold block">Symptoms</span>
                <span className="font-medium text-slate-655 dark:text-zinc-450 italic">
                  &ldquo;{details?.symptoms}&rdquo;
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-extrabold block">Transaction ID</span>
              <span className="font-mono text-[11px] text-slate-500 dark:text-zinc-400 font-semibold">{details?.transactionId}</span>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-3 border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5 rounded-xl">
              <span className="text-[10px] font-extrabold text-emerald-750 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" /> Amount Paid:
              </span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <i className="fa-solid fa-bangladeshi-taka-sign text-[13px] mr-0.5"></i>{details?.amount}.00
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 relative z-10">
          <Link href="/dashboard/patient/appointments" className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl transition-all cursor-pointer shadow-md shadow-rose-600/10">
            View My Appointments <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/" className="flex items-center justify-center gap-2 border border-slate-200 dark:border-zinc-800 bg-slate-50/50 hover:bg-slate-100/50 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/40 text-slate-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl transition-all cursor-pointer">
            <Home className="h-4 w-4" /> Go to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function Success() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="h-10 w-10 border-4 border-rose-500 border-t-transparent animate-spin rounded-full" />
        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Loading checkout verification...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}