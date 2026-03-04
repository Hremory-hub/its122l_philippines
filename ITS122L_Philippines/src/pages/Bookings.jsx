import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import {
  collection, addDoc, onSnapshot, query,
  where, orderBy, serverTimestamp, deleteDoc, doc
} from 'firebase/firestore';
import { db } from '../firebase/config';

const ROOMS = [
  { value: 'Deluxe Garden Room', price: 4500, icon: '🌿', capacity: 2 },
  { value: 'Beachfront Suite', price: 8500, icon: '🌊', capacity: 2 },
  { value: 'Private Pool Villa', price: 18000, icon: '🏡', capacity: 4 },
  { value: 'Garden Suite', price: 6500, icon: '🌸', capacity: 3 },
];

const Bookings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    name: '',
    roomType: 'Deluxe Garden Room',
    checkIn: '',
    checkOut: '',
    guests: '2',
    specialRequests: '',
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  // Pre-fill name from user email
  useEffect(() => {
    if (user?.email) {
      setForm(f => ({ ...f, name: user.displayName || user.email.split('@')[0] }));
    }
  }, [user]);

  // Real-time listener for THIS user's bookings only
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const selectedRoom = ROOMS.find(r => r.value === form.roomType);

  const calcNights = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const diff = new Date(form.checkOut) - new Date(form.checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calcNights();
  const totalPrice = nights * (selectedRoom?.price || 0);

  const handleSubmit = async () => {
    if (!form.name || !form.checkIn || !form.checkOut) {
      return showToast('Please fill in all required fields.', 'error');
    }
    if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      return showToast('Check-out must be after check-in.', 'error');
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        userEmail: user.email,
        name: form.name,
        roomType: form.roomType,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
        specialRequests: form.specialRequests,
        totalPrice,
        nights,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      showToast('✅ Booking submitted! Awaiting confirmation.');
      setShowForm(false);
      setForm({ name: user.displayName || user.email.split('@')[0], roomType: 'Deluxe Garden Room', checkIn: '', checkOut: '', guests: '2', specialRequests: '' });
    } catch (e) {
      console.error(e);
      showToast('Error submitting booking. Try again.', 'error');
    }
    setSubmitting(false);
  };

  const cancelBooking = async (id, status) => {
    if (status === 'confirmed') {
      return showToast('Confirmed bookings cannot be cancelled. Please contact us.', 'error');
    }
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await deleteDoc(doc(db, 'bookings', id));
      showToast('Booking cancelled.');
    } catch {
      showToast('Error cancelling booking.', 'error');
    }
  };

  const statusColor = (s) => {
    if (s === 'confirmed') return { bg: '#e8f4f0', color: '#2d5a4e' };
    if (s === 'cancelled') return { bg: '#fde8e8', color: '#c0392b' };
    return { bg: '#fef3e2', color: '#b8934a' }; // pending
  };

  const statusIcon = (s) => {
    if (s === 'confirmed') return '✅';
    if (s === 'cancelled') return '❌';
    return '⏳';
  };

  if (loading) return <div style={S.loading}>Loading...</div>;

  return (
    <div style={S.page}>
      {/* HEADER */}
      <div style={S.header}>
        <div style={S.headerInner}>
          <div>
            <h1 style={S.pageTitle}>My Bookings</h1>
            <p style={S.pageSub}>Welcome back, <strong>{user?.displayName || user?.email?.split('@')[0]}</strong></p>
          </div>
          <button style={S.newBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ New Booking'}
          </button>
        </div>
      </div>

      <div style={S.content}>
        {/* BOOKING FORM */}
        {showForm && (
          <div style={S.formCard}>
            <h2 style={S.formTitle}>Reserve Your Stay</h2>

            {/* Room selector */}
            <div style={S.roomGrid}>
              {ROOMS.map(r => (
                <div
                  key={r.value}
                  style={{ ...S.roomOption, ...(form.roomType === r.value ? S.roomSelected : {}) }}
                  onClick={() => setForm({ ...form, roomType: r.value })}
                >
                  <div style={S.roomIcon}>{r.icon}</div>
                  <div style={S.roomName}>{r.value}</div>
                  <div style={S.roomPrice}>₱{r.price.toLocaleString()}/night</div>
                  <div style={S.roomCap}>Up to {r.capacity} guests</div>
                </div>
              ))}
            </div>

            {/* Form fields */}
            <div style={S.fieldsGrid}>
              <div style={S.fg}>
                <label style={S.lbl}>Your Name *</label>
                <input style={S.inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
              </div>
              <div style={S.fg}>
                <label style={S.lbl}>Number of Guests *</label>
                <select style={S.inp} value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div style={S.fg}>
                <label style={S.lbl}>Check-In Date *</label>
                <input style={S.inp} type="date" min={today} value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} />
              </div>
              <div style={S.fg}>
                <label style={S.lbl}>Check-Out Date *</label>
                <input style={S.inp} type="date" min={form.checkIn || today} value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} />
              </div>
            </div>

            <div style={S.fg}>
              <label style={S.lbl}>Special Requests (optional)</label>
              <textarea style={{ ...S.inp, height: 80, resize: 'vertical' }} placeholder="Allergies, accessibility needs, celebrations..." value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })} />
            </div>

            {/* Price summary */}
            {nights > 0 && (
              <div style={S.summary}>
                <div style={S.summaryRow}>
                  <span>₱{selectedRoom?.price?.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span>₱{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ ...S.summaryRow, ...S.summaryTotal }}>
                  <span>Total</span>
                  <span>₱{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button style={{ ...S.submitBtn, opacity: submitting ? 0.7 : 1 }} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Request Reservation'}
            </button>
            <p style={S.notice}>Your booking will be confirmed by our team within 24 hours.</p>
          </div>
        )}

        {/* BOOKINGS LIST */}
        <div>
          <h2 style={S.sectionTitle}>
            {bookings.length === 0 ? 'No bookings yet' : `Your Reservations (${bookings.length})`}
          </h2>

          {bookings.length === 0 ? (
            <div style={S.emptyState}>
              <div style={S.emptyIcon}>🏖️</div>
              <p style={S.emptyText}>You haven't made any bookings yet.</p>
              <button style={S.newBtn} onClick={() => setShowForm(true)}>Book Your First Stay</button>
            </div>
          ) : (
            <div style={S.bookingsList}>
              {bookings.map(b => {
                const sc = statusColor(b.status);
                return (
                  <div key={b.id} style={S.bookingCard}>
                    <div style={S.bookingLeft}>
                      <div style={S.bookingIcon}>
                        {ROOMS.find(r => r.value === b.roomType)?.icon || '🏨'}
                      </div>
                      <div>
                        <h3 style={S.bookingRoom}>{b.roomType}</h3>
                        <div style={S.bookingDates}>
                          📅 {b.checkIn} → {b.checkOut}
                          {b.nights && <span style={S.nightsBadge}>{b.nights} night{b.nights > 1 ? 's' : ''}</span>}
                        </div>
                        <div style={S.bookingMeta}>
                          👤 {b.guests} guest{b.guests > 1 ? 's' : ''}
                          {b.totalPrice && <span style={S.pricePill}>₱{Number(b.totalPrice).toLocaleString()}</span>}
                        </div>
                        {b.specialRequests && (
                          <div style={S.specialReq}>💬 {b.specialRequests}</div>
                        )}
                      </div>
                    </div>
                    <div style={S.bookingRight}>
                      <span style={{ ...S.statusBadge, background: sc.bg, color: sc.color }}>
                        {statusIcon(b.status)} {b.status}
                      </span>
                      <div style={S.bookingDate}>
                        {b.createdAt?.toDate ? b.createdAt.toDate().toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                      </div>
                      {b.status === 'pending' && (
                        <button style={S.cancelBtn} onClick={() => cancelBooking(b.id, b.status)}>
                          Cancel
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <div style={S.confirmedNote}>Contact us to cancel</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ ...S.toast, borderLeft: `4px solid ${toast.type === 'error' ? '#e05a4a' : '#4caf8a'}` }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

const S = {
  page: { minHeight: '100vh', background: '#f5f0e8', fontFamily: "'DM Sans',sans-serif" },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' },

  header: { background: '#1a2e2a', padding: '0 0 0' },
  headerInner: { maxWidth: 1000, margin: '0 auto', padding: '40px 40px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 },
  pageTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 300, color: 'white', margin: 0 },
  pageSub: { color: 'rgba(255,255,255,0.6)', fontSize: 15, marginTop: 6 },
  newBtn: { background: '#c9a96e', color: '#1a2e2a', border: 'none', padding: '12px 26px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },

  content: { maxWidth: 1000, margin: '0 auto', padding: '40px 40px' },

  // Form card
  formCard: { background: 'white', borderRadius: 20, padding: '36px', marginBottom: 40, boxShadow: '0 4px 30px rgba(0,0,0,0.08)' },
  formTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: '#1a2e2a', marginBottom: 28 },

  roomGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 },
  roomOption: { border: '2px solid #e8e4dc', borderRadius: 14, padding: '18px 14px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', background: '#faf8f4' },
  roomSelected: { border: '2px solid #2d5a4e', background: '#f0f8f5' },
  roomIcon: { fontSize: 28, marginBottom: 8 },
  roomName: { fontSize: 13, fontWeight: 500, color: '#1a2e2a', marginBottom: 4, lineHeight: 1.3 },
  roomPrice: { fontSize: 13, color: '#2d5a4e', fontWeight: 600 },
  roomCap: { fontSize: 11, color: '#8a9e9a', marginTop: 3 },

  fieldsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  fg: { marginBottom: 16 },
  lbl: { display: 'block', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#8a9e9a', marginBottom: 7 },
  inp: { width: '100%', padding: '11px 14px', border: '1.5px solid #e8e4dc', borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: '#1a2e2a', background: '#faf8f4', outline: 'none', boxSizing: 'border-box' },

  summary: { background: '#f5f0e8', borderRadius: 12, padding: '18px 20px', marginBottom: 20 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#5a7270', marginBottom: 8 },
  summaryTotal: { fontWeight: 600, fontSize: 16, color: '#1a2e2a', borderTop: '1px solid #e8e4dc', paddingTop: 10, marginTop: 4, marginBottom: 0 },

  submitBtn: { width: '100%', padding: '14px', background: '#2d5a4e', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  notice: { textAlign: 'center', fontSize: 12, color: '#8a9e9a', marginTop: 12 },

  // Bookings list
  sectionTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 400, color: '#1a2e2a', marginBottom: 20 },
  bookingsList: { display: 'flex', flexDirection: 'column', gap: 16 },
  bookingCard: { background: 'white', borderRadius: 16, padding: '24px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' },
  bookingLeft: { display: 'flex', gap: 18, alignItems: 'flex-start', flex: 1 },
  bookingIcon: { fontSize: 36, width: 56, height: 56, background: '#f5f0e8', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bookingRoom: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 400, color: '#1a2e2a', marginBottom: 6 },
  bookingDates: { fontSize: 13, color: '#5a7270', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  bookingMeta: { fontSize: 13, color: '#8a9e9a', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  nightsBadge: { background: '#e8f4f0', color: '#2d5a4e', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  pricePill: { background: '#f5f0e8', color: '#1a2e2a', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  specialReq: { fontSize: 12, color: '#8a9e9a', marginTop: 6, fontStyle: 'italic' },

  bookingRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 },
  statusBadge: { padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' },
  bookingDate: { fontSize: 12, color: '#8a9e9a' },
  cancelBtn: { background: '#fde8e8', color: '#c0392b', border: 'none', padding: '6px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 500 },
  confirmedNote: { fontSize: 11, color: '#8a9e9a', textAlign: 'right' },

  // Empty state
  emptyState: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 20 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyText: { fontSize: 15, color: '#8a9e9a', marginBottom: 24 },

  toast: { position: 'fixed', bottom: 28, right: 28, padding: '14px 22px', borderRadius: 12, fontSize: 14, fontWeight: 500, zIndex: 300, background: '#1a2e2a', color: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' },
};

export default Bookings;