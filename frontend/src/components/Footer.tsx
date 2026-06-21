import React from 'react';
import Link from 'next/link';

const FacebookIcon = () => (
  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967-.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TwitterXIcon = () => (
  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const PinterestIcon = () => (
  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.62 11.17-.1-.95-.2-2.41.04-3.45.22-.94 1.4-5.97 1.4-5.97s-.36-.72-.36-1.78c0-1.67.97-2.92 2.18-2.92 1.03 0 1.53.77 1.53 1.69 0 1.03-.66 2.58-.99 4.02-.28 1.2.6 2.17 1.78 2.17 2.14 0 3.78-2.26 3.78-5.51 0-2.88-2.07-4.9-5.03-4.9-3.43 0-5.44 2.57-5.44 5.22 0 1.03.4 2.15.9 2.75.1.12.11.23.08.35l-.33 1.34c-.05.22-.17.26-.39.16-1.46-.68-2.38-2.81-2.38-4.53 0-3.69 2.68-7.07 7.72-7.07 4.06 0 7.21 2.89 7.21 6.75 0 4.03-2.54 7.27-6.06 7.27-1.18 0-2.3-.61-2.68-1.34l-.73 2.78c-.26 1.01-.98 2.28-1.46 3.07C9.37 23.8 10.66 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
  </svg>
);

export default function Footer() {
  const columns = [
    {
      title: 'About Medi-Doc Health',
      links: [
        { label: 'Careers', href: '/about' },
        { label: 'Company Information', href: '/about' },
        { label: 'Newsroom', href: '/about' },
        { label: 'Foundation', href: '/about' },
        { label: 'View More...', href: '/about' },
      ],
    },
    {
      title: 'For Team Members',
      links: [
        { label: 'Benefits Enrollment', href: '#' },
        { label: 'New Hire Onboarding', href: '#' },
        { label: 'Remote Access', href: '#' },
        { label: 'Well-Being Hub', href: '#' },
        { label: 'View More...', href: '#' },
      ],
    },
    {
      title: 'For Providers',
      links: [
        { label: 'Make a Referral', href: '#' },
        { label: 'Physician Network', href: '#' },
        { label: 'Residency Programs', href: '#' },
        { label: 'Credentialing', href: '#' },
        { label: 'View More...', href: '#' },
      ],
    },
    {
      title: 'Care Hub',
      links: [
        { label: 'Find a Doctor', href: '/find-doctors' },
        { label: 'Physician Matcher', href: '/find-doctors' },
        { label: 'Symptom Checker', href: '#' },
        { label: 'Virtual Care', href: '/find-doctors?type=virtual' },
        { label: 'View More...', href: '/find-doctors' },
      ],
    },
    {
      title: 'Get Connected',
      links: [
        { label: 'Contact Center', href: '/contact' },
        { label: 'Volunteer', href: '#' },
        { label: 'Be An Advisor', href: '#' },
        { label: 'Newsletter', href: '#' },
        { label: 'View More...', href: '/contact' },
      ],
    },
  ];

  return (
    <footer className="bg-zinc-950 dark:bg-zinc-950 text-white transition-colors duration-300 w-full border-t border-zinc-900 dark:border-zinc-900">
      {/* Upper Grid Layout (Stretched full width with side padding) */}
      <div className="w-full px-6 md:px-12 lg:px-16 pt-16 pb-12 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h3 className="text-[13px] font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
                {col.title}
              </h3>
              <ul className="space-y-2 text-xs font-semibold">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-rose-500 transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Emergency Hotline Column */}
          <div className="space-y-4 col-span-1 sm:col-span-2 md:col-span-1">
            <h3 className="text-[13px] font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
              Contact & Support
            </h3>
            <div className="space-y-3 text-xs font-semibold text-zinc-400">
              <div>
                <span className="block text-white font-bold mb-0.5">Main Campus Address:</span>
                <p className="leading-relaxed text-zinc-400">
                  100 Medical Plaza, Suite 500,<br />Boston, MA 02111
                </p>
              </div>
              <div>
                <span className="block text-white font-bold mb-0.5">General Inquiries:</span>
                <a href="tel:+15550123456" className="hover:text-rose-500 text-zinc-450 transition-colors block">+1 (555) 012-3456</a>
              </div>
              <div>
                <span className="block text-white font-bold mb-0.5">Email Support:</span>
                <a href="mailto:info@medi-doc.com" className="hover:text-rose-500 text-zinc-455 transition-colors block">info@medi-doc.com</a>
              </div>
              
              {/* Emergency Hotline Card */}
              <div className="pt-2">
                <div className="bg-red-500/10 border border-red-500/35 rounded-md p-3 text-center shadow-inner">
                  <span className="block text-[10px] text-red-300 font-bold uppercase tracking-wider mb-0.5">Emergency Hotline</span>
                  <a href="tel:911" className="text-xs font-extrabold text-red-400 hover:text-red-300 transition-colors block tracking-wide">
                    911 (Or call +1 555-019-9111)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand & Social Media Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
          {/* Logo with Stylized N ||| */}
          <div className="flex items-center gap-2.5">
            <svg className="h-7 w-auto text-white shrink-0" viewBox="0 0 42 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 28V4h6.5l10 15.5V4h5v24h-6.2L9.3 12.5V28H4z" fill="currentColor" />
              <rect x="27.5" y="4" width="3.2" height="24" rx="0.5" fill="currentColor" />
              <rect x="33" y="10" width="3.2" height="18" rx="0.5" fill="currentColor" className="opacity-80" />
              <rect x="38.5" y="16" width="3.2" height="12" rx="0.5" fill="currentColor" className="opacity-60" />
            </svg>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight font-outfit text-[15px] leading-none text-white">MEDI-DOC</span>
              <span className="text-[8px] font-extrabold tracking-[0.25em] text-rose-500 uppercase leading-none mt-0.5">HEALTH</span>
            </div>
          </div>

          {/* Social Icons inside purple outline circle badges */}
          <div className="flex items-center gap-3">
            {[
              { icon: <FacebookIcon />, href: '#' },
              { icon: <TwitterXIcon />, href: '#' },
              { icon: <YoutubeIcon />, href: '#' },
              { icon: <PinterestIcon />, href: '#' },
              { icon: <LinkedinIcon />, href: '#' },
              { icon: <InstagramIcon />, href: '#' },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                className="text-white/60 hover:text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-1"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright and legal links (Slightly darker bottom bar) */}
      <div className="w-full px-6 md:px-12 lg:px-16 py-6 bg-zinc-900 dark:bg-zinc-900 border-t border-zinc-900/50 dark:border-zinc-900">
        <div className="text-[11px] sm:text-xs font-semibold text-zinc-400 text-center flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 leading-normal">
          <span>&copy; 2026 Medi-Doc Health</span>
          <span className="hidden sm:inline text-zinc-700 font-normal">&bull;</span>
          <Link href="/about" className="hover:text-rose-500 transition-colors">Privacy Policy</Link>
          <span className="text-zinc-700 font-normal">&bull;</span>
          <Link href="#" className="hover:text-rose-500 transition-colors">Terms & Conditions</Link>
          <span className="text-zinc-700 font-normal">&bull;</span>
          <Link href="#" className="hover:text-rose-500 transition-colors">Notice of Nondiscrimination</Link>
          <span className="text-zinc-700 font-normal">&bull;</span>
          <Link href="#" className="hover:text-rose-500 transition-colors">Patient Bill of Rights</Link>
          <span className="text-zinc-700 font-normal">&bull;</span>
          <Link href="#" className="hover:text-rose-500 transition-colors">Disclaimer</Link>
          <span className="text-zinc-700 font-normal">&bull;</span>
          <Link href="#" className="hover:text-rose-500 transition-colors">Price Transparency</Link>
          <span className="text-zinc-700 font-normal">&bull;</span>
          <Link href="#" className="hover:text-rose-500 transition-colors">Vendors</Link>
        </div>
      </div>
    </footer>
  );
}
