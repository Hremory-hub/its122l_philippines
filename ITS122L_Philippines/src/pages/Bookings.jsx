import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import {
  collection, addDoc, onSnapshot, query,
  where, orderBy, serverTimestamp, deleteDoc, doc, updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { ROOMS } from '../data/rooms';

const emptyForm = (name = '') => ({
  name, roomType: 'Tower Room', checkIn: '', checkOut: '', guests: '2', specialRequests: '',
});

const Bookings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState(emptyForm());

  useEffect(() => { if (!loading && !user) navigate('/login'); }, [user, loading, navigate]);
  useEffect(() => { if (user?.email) setForm(f => ({ ...f, name: user.displayName || user.email.split('@')[0] })); }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'bookings'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [user]);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const selectedRoom = ROOMS.find(r => r.value === form.roomType);

  // Function Room is per day, others per night
  const isPerDay = form.roomType === 'Function Room';
  const nights = Math.max(0, form.checkIn && form.checkOut ? Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000) : 0);
  const totalPrice = nights * (selectedRoom?.price || 0);

  const openNewForm = () => {
    setEditingId(null);
    setForm(emptyForm(user?.displayName || user?.email?.split('@')[0]));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditForm = (b) => {
    if (b.status !== 'pending') return showToast('Only pending bookings can be edited.', 'error');
    setEditingId(b.id);
    setForm({ name: b.name || '', roomType: b.roomType || 'Tower Room', checkIn: b.checkIn || '', checkOut: b.checkOut || '', guests: String(b.guests || 2), specialRequests: b.specialRequests || '' });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm(user?.displayName || user?.email?.split('@')[0])); };

  const handleSubmit = async () => {
    if (!form.name || !form.checkIn || !form.checkOut) return showToast('Please fill in all required fields.', 'error');
    if (new Date(form.checkOut) <= new Date(form.checkIn)) return showToast('Check-out must be after check-in.', 'error');
    setSubmitting(true);
    try {
      const payload = { userId: user.uid, userEmail: user.email, name: form.name, roomType: form.roomType, checkIn: form.checkIn, checkOut: form.checkOut, guests: Number(form.guests), specialRequests: form.specialRequests, totalPrice, nights };
      if (editingId) {
        await updateDoc(doc(db, 'bookings', editingId), { ...payload, updatedAt: serverTimestamp() });
        showToast('✅ Booking updated successfully!');
      } else {
        await addDoc(collection(db, 'bookings'), { ...payload, status: 'pending', createdAt: serverTimestamp() });
        showToast('✅ Booking submitted! Awaiting confirmation.');
      }
      closeForm();
    } catch (e) { console.error(e); showToast('Error saving booking.', 'error'); }
    setSubmitting(false);
  };

  const cancelBooking = async (id, status) => {
    if (status === 'confirmed') return showToast('Confirmed bookings cannot be cancelled. Please contact us.', 'error');
    if (!window.confirm('Cancel this booking?')) return;
    try { await deleteDoc(doc(db, 'bookings', id)); showToast('Booking cancelled.'); }
    catch { showToast('Error cancelling booking.', 'error'); }
  };

  const sc = (s) => s === 'confirmed' ? { bg: '#e8f4f0', color: '#2d5a4e' } : s === 'cancelled' ? { bg: '#fde8e8', color: '#c0392b' } : { bg: '#fef3e2', color: '#b8934a' };

  if (loading) return <div style={S.loading}>Loading...</div>;

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.headerInner}>
          <div>
            <h1 style={S.pageTitle}>My Bookings</h1>
            <p style={S.pageSub}>Welcome back, <strong>{user?.displayName || user?.email?.split('@')[0]}</strong></p>
          </div>
          {!showForm && <button style={S.newBtn} onClick={openNewForm}>+ New Booking</button>}
        </div>
      </div>

      <div style={S.content}>
        {showForm && (
          <div style={S.formCard}>
            <div style={S.formHeader}>
              <h2 style={S.formTitle}>{editingId ? '✏️ Edit Booking' : '🏖️ Reserve Your Stay'}</h2>
              {editingId && <div style={S.editNotice}>Editing a pending booking.</div>}
            </div>

            {/* Room selector */}
            <div style={S.roomGrid}>
              {ROOMS.map(r => (
                <div key={r.value} style={{ ...S.roomOption, ...(form.roomType === r.value ? S.roomSelected : {}) }} onClick={() => setForm({ ...form, roomType: r.value, guests: String(Math.min(Number(form.guests), r.capacity)) })}>
                  <div style={{ width: '100%', height: 80, borderRadius: 8, marginBottom: 8, overflow: 'hidden', background: '#e8e4dc' }}>
                    {r.image
                      ? <img src={r.image} alt={r.value} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{r.icon}</div>
                    }
                  </div>
                  <div style={S.roomOptName}>{r.value}</div>
                  <div style={S.roomOptPrice}>₱{r.price.toLocaleString()}{r.value === 'Function Room' ? '/day' : '/night'}</div>
                  <div style={S.roomOptCap}>Up to {r.capacity} {r.capacity >= 50 ? 'pax' : 'guests'}</div>
                  {form.roomType === r.value && <div style={S.roomOptCheck}>✓</div>}
                </div>
              ))}
            </div>

            {/* Selected room amenities */}
            {selectedRoom && (
              <div style={S.amenitiesBar}>
                <span style={S.amenitiesLabel}>Includes: </span>
                {selectedRoom.amenities.map(a => <span key={a} style={S.amenityTag}>{a}</span>)}
              </div>
            )}

            <div style={S.fieldsGrid}>
              <div style={S.fg}><label style={S.lbl}>Your Name *</label><input style={S.inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" /></div>
              <div style={S.fg}>
                <label style={S.lbl}>Number of Guests *</label>
                <select style={S.inp} value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
                  {Array.from({ length: selectedRoom?.capacity || 2 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
              <div style={S.fg}><label style={S.lbl}>{isPerDay ? 'Start Date *' : 'Check-In *'}</label><input style={S.inp} type="date" min={today} value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} /></div>
              <div style={S.fg}><label style={S.lbl}>{isPerDay ? 'End Date *' : 'Check-Out *'}</label><input style={S.inp} type="date" min={form.checkIn || today} value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} /></div>
            </div>

            <div style={S.fg}><label style={S.lbl}>Special Requests</label><textarea style={{ ...S.inp, height: 80, resize: 'vertical' }} value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })} placeholder="Allergies, accessibility, celebrations..." /></div>

            {nights > 0 && (
              <div style={S.summary}>
                <div style={S.summaryRow}><span>₱{selectedRoom?.price?.toLocaleString()} × {nights} {isPerDay ? 'day' : 'night'}{nights > 1 ? 's' : ''}</span><span>₱{totalPrice.toLocaleString()}</span></div>
                <div style={{ ...S.summaryRow, ...S.summaryTotal }}><span>Estimated Total</span><span>₱{totalPrice.toLocaleString()}</span></div>
              </div>
            )}

            <div style={S.formActions}>
              <button style={S.cancelFormBtn} onClick={closeForm}>Cancel</button>
              <button style={{ ...S.submitBtn, opacity: submitting ? 0.7 : 1 }} onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Request Reservation'}
              </button>
            </div>
            {!editingId && <p style={S.notice}>Your booking will be confirmed by our team within 24 hours.</p>}
          </div>
        )}

        <h2 style={S.sectionTitle}>{bookings.length === 0 ? 'No bookings yet' : `Your Reservations (${bookings.length})`}</h2>

        {bookings.length === 0 ? (
          <div style={S.emptyState}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🏖️</div>
            <p style={{ fontSize: 15, color: '#8a9e9a', marginBottom: 24 }}>You haven't made any bookings yet.</p>
            <button style={S.newBtn} onClick={openNewForm}>Book Your First Stay</button>
          </div>
        ) : (
          <div style={S.bookingsList}>
            {bookings.map(b => {
              const c = sc(b.status);
              const isPending = b.status === 'pending';
              const room = ROOMS.find(r => r.value === b.roomType);
              return (
                <div key={b.id} style={{ ...S.bookingCard, ...(isPending ? S.bookingPending : {}) }}>
                  <div style={S.bookingLeft}>
                    <div style={S.bookingIcon}>{room?.icon || '🏨'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                        <h3 style={S.bookingRoom}>{b.roomType}</h3>
                        <span style={{ ...S.statusBadge, background: c.bg, color: c.color }}>
                          {b.status === 'confirmed' ? '✅' : b.status === 'cancelled' ? '❌' : '⏳'} {b.status}
                        </span>
                        {b.updatedAt && <span style={S.updatedPill}>✏️ Edited</span>}
                      </div>
                      <div style={S.bookingDates}>📅 <strong>{b.checkIn}</strong> → <strong>{b.checkOut}</strong>{b.nights && <span style={S.nightsBadge}>{b.nights} {b.roomType === 'Function Room' ? 'day' : 'night'}{b.nights > 1 ? 's' : ''}</span>}</div>
                      <div style={S.bookingMeta}>👤 {b.guests} guest{b.guests > 1 ? 's' : ''}{b.totalPrice > 0 && <span style={S.pricePill}>₱{Number(b.totalPrice).toLocaleString()}</span>}</div>
                      {b.specialRequests && <div style={S.specialReq}>💬 {b.specialRequests}</div>}
                      <div style={{ fontSize: 11, color: '#c0b090', marginTop: 4 }}>Submitted {b.createdAt?.toDate ? b.createdAt.toDate().toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}</div>
                    </div>
                  </div>
                  <div style={S.bookingActions}>
                    {isPending && <>
                      <button style={S.editBtn} onClick={() => openEditForm(b)}>✏️ Edit</button>
                      <button style={S.cancelBtn} onClick={() => cancelBooking(b.id, b.status)}>✕ Cancel</button>
                    </>}
                    {b.status === 'confirmed' && <div style={{ fontSize: 11, color: '#8a9e9a', textAlign: 'center', maxWidth: 90 }}>Contact us to make changes</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toast && <div style={{ ...S.toast, borderLeft: `4px solid ${toast.type === 'error' ? '#e05a4a' : '#4caf8a'}` }}>{toast.msg}</div>}
    </div>
  );
};

const S = {
  page: { minHeight: '100vh', background: '#f5f0e8', fontFamily: "'DM Sans',sans-serif" },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  header: { background: '#1a2e2a' },
  headerInner: { maxWidth: 1100, margin: '0 auto', padding: '40px 40px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 },
  pageTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 300, color: 'white', margin: 0 },
  pageSub: { color: 'rgba(255,255,255,0.6)', fontSize: 15, marginTop: 6 },
  newBtn: { background: '#c9a96e', color: '#1a2e2a', border: 'none', padding: '12px 26px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  content: { maxWidth: 1100, margin: '0 auto', padding: '40px' },
  formCard: { background: 'white', borderRadius: 20, padding: 36, marginBottom: 40, boxShadow: '0 4px 30px rgba(0,0,0,0.08)' },
  formHeader: { marginBottom: 24 },
  formTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: '#1a2e2a', margin: 0 },
  editNotice: { marginTop: 8, fontSize: 13, color: '#b8934a', background: '#fef3e2', padding: '8px 14px', borderRadius: 8, display: 'inline-block' },
  roomGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 16 },
  roomOption: { border: '2px solid #e8e4dc', borderRadius: 14, padding: '16px 14px', cursor: 'pointer', textAlign: 'center', background: '#faf8f4', position: 'relative', transition: 'all 0.2s' },
  roomSelected: { border: '2px solid #2d5a4e', background: '#f0f8f5' },
  roomOptName: { fontSize: 13, fontWeight: 600, color: '#1a2e2a', marginBottom: 4, lineHeight: 1.3 },
  roomOptPrice: { fontSize: 13, color: '#2d5a4e', fontWeight: 600 },
  roomOptCap: { fontSize: 11, color: '#8a9e9a', marginTop: 3 },
  roomOptCheck: { position: 'absolute', top: 10, right: 12, color: '#2d5a4e', fontSize: 14, fontWeight: 700 },
  amenitiesBar: { background: '#f5f0e8', borderRadius: 10, padding: '10px 16px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  amenitiesLabel: { fontSize: 11, color: '#8a9e9a', textTransform: 'uppercase', letterSpacing: 1 },
  amenityTag: { background: 'white', border: '1px solid #e8e4dc', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: '#2d5a4e' },
  fieldsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 },
  fg: { marginBottom: 16 },
  lbl: { display: 'block', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#8a9e9a', marginBottom: 7 },
  inp: { width: '100%', padding: '11px 14px', border: '1.5px solid #e8e4dc', borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: '#1a2e2a', background: '#faf8f4', outline: 'none', boxSizing: 'border-box' },
  summary: { background: '#f5f0e8', borderRadius: 12, padding: '18px 20px', marginBottom: 20 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#5a7270', marginBottom: 8 },
  summaryTotal: { fontWeight: 600, fontSize: 16, color: '#1a2e2a', borderTop: '1px solid #e8e4dc', paddingTop: 10, marginTop: 4, marginBottom: 0 },
  formActions: { display: 'flex', gap: 12, justifyContent: 'flex-end', marginBottom: 8 },
  cancelFormBtn: { padding: '12px 24px', background: '#f5f0e8', color: '#8a9e9a', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' },
  submitBtn: { padding: '12px 32px', background: '#2d5a4e', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  notice: { textAlign: 'center', fontSize: 12, color: '#8a9e9a', margin: 0 },
  sectionTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 400, color: '#1a2e2a', marginBottom: 20 },
  bookingsList: { display: 'flex', flexDirection: 'column', gap: 16 },
  bookingCard: { background: 'white', borderRadius: 16, padding: '24px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' },
  bookingPending: { borderLeft: '4px solid #c9a96e' },
  bookingLeft: { display: 'flex', gap: 18, alignItems: 'flex-start', flex: 1 },
  bookingIcon: { fontSize: 32, width: 52, height: 52, background: '#f5f0e8', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bookingRoom: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 400, color: '#1a2e2a', margin: 0 },
  bookingDates: { fontSize: 13, color: '#5a7270', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  bookingMeta: { fontSize: 13, color: '#8a9e9a', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 },
  nightsBadge: { background: '#e8f4f0', color: '#2d5a4e', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  pricePill: { background: '#f5f0e8', color: '#1a2e2a', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  updatedPill: { background: '#fef3e2', color: '#b8934a', padding: '2px 10px', borderRadius: 20, fontSize: 11 },
  specialReq: { fontSize: 12, color: '#8a9e9a', fontStyle: 'italic', marginBottom: 4 },
  statusBadge: { padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize', flexShrink: 0 },
  bookingActions: { display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 },
  editBtn: { background: '#e8eef4', color: '#3a5a7a', border: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 500 },
  cancelBtn: { background: '#fde8e8', color: '#c0392b', border: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 500 },
  emptyState: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 20 },
  toast: { position: 'fixed', bottom: 28, right: 28, padding: '14px 22px', borderRadius: 12, fontSize: 14, fontWeight: 500, zIndex: 300, background: '#1a2e2a', color: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' },
};

export default Bookings;