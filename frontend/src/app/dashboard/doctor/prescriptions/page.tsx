'use client';

import React, { Suspense } from 'react';
import PrescriptionEditor from '@/app/dashboard/doctor/prescriptions/PrescriptionEditor';

export default function DoctorPrescriptionPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading prescription editor...</p>
      </div>
    }>
      <PrescriptionEditor />
    </Suspense>
  );
}
