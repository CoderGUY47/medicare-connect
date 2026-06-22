import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'

export async function POST(req) {
  try {
    const body = await req.json()
    const { doctorId, doctorName, patientId, patientName, date, time, symptoms, amount } = body

    const headersList = await headers()
    const origin = headersList.get('origin') || 'http://localhost:3000'

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Medical Consultation with ${doctorName || 'Doctor'}`,
              description: `Appointment on ${date} at ${time}`,
            },
            unit_amount: Math.round(amount * 100), // in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        doctorId,
        doctorName,
        patientId,
        patientName,
        date,
        time,
        symptoms,
        amount: String(amount),
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?doctorId=${doctorId}&date=${date}&time=${time}&symptoms=${encodeURIComponent(symptoms)}&canceled=true`,
    });

    return NextResponse.json({ url: session.url })
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}