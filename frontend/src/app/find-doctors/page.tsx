'use client';

import React, { Suspense } from 'react';
import FindDoctorsPage from '../Pages/FindDoctorsPage';

export default function RootFindDoctorsPage() {
  return (
    <Suspense fallback={
      <div className="container px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-sm text-muted-foreground">Loading doctor directories...</p>
      </div>
    }>
      <FindDoctorsPage />
    </Suspense>
  );
}
