'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { db, Doctor } from '../../lib/mockDb';
import ScrollAnimate from '../../components/ScrollAnimate';
import {
  Search,
  Star,
  MapPin,
  Award,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

export default function FindDoctorsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initial params
  const initialSearch = searchParams ? searchParams.get('search') || '' : '';

  // States
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<string>('rating-desc');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // 300ms Search Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset page on search
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Sync state if URL param changes
  useEffect(() => {
    const urlSearch = searchParams ? searchParams.get('search') || '' : '';
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  // Calculate doctor rating dynamically from review list
  const getAverageRating = (docId: string) => {
    const reviews = db.getReviews().filter(r => r.doctorId === docId);
    if (reviews.length === 0) return 4.5; // fallback rating
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  };

  // Read, filter, and sort doctors
  useEffect(() => {
    let list = db.getDoctors().filter(d => d.verificationStatus === 'verified');

    // Filter by name or specialization
    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase();
      list = list.filter(
        d =>
          d.doctorName.toLowerCase().includes(term) ||
          d.specialization.toLowerCase().includes(term)
      );
    }

    // Filter by category tag
    if (selectedSpecialization !== 'all') {
      list = list.filter(d => d.specialization.toLowerCase() === selectedSpecialization.toLowerCase());
    }

    // Sorting
    list.sort((a, b) => {
      const aRating = getAverageRating(a.id);
      const bRating = getAverageRating(b.id);

      if (sortBy === 'fee-asc') {
        return a.consultationFee - b.consultationFee;
      }
      if (sortBy === 'fee-desc') {
        return b.consultationFee - a.consultationFee;
      }
      if (sortBy === 'experience-desc') {
        return b.experience - a.experience;
      }
      if (sortBy === 'rating-desc') {
        return bRating - aRating;
      }
      return 0;
    });

    setDoctors(list);
  }, [debouncedSearch, sortBy, selectedSpecialization]);

  // Pagination logic (4 items/page to make pagination visual controls clickable and testable)
  const itemsPerPage = 4;
  const totalPages = Math.ceil(doctors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSortBy('rating-desc');
    setSelectedSpecialization('all');
    setCurrentPage(1);
    router.push('/find-doctors');
  };

  // Get distinct specializations list
  const specializations = ['all', ...Array.from(new Set(db.getDoctors().filter(d => d.verificationStatus === 'verified').map(d => d.specialization)))];

  return (
    <div className="min-h-screen container px-4 py-12 sm:px-6 lg:px-8 space-y-8 pb-24">

      {/* Title */}
      <ScrollAnimate>
        <div className="space-y-2 border-b border-slate-100 dark:border-zinc-800/80 pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <Stethoscope className="h-3.5 w-3.5" /> Medi-Doc Medical Directory
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find Doctors & Specialists
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Search and book medical consultations with verified registry specialists in Addis Ababa.
          </p>
        </div>
      </ScrollAnimate>

      {/* Search and Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Filters Sidebar */}
        <ScrollAnimate className="lg:col-span-3">
          <div className="w-full rounded-[10px] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3">
              <span className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <SlidersHorizontal className="h-4 w-4 text-rose-500" />
                Filter Registry
              </span>
              {(searchTerm || selectedSpecialization !== 'all' || sortBy !== 'rating-desc') && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-rose-500 font-semibold hover:text-rose-600 flex items-center gap-0.5 cursor-pointer bg-transparent border-none"
                >
                  <X className="h-3.5 w-3.5" />
                  Reset
                </button>
              )}
            </div>

            {/* Search Term Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300">Search Doctor Name</label>
              <div className="flex items-center rounded-[8px] border border-slate-200 dark:border-zinc-800 bg-background px-3 py-2 text-sm focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500/10">
                <Search className="h-4 w-4 text-slate-400 dark:text-zinc-650 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-650 border-none text-sm"
                />
              </div>
            </div>

            {/* Specialization Categories */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300">Clinical Speciality</label>
              <div className="flex flex-col gap-1.5">
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => {
                      setSelectedSpecialization(spec);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-[8px] font-medium border transition-all cursor-pointer ${
                      selectedSpecialization.toLowerCase() === spec.toLowerCase()
                        ? 'bg-rose-500 border-rose-500 text-white font-semibold shadow-xs'
                        : 'border-transparent text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {spec === 'all' ? 'All Specialities' : spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollAnimate>

        {/* Right Listings Grid */}
        <ScrollAnimate className="lg:col-span-9">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs border-b border-slate-100 dark:border-zinc-800/80 pb-4 gap-4">
              <div className="flex items-center gap-3 text-slate-500 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span>
                    Showing <strong className="text-slate-900 dark:text-white font-bold">{doctors.length > 0 ? indexOfFirstItem + 1 : 0}–{Math.min(indexOfLastItem, doctors.length)}</strong>
                  </span>
                </div>
                {debouncedSearch && (
                  <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-zinc-800 pl-3">
                    <span className="text-slate-455 dark:text-zinc-550">Query:</span>
                    <span className="font-semibold text-rose-500 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 rounded px-1.5 py-0.5 text-[10px]">
                      &ldquo;{debouncedSearch}&rdquo;
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* layout mode switch buttons (Option 3 Layout Change) */}
                <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-zinc-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-zinc-800 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setViewMode('card')} 
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-[6px] transition-all cursor-pointer border-none ${
                      viewMode === 'card' 
                        ? 'bg-rose-500 text-white shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-150 bg-transparent'
                    }`}
                  >
                    Card View
                  </button>
                  <button 
                    type="button"
                    onClick={() => setViewMode('table')} 
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-[6px] transition-all cursor-pointer border-none ${
                      viewMode === 'table' 
                        ? 'bg-rose-500 text-white shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-150 bg-transparent'
                    }`}
                  >
                    Table View
                  </button>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-2.5 py-1 text-xs focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500/10">
                  <ArrowUpDown className="h-3.5 w-3.5 text-slate-455 dark:text-zinc-550 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent outline-none border-none text-slate-700 dark:text-zinc-300 text-xs cursor-pointer font-medium"
                  >
                    <option value="rating-desc" className="bg-card">Rating: High to Low</option>
                    <option value="experience-desc" className="bg-card">Exp: High to Low</option>
                    <option value="fee-asc" className="bg-card">Fee: Low to High</option>
                    <option value="fee-desc" className="bg-card">Fee: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {currentDoctors.length > 0 ? (
              viewMode === 'card' ? (
                /* Card Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-[fadeIn_0.3s_ease]">
                  {currentDoctors.map((doc) => {
                    const docRating = getAverageRating(doc.id);
                    return (
                      <div
                        key={doc.id}
                        className="group rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 flex flex-col sm:flex-row gap-5 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Photo Container */}
                        <div className="relative w-full sm:w-32 h-44 sm:h-32 rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-800 shrink-0 border border-slate-100 dark:border-zinc-800/50">
                          <img
                            src={doc.profileImage}
                            alt={doc.doctorName}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Rating badge Overlay */}
                          <div className="absolute top-2 left-2 flex items-center gap-0.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-amber-500 shadow-xs border border-amber-100/50 dark:border-amber-550/20">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            <span>{docRating}</span>
                          </div>
                        </div>

                        {/* Body Content */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-455 border border-rose-100 dark:border-rose-500/10">
                                {doc.specialization}
                              </span>

                              <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-50 dark:bg-zinc-850 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-zinc-350 border border-slate-100 dark:border-zinc-700/50">
                                <Award className="h-3 w-3 text-rose-500" />
                                {doc.experience} yrs exp
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors truncate">
                                  {doc.doctorName}
                                </h3>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500/10 shrink-0" />
                              </div>
                              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium line-clamp-1 leading-relaxed">
                                {doc.qualifications}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-zinc-500">
                              <MapPin className="h-3.5 w-3.5 text-slate-450 dark:text-zinc-650 shrink-0" />
                              <span className="truncate">{doc.hospitalName}</span>
                            </div>
                          </div>

                          {/* Footer Row */}
                          <div className="border-t border-slate-100 dark:border-zinc-850 pt-3 mt-3 flex items-center justify-between gap-4">
                            <div>
                              <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">Consultation</div>
                              <div className="text-slate-900 dark:text-white font-extrabold text-sm mt-0.5 flex items-center">
                                <i className="fa-solid fa-bangladeshi-taka-sign text-xs mr-0.5"></i>{doc.consultationFee}
                              </div>
                            </div>

                            <Link
                              href={`/doctors/${doc.id}`}
                              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-3.5 py-2 rounded-lg text-xs transition-all active:scale-[0.98] shadow-sm hover:shadow-md shadow-rose-500/10 cursor-pointer"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Option 3 Layout Change: Spreadsheet/Table format */
                <div className="overflow-x-auto border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-xl shadow-xs animate-[fadeIn_0.3s_ease]">
                  <table className="w-full min-w-[750px] border-collapse text-left text-xs text-slate-600 dark:text-zinc-300">
                    <thead className="bg-slate-50 dark:bg-zinc-900/50 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800">
                      <tr>
                        <th className="py-4 px-5">Specialist</th>
                        <th className="py-4 px-5">Clinical Speciality</th>
                        <th className="py-4 px-5">Affiliated Hospital</th>
                        <th className="py-4 px-5">Experience</th>
                        <th className="py-4 px-5">Rating</th>
                        <th className="py-4 px-5 text-right">Consultation Fee</th>
                        <th className="py-4 px-5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                      {currentDoctors.map((doc) => {
                        const docRating = getAverageRating(doc.id);
                        return (
                          <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/20 transition-colors">
                            <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-3">
                              <img src={doc.profileImage} alt={doc.doctorName} className="h-9 w-9 rounded-lg object-cover border border-slate-200 dark:border-zinc-800 shrink-0" />
                              <div className="min-w-0">
                                <div className="font-extrabold flex items-center gap-1">
                                  {doc.doctorName}
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10 shrink-0" />
                                </div>
                                <div className="text-[10px] text-slate-400 font-semibold">{doc.qualifications}</div>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 font-semibold text-rose-600 dark:text-rose-400">{doc.specialization}</td>
                            <td className="py-3.5 px-5 font-medium text-slate-550 dark:text-zinc-400">{doc.hospitalName}</td>
                            <td className="py-3.5 px-5 font-bold text-slate-700 dark:text-zinc-350">{doc.experience} Yrs</td>
                            <td className="py-3.5 px-5">
                              <span className="inline-flex items-center gap-1 rounded bg-amber-500/5 text-amber-550 dark:text-amber-400 font-bold px-2 py-0.5 border border-amber-500/10">
                                ★ {docRating}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-right font-extrabold text-slate-900 dark:text-zinc-150"><i className="fa-solid fa-bangladeshi-taka-sign text-[11px] mr-0.5"></i>{doc.consultationFee}</td>
                            <td className="py-3.5 px-5 text-center">
                              <Link href={`/doctors/${doc.id}`} className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer shadow-xs">
                                Book Now
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="rounded-[10px] border border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-12 text-center space-y-4">
                <Sparkles className="h-10 w-10 text-slate-300 dark:text-zinc-650 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No registry records found</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mx-auto">
                  We couldn&apos;t identify any certified medical specialist matching your search filter tags.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs px-5 py-2.5 rounded-[8px] transition-all cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-[8px] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors cursor-pointer bg-transparent"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 text-xs font-semibold rounded-[8px] border transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-rose-500 border-rose-500 text-white font-bold'
                          : 'border-slate-200 dark:border-zinc-800 text-slate-650 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 bg-transparent'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-[8px] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors cursor-pointer bg-transparent"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </ScrollAnimate>
      </div>
    </div>
  );
}
