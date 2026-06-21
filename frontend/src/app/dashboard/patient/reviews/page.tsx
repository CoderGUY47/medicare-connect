'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { db, Review, Doctor } from '../../../../lib/mockDb';
import { Star, Edit2, Trash2, X, MessageSquare } from 'lucide-react';
import { FiChevronRight, FiPlus } from 'react-icons/fi';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { MdOutlineRateReview } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function PatientReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [doctorId, setDoctorId] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => { loadData(); }, [user]);

  const loadData = () => {
    if (!user) return;
    const userReviews = db.getReviews().filter(r => r.patientId === user.id);
    userReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setReviews(userReviews);
    const docs = db.getDoctors().filter(d => d.verificationStatus === 'verified');
    setDoctors(docs);
    if (docs.length > 0) setDoctorId(docs[0].id);
  };

  const openCreate = () => {
    setEditingReview(null); setRating(5); setReviewText('');
    if (doctors.length > 0) setDoctorId(doctors[0].id);
    setIsModalOpen(true);
  };

  const openEdit = (rev: Review) => {
    setEditingReview(rev); setDoctorId(rev.doctorId); setRating(rev.rating);
    setReviewText(rev.reviewText); setIsModalOpen(true);
  };

  const handleDelete = (revId: string) => {
    if (!confirm('Delete this review?')) return;
    db.setReviews(db.getReviews().filter(r => r.id !== revId));
    loadData();
    toast.error('Review deleted.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reviewText.trim()) { toast.error('Please write your review feedback.'); return; }
    const all = db.getReviews();
    if (editingReview) {
      db.setReviews(all.map(r => r.id === editingReview.id ? { ...r, rating, reviewText: reviewText.trim() } : r));
      toast.success('Review updated!');
    } else {
      const doc = doctors.find(d => d.id === doctorId);
      if (!doc) return;
      db.setReviews([{
        id: `rev-${Date.now()}`,
        patientId: user.id, patientName: user.name, patientPhoto: user.photo,
        doctorId, rating, reviewText: reviewText.trim(), createdAt: new Date().toISOString()
      }, ...all]);
      toast.success('Review submitted! Thank you.');
    }
    setIsModalOpen(false); loadData();
  };

  const getDoctorById = (id: string) => doctors.find(d => d.id === id);

  const StarRating = ({ value, onChange, interactive = false }: { value: number; onChange?: (n: number) => void; interactive?: boolean }) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type={interactive ? 'button' : 'button'}
          disabled={!interactive}
          onClick={() => interactive && onChange?.(n)}
          onMouseEnter={() => interactive && setHoverRating(n)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`transition-all ${interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
        >
          {n <= (interactive ? (hoverRating || value) : value)
            ? <BsStarFill className={`${interactive ? 'h-6 w-6' : 'h-3.5 w-3.5'} text-amber-400`} />
            : <BsStar className={`${interactive ? 'h-6 w-6' : 'h-3.5 w-3.5'} text-slate-300 dark:text-zinc-600`} />
          }
        </button>
      ))}
    </div>
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '–';

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">
            <span>Patient</span><FiChevronRight className="h-3 w-3" /><span className="text-rose-500">Reviews</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <MdOutlineRateReview className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            My Reviews
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 ml-12">Rate and review your consultation experiences.</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-md transition-all shadow-lg shadow-rose-500/20 shrink-0 cursor-pointer">
          <FiPlus className="h-4 w-4" />
          Write Review
        </button>
      </div>

      {/* Summary bar */}
      {reviews.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center gap-8 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-extrabold text-amber-500">{avgRating}</div>
            <div>
              <StarRating value={Math.round(Number(avgRating))} interactive={false} />
              <div className="text-xs text-slate-400 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''} written</div>
            </div>
          </div>
          <div className="flex-1 space-y-1.5 min-w-[180px]">
            {[5,4,3,2,1].map(star => {
              const count = reviews.filter(r => r.rating === star).length;
              const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 w-4">{star}</span>
                  <BsStarFill className="h-2.5 w-2.5 text-amber-400 shrink-0" />
                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 w-5">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map(rev => {
            const doc = getDoctorById(rev.doctorId);
            return (
              <div key={rev.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Review Header */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {doc?.profileImage ? (
                      <img src={doc.profileImage} alt={doc.doctorName} className="h-11 w-11 rounded-xl object-cover border-2 border-white dark:border-zinc-700 shadow-sm shrink-0" />
                    ) : (
                      <div className="h-11 w-11 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Star className="h-5 w-5 text-amber-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-800 dark:text-zinc-100 truncate">{doc?.doctorName || 'Unknown Doctor'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{doc?.specialization} · {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <StarRating value={rev.rating} interactive={false} />
                      <span className="text-xs font-extrabold text-amber-500">{rev.rating}/5</span>
                    </div>
                  </div>
                </div>

                {/* Review body */}
                <div className="px-5 py-4">
                  <div className="relative pl-4 border-l-2 border-rose-500/20">
                    <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed italic">
                      &ldquo;{rev.reviewText}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">REV-{rev.id.slice(-6).toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDelete(rev.id)}
                      className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all cursor-pointer">
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                    <button onClick={() => openEdit(rev)}
                      className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 transition-all cursor-pointer">
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl py-20 flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Star className="h-8 w-8 text-amber-300 dark:text-amber-700" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No reviews yet</p>
            <p className="text-xs text-slate-400 mt-1">Share your experience to help other patients.</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-md transition-all shadow-md shadow-rose-500/20 cursor-pointer">
            <FiPlus className="h-4 w-4" />
            Write Your First Review
          </button>
        </div>
      )}

      {/* ── Write/Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                  {editingReview ? 'Edit Review' : 'Write a Review'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Doctor Select */}
              {!editingReview && (
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-2">Select Doctor</label>
                  <select
                    value={doctorId}
                    onChange={e => setDoctorId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-zinc-100 outline-none focus:border-rose-500 transition-all cursor-pointer"
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id} className="bg-white dark:bg-zinc-900">
                        {d.doctorName} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Star Rating */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-3">Your Rating</label>
                <div className="flex items-center gap-3">
                  <StarRating value={rating} onChange={setRating} interactive={true} />
                  <span className="text-sm font-extrabold text-amber-500">{rating}/5</span>
                  <span className="text-xs text-slate-400">
                    {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-2">Your Feedback</label>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe your experience with the doctor..."
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none"
                />
                <div className="text-[10px] text-slate-400 mt-1 text-right">{reviewText.length}/500 characters</div>
              </div>

              <button type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-md text-sm transition-all shadow-lg shadow-rose-500/20 cursor-pointer">
                {editingReview ? 'Save Changes' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
