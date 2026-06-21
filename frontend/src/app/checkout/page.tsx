'use client';

import React, { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading payment portal...</p>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
