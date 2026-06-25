'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import TopBar from './TopBar';

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  useEffect(() => {
    if (!pathname) return;

    let title = 'Medi-Doc | Doctor Appointments & Prescriptions';

    if (pathname === '/') {
      title = 'Medi-Doc | Home';
    } else if (pathname.startsWith('/dashboard')) {
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length === 1) {
        title = 'Medi-Doc | Dashboard';
      } else {
        const portal = segments[1];
        const subpage = segments.slice(2).join(' - ');
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
      {!isDashboard && <TopBar />}
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}

      {/* ── Global floating UI ── */}
      <ScrollToTop />
    </>
  );
}

