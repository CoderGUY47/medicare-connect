'use client';

import React, { Suspense } from 'react';
import LoginForm from '@/app/login/LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
        <p className="mt-4 text-sm text-muted-foreground">Loading login portal...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
