import { useState, useEffect } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const Testimonials = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: '', rating: 5, roomType: '', message: '' });

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: user.displayName || user.email?.split('@')[0] || '' }));
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const handleSubmit = async () => {
    if (!form.name || !form.message) return showToast('Please fill in your name and message.', 'error');
    if (form.message.length < 20) return showToast('Please write at least 20 characters.', 'error');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'testimonials'), {
        ...form,
        userId: user?.uid || null,
        userEmail: user?.email || null,
        createdAt: serverTimestamp(),
      });
      showToast('✅ Thank you for your feedback!');
      setShowForm(false);
      setForm({ name: user?.displayName || user?.email?.split('@')[0] || '', rating: 5, roomType: '', message: '' });
    } catch { showToast('Error submitting. Try again.', 'error'); }
    setSubmitting(false);
  };

  const stars = (n) => Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < n ? '#c9a96e' : '#e0d8cc', fontSize: 16 }}>★</span>
  ));

  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((s, t) => s + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerInner}>
          <div style={S.headerBadge}>✦ Guest Stories</div>
          <h1 style={S.pageTitle}>What Our Guests Say</h1>
          <p style={S.pageSub}>Real experiences from real guests at Dfarm Resort</p>
          <div style={S.headerStats}>
            <div style={S.headerStat}>
              <span style={S.bigRating}>{avgRating}</span>
              <div style={{ display: 'flex', gap: 2, justifyContent: 'center', margin: '4px 0' }}>{stars(Math.round(Number(avgRating)))}</div>
              <span style={S.ratingLabel}>Average Rating</span>
            </div>
            <div style={S.headerStatDivider} />
            <div style={S.headerStat}>
              <span style={S.bigRating}>{testimonials.length}</span>
              <span style={S.ratingLabel}>Guest Reviews</span>
            </div>
          </div>
          {user && (
            <button style={S.writeBtn} onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '✍️ Write a Review'}
            </button>
          )}
          {!user && (
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 16 }}>
              <a href="/login" style={{ color: '#c9a96e' }}>Sign in</a> to leave a review
            </p>
          )}
        </div>
      </div>

      <div style={S.content}>
        {/* Submit form */}
        {showForm && (
          <div style={S.formCard}>
            <h2 style={S.formTitle}>Share Your Experience</h2>
            <div style={S.formGrid}>
              <div style={S.fg}>
                <label style={S.lbl}>Your Name *</label>
                <input style={S.inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
              </div>
              <div style={S.fg}>
                <label style={S.lbl}>Room / Service Experienced</label>
                <input style={S.inp} value={form.roomType} onChange={e => setForm({ ...form, roomType: e.target.value })} placeholder="e.g. Beachfront Suite, Spa..." />
              </div>
            </div>
            <div style={S.fg}>
              <label style={S.lbl}>Your Rating *</label>
              <div style={S.starPicker}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} style={S.starBtn} onClick={() => setForm({ ...form, rating: n })}>
                    <span style={{ fontSize: 28, color: n <= form.rating ? '#c9a96e' : '#e0d8cc', cursor: 'pointer' }}>★</span>
                  </button>
                ))}
                <span style={{ fontSize: 14, color: '#8a9e9a', marginLeft: 8 }}>
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][form.rating]}
                </span>
              </div>
            </div>
            <div style={S.fg}>
              <label style={S.lbl}>Your Review *</label>
              <textarea style={{ ...S.inp, height: 120, resize: 'vertical' }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your stay at Dfarm Resort..." />
              <p style={S.charCount}>{form.message.length} / 500 characters</p>
            </div>
            <div style={S.formActions}>
              <button style={S.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={{ ...S.submitBtn, opacity: submitting ? 0.7 : 1 }} onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        )}

        {/* Testimonials grid */}
        {testimonials.length === 0 ? (
          <div style={S.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <p style={{ fontSize: 15, color: '#8a9e9a' }}>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div style={S.grid}>
            {testimonials.map((t, i) => (
              <div key={t.id} style={{ ...S.card, ...(i === 0 ? S.cardFeatured : {}) }}>
                <div style={S.cardTop}>
                  <div style={S.guestAvatar}>{(t.name || '?')[0].toUpperCase()}</div>
                  <div>
                    <div style={S.guestName}>{t.name}</div>
                    {t.roomType && <div style={S.roomTag}>{t.roomType}</div>}
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>{stars(t.rating || 5)}</div>
                </div>
                <p style={S.message}>"{t.message}"</p>
                <div style={S.cardDate}>
                  {t.createdAt?.toDate ? t.createdAt.toDate().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && <div style={{ ...S.toast, borderLeft: `4px solid ${toast.type === 'error' ? '#e05a4a' : '#4caf8a'}` }}>{toast.msg}</div>}
    </div>
  );
};

const S = {
  page: { minHeight: '100vh', background: '#f5f0e8', fontFamily: "'DM Sans',sans-serif" },
  header: { background: 'linear-gradient(135deg,#1a2e2a,#2d5a4e)', padding: '60px 40px', textAlign: 'center' },
  headerInner: { maxWidth: 700, margin: '0 auto' },
  headerBadge: { display: 'inline-block', background: 'rgba(201,169,110,0.2)', border: '1px solid rgba(201,169,110,0.4)', color: '#c9a96e', padding: '5px 16px', borderRadius: 20, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 },
  pageTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,56px)', fontWeight: 300, color: 'white', marginBottom: 12 },
  pageSub: { color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 32 },
  headerStats: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 40px', display: 'inline-flex', marginBottom: 28 },
  headerStat: { textAlign: 'center', padding: '0 32px' },
  headerStatDivider: { width: 1, height: 48, background: 'rgba(255,255,255,0.2)' },
  bigRating: { fontFamily: "'Cormorant Garamond',serif", fontSize: 40, color: 'white', fontWeight: 300, display: 'block' },
  ratingLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: 0.5 },
  writeBtn: { background: '#c9a96e', color: '#1a2e2a', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'block', margin: '0 auto' },

  content: { maxWidth: 1100, margin: '0 auto', padding: '48px 40px' },

  formCard: { background: 'white', borderRadius: 20, padding: 36, marginBottom: 40, boxShadow: '0 4px 30px rgba(0,0,0,0.08)' },
  formTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 400, color: '#1a2e2a', marginBottom: 24 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 4 },
  fg: { marginBottom: 18 },
  lbl: { display: 'block', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#8a9e9a', marginBottom: 7 },
  inp: { width: '100%', padding: '11px 14px', border: '1.5px solid #e8e4dc', borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: '#1a2e2a', background: '#faf8f4', outline: 'none', boxSizing: 'border-box' },
  starPicker: { display: 'flex', alignItems: 'center', gap: 4 },
  starBtn: { background: 'none', border: 'none', padding: 2, cursor: 'pointer', lineHeight: 1 },
  charCount: { fontSize: 11, color: '#8a9e9a', marginTop: 4 },
  formActions: { display: 'flex', gap: 12, justifyContent: 'flex-end' },
  cancelBtn: { padding: '11px 22px', background: '#f5f0e8', color: '#8a9e9a', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14 },
  submitBtn: { padding: '11px 28px', background: '#2d5a4e', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans',sans-serif" },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 },
  card: { background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' },
  cardFeatured: { gridColumn: 'span 1', border: '2px solid #c9a96e' },
  cardTop: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  guestAvatar: { width: 42, height: 42, background: 'linear-gradient(135deg,#2d5a4e,#1a3a30)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 },
  guestName: { fontWeight: 600, fontSize: 14, color: '#1a2e2a' },
  roomTag: { fontSize: 11, color: '#2d5a4e', background: '#e8f4f0', padding: '2px 8px', borderRadius: 20, marginTop: 3, display: 'inline-block' },
  message: { fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: '#3a5a50', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' },
  cardDate: { fontSize: 11, color: '#c0b090' },

  emptyState: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 20 },
  toast: { position: 'fixed', bottom: 28, right: 28, padding: '14px 22px', borderRadius: 12, fontSize: 14, fontWeight: 500, zIndex: 300, background: '#1a2e2a', color: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' },
};

export default Testimonials;