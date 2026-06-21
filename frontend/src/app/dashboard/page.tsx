'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

export default function DashboardRedirectPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        const role = (session.user as any).role || 'patient';
        router.replace(`/dashboard/${role}`);
      } else {
        router.replace('/login');
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 dark:bg-zinc-950/40">
      <div className="flex flex-col items-center gap-3">
        <div className="h-1.5 w-48 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-[#4A2E80] rounded-full animate-pulse" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
          Redirecting to dashboard…
        </span>
      </div>
    </div>
  );
}
