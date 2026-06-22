'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  useEffect(() => {
    if (!pathname) return;

    let title = 'Medi-Doc | Doctor Appointments & Prescriptions';

    if (pathname === '/') {
      title = 'Medi-Doc | Home';
    } else if (pathname.startsWith('/dashboard')) {
      const segments = pathname.split('/').filter(Boolean); // ["dashboard", "patient", "appointments"]
      if (segments.length === 1) {
        title = 'Medi-Doc | Dashboard';
      } else {
        const portal = segments[1]; // e.g. patient, doctor, admin, nurse, lab, pharmacist
        const subpage = segments.slice(2).join(' - '); // e.g. appointments, bed-management
        const cleanPortal = portal.charAt(0).toUpperCase() + portal.slice(1);
        const cleanSubpage = subpage 
          ? ' - ' + subpage.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          : '';
        title = `Medi-Doc | ${cleanPortal} Portal${cleanSubpage}`;
      }
    } else {
      const routeName = pathname.split('/').filter(Boolean).pop() || '';
      if (routeName) {
        const cleanName = routeName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        title = `Medi-Doc | ${cleanName}`;
      }
    }

    document.title = title;
  }, [pathname]);

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}
