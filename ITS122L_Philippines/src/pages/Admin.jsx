import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import {
  collection, onSnapshot, doc, updateDoc,
  deleteDoc, addDoc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [toast, setToast] = useState(null);
  const [annModal, setAnnModal] = useState(false);
  const [roomModal, setRoomModal] = useState(false);
  const [editAnn, setEditAnn] = useState(null);
  const [editRoom, setEditRoom] = useState(null);
  const [annForm, setAnnForm] = useState({ title: '', body: '', tag: 'event' });
  const [roomForm, setRoomForm] = useState({ name: '', type: 'deluxe', pricePerNight: '', capacity: '', description: '', available: true });

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  // Real-time listeners - updates instantly when new booking comes in
  useEffect(() => {
    const bQ = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubB = onSnapshot(bQ, snap => setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubU = onSnapshot(collection(db, 'users'), snap => setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubA = onSnapshot(collection(db, 'announcements'), snap => setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubR = onSnapshot(collection(db, 'rooms'), snap => setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { unsubB(); unsubU(); unsubA(); unsubR(); };
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = async (id, status) => {
    try { await updateDoc(doc(db, 'bookings', id), { status }); showToast(`Booking ${status}!`); }
    catch { showToast('Error', 'error'); }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try { await deleteDoc(doc(db, 'bookings', id)); showToast('Deleted.'); }
    catch { showToast('Error', 'error'); }
  };

  const saveAnn = async () => {
    if (!annForm.title || !annForm.body) return showToast('Fill all fields', 'error');
    try {
      if (editAnn) { await updateDoc(doc(db, 'announcements', editAnn.id), annForm); showToast('Updated!'); }
      else { await addDoc(collection(db, 'announcements'), { ...annForm, createdAt: serverTimestamp() }); showToast('Published!'); }
      setAnnModal(false); setEditAnn(null); setAnnForm({ title: '', body: '', tag: 'event' });
    } catch { showToast('Error', 'error'); }
  };

  const deleteAnn = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await deleteDoc(doc(db, 'announcements', id)); showToast('Deleted.'); }
    catch { showToast('Error', 'error'); }
  };

  const saveRoom = async () => {
    if (!roomForm.name || !roomForm.pricePerNight) return showToast('Fill all fields', 'error');
    try {
      if (editRoom) { await updateDoc(doc(db, 'rooms', editRoom.id), roomForm); showToast('Updated!'); }
      else { await addDoc(collection(db, 'rooms'), { ...roomForm, createdAt: serverTimestamp() }); showToast('Room added!'); }
      setRoomModal(false); setEditRoom(null);
      setRoomForm({ name: '', type: 'deluxe', pricePerNight: '', capacity: '', description: '', available: true });
    } catch { showToast('Error', 'error'); }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await deleteDoc(doc(db, 'rooms', id)); showToast('Deleted.'); }
    catch { showToast('Error', 'error'); }
  };

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  if (loading) return <div style={S.loading}>Loading...</div>;

  return (
    <div style={S.page}>
      {/* SIDEBAR */}
      <aside style={S.sidebar}>
        <div style={S.sidebarTop}>
          <div style={S.logoIcon}>D</div>
          <div>
            <div style={S.logoText}>Dfarm Resort</div>
            <div style={S.adminBadge}>ADMIN PANEL</div>
          </div>
        </div>
        <nav style={S.nav}>
          {[
            { id: 'bookings', label: 'Bookings', icon: '📋', count: pendingCount },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'announcements', label: 'Announcements', icon: '📢' },
            { id: 'rooms', label: 'Rooms & Services', icon: '🛏️' },
          ].map(t => (
            <button key={t.id} style={{ ...S.navBtn, ...(activeTab === t.id ? S.navActive : {}) }} onClick={() => setActiveTab(t.id)}>
              <span>{t.icon}</span>
              <span style={{ flex: 1 }}>{t.label}</span>
              {t.count > 0 && <span style={S.navDot}>{t.count}</span>}
            </button>
          ))}
        </nav>
        <div style={S.sidebarBot}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={S.ava}>{user?.email?.[0]?.toUpperCase()}</div>
            <div>
              <div style={{ color: 'white', fontSize: 13, fontWeight: 500 }}>{user?.email?.split('@')[0]}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Administrator</div>
            </div>
          </div>
          <button style={S.backBtn} onClick={() => navigate('/')}>← Back to Site</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={S.main}>
        <div style={S.hdr}>
          <div>
            <h1 style={S.title}>
              {activeTab === 'bookings' && '📋 Bookings Management'}
              {activeTab === 'users' && '👥 Users'}
              {activeTab === 'announcements' && '📢 Announcements'}
              {activeTab === 'rooms' && '🛏️ Rooms & Services'}
            </h1>
            <p style={S.sub}>
              {activeTab === 'bookings' && `${pendingCount} pending · ${bookings.filter(b => b.status === 'confirmed').length} confirmed · ${bookings.length} total`}
              {activeTab === 'users' && `${users.length} registered users`}
              {activeTab === 'announcements' && `${announcements.length} announcements`}
              {activeTab === 'rooms' && `${rooms.length} rooms listed`}
            </p>
          </div>
          {activeTab === 'announcements' && <button style={S.addBtn} onClick={() => { setEditAnn(null); setAnnForm({ title: '', body: '', tag: 'event' }); setAnnModal(true); }}>+ New Announcement</button>}
          {activeTab === 'rooms' && <button style={S.addBtn} onClick={() => { setEditRoom(null); setRoomForm({ name: '', type: 'deluxe', pricePerNight: '', capacity: '', description: '', available: true }); setRoomModal(true); }}>+ Add Room</button>}
        </div>

        {/* Stats */}
        {activeTab === 'bookings' && (
          <div style={S.stats}>
            {[
              { l: 'Total Bookings', v: bookings.length, c: '#2d5a4e' },
              { l: 'Pending', v: pendingCount, c: '#c9a96e' },
              { l: 'Confirmed', v: bookings.filter(b => b.status === 'confirmed').length, c: '#4caf8a' },
              { l: 'Cancelled', v: bookings.filter(b => b.status === 'cancelled').length, c: '#e05a4a' },
            ].map((s, i) => (
              <div key={i} style={{ ...S.statCard, borderTop: `4px solid ${s.c}` }}>
                <div style={{ ...S.statN, color: s.c }}>{s.v}</div>
                <div style={S.statL}>{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div style={S.card}>
            {pendingCount > 0 && <div style={S.alert}>🔔 {pendingCount} new booking{pendingCount > 1 ? 's' : ''} waiting for your approval!</div>}
            <div style={{ overflowX: 'auto' }}>
              <table style={S.tbl}>
                <thead><tr>{['Guest', 'Email', 'Room', 'Check-In', 'Check-Out', 'Guests', 'Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {bookings.length === 0
                    ? <tr><td colSpan={8} style={S.empty}>No bookings yet</td></tr>
                    : bookings.map(b => (
                      <tr key={b.id} style={b.status === 'pending' ? { background: '#fffbf3' } : {}}>
                        <td style={S.td}><strong>{b.name || b.guestName || '—'}</strong></td>
                        <td style={S.td}>{b.userEmail || b.email || '—'}</td>
                        <td style={S.td}>{b.roomType || '—'}</td>
                        <td style={S.td}>{b.checkIn || '—'}</td>
                        <td style={S.td}>{b.checkOut || '—'}</td>
                        <td style={S.td}>{b.guests || '—'}</td>
                        <td style={S.td}><span style={{ ...S.badge, ...S[`bst_${b.status}`] }}>{b.status}</span></td>
                        <td style={S.td}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {b.status === 'pending' && <>
                              <button style={S.bOk} onClick={() => updateStatus(b.id, 'confirmed')}>✅ Confirm</button>
                              <button style={S.bNo} onClick={() => updateStatus(b.id, 'cancelled')}>❌ Decline</button>
                            </>}
                            {b.status === 'confirmed' && <button style={S.bNo} onClick={() => updateStatus(b.id, 'cancelled')}>Cancel</button>}
                            <button style={S.bDel} onClick={() => deleteBooking(b.id)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div style={S.card}>
            <div style={{ overflowX: 'auto' }}>
              <table style={S.tbl}>
                <thead><tr>{['Email', 'Role', 'Joined'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {users.length === 0
                    ? <tr><td colSpan={3} style={S.empty}>No users yet</td></tr>
                    : users.map(u => (
                      <tr key={u.id}>
                        <td style={S.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={S.uAva}>{u.email?.[0]?.toUpperCase()}</div>
                            {u.email}
                          </div>
                        </td>
                        <td style={S.td}><span style={{ ...S.badge, ...(u.role === 'admin' ? S.bst_confirmed : S.bst_pending) }}>{u.role || 'guest'}</span></td>
                        <td style={S.td}>{u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : '—'}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
          <div style={S.grid3}>
            {announcements.length === 0 && <div style={S.emptyCard}>No announcements yet. Create your first one!</div>}
            {announcements.map(a => (
              <div key={a.id} style={S.annCard}>
                <span style={{ ...S.tag, ...S[`tag_${a.tag}`] }}>{a.tag}</span>
                <h3 style={S.annTitle}>{a.title}</h3>
                <p style={S.annBody}>{a.body}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button style={S.bEdit} onClick={() => { setEditAnn(a); setAnnForm({ title: a.title, body: a.body, tag: a.tag }); setAnnModal(true); }}>✏️ Edit</button>
                  <button style={S.bDel} onClick={() => deleteAnn(a.id)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ROOMS TAB */}
        {activeTab === 'rooms' && (
          <div style={S.grid3}>
            {rooms.length === 0 && <div style={S.emptyCard}>No rooms yet. Add your first room!</div>}
            {rooms.map(r => (
              <div key={r.id} style={S.annCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={S.annTitle}>{r.name}</h3>
                  <span style={{ ...S.badge, ...(r.available ? S.bst_confirmed : S.bst_cancelled) }}>{r.available ? 'Available' : 'Unavailable'}</span>
                </div>
                <p style={{ fontSize: 12, color: '#8a9e9a', textTransform: 'capitalize', marginBottom: 4 }}>{r.type} · {r.capacity} guests</p>
                <p style={{ fontSize: 22, fontFamily: "'Cormorant Garamond',serif", color: '#2d5a4e', marginBottom: 8 }}>₱{Number(r.pricePerNight || 0).toLocaleString()}/night</p>
                <p style={S.annBody}>{r.description}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button style={S.bEdit} onClick={() => { setEditRoom(r); setRoomForm({ name: r.name, type: r.type, pricePerNight: r.pricePerNight, capacity: r.capacity, description: r.description, available: r.available }); setRoomModal(true); }}>✏️ Edit</button>
                  <button style={S.bDel} onClick={() => deleteRoom(r.id)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ANNOUNCEMENT MODAL */}
      {annModal && (
        <div style={S.ov} onClick={() => setAnnModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h2 style={S.mTitle}>{editAnn ? 'Edit Announcement' : 'New Announcement'}</h2>
            <div style={S.fg}><label style={S.lbl}>Tag</label>
              <select style={S.inp} value={annForm.tag} onChange={e => setAnnForm({ ...annForm, tag: e.target.value })}>
                <option value="event">Event</option><option value="promo">Promotion</option><option value="update">Update</option>
              </select>
            </div>
            <div style={S.fg}><label style={S.lbl}>Title</label>
              <input style={S.inp} placeholder="Title..." value={annForm.title} onChange={e => setAnnForm({ ...annForm, title: e.target.value })} />
            </div>
            <div style={S.fg}><label style={S.lbl}>Body</label>
              <textarea style={{ ...S.inp, height: 100, resize: 'vertical' }} value={annForm.body} onChange={e => setAnnForm({ ...annForm, body: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button style={S.bCan} onClick={() => setAnnModal(false)}>Cancel</button>
              <button style={S.bSave} onClick={saveAnn}>{editAnn ? 'Update' : 'Publish'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ROOM MODAL */}
      {roomModal && (
        <div style={S.ov} onClick={() => setRoomModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h2 style={S.mTitle}>{editRoom ? 'Edit Room' : 'Add Room'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={S.fg}><label style={S.lbl}>Room Name</label><input style={S.inp} placeholder="Beachfront Suite" value={roomForm.name} onChange={e => setRoomForm({ ...roomForm, name: e.target.value })} /></div>
              <div style={S.fg}><label style={S.lbl}>Type</label>
                <select style={S.inp} value={roomForm.type} onChange={e => setRoomForm({ ...roomForm, type: e.target.value })}>
                  <option value="standard">Standard</option><option value="deluxe">Deluxe</option><option value="suite">Suite</option><option value="villa">Villa</option>
                </select>
              </div>
              <div style={S.fg}><label style={S.lbl}>Price/Night (₱)</label><input style={S.inp} type="number" placeholder="4500" value={roomForm.pricePerNight} onChange={e => setRoomForm({ ...roomForm, pricePerNight: e.target.value })} /></div>
              <div style={S.fg}><label style={S.lbl}>Max Guests</label><input style={S.inp} type="number" placeholder="2" value={roomForm.capacity} onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })} /></div>
            </div>
            <div style={S.fg}><label style={S.lbl}>Description</label><textarea style={{ ...S.inp, height: 80, resize: 'vertical' }} value={roomForm.description} onChange={e => setRoomForm({ ...roomForm, description: e.target.value })} /></div>
            <div style={S.fg}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={roomForm.available} onChange={e => setRoomForm({ ...roomForm, available: e.target.checked })} />
                Available for booking
              </label>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button style={S.bCan} onClick={() => setRoomModal(false)}>Cancel</button>
              <button style={S.bSave} onClick={saveRoom}>{editRoom ? 'Update' : 'Add Room'}</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div style={{ ...S.toast, borderLeft: `4px solid ${toast.type === 'error' ? '#e05a4a' : '#4caf8a'}` }}>{toast.msg}</div>}
    </div>
  );
};

const S = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif", background: '#f5f0e8' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  sidebar: { width: 260, background: '#1a2e2a', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 },
  sidebarTop: { display: 'flex', alignItems: 'center', gap: 12, padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 8 },
  logoIcon: { width: 38, height: 38, background: '#c9a96e', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1a2e2a', fontSize: 18, flexShrink: 0 },
  logoText: { color: 'white', fontWeight: 600, fontSize: 16 },
  adminBadge: { background: 'rgba(201,169,110,0.2)', color: '#c9a96e', fontSize: 10, padding: '2px 8px', borderRadius: 10, letterSpacing: 1, marginTop: 3, display: 'inline-block' },
  nav: { flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 3 },
  navBtn: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14, width: '100%', textAlign: 'left' },
  navActive: { background: 'rgba(201,169,110,0.15)', color: '#c9a96e' },
  navDot: { background: '#e05a4a', color: 'white', fontSize: 11, padding: '1px 7px', borderRadius: 10, fontWeight: 600 },
  sidebarBot: { padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' },
  ava: { width: 36, height: 36, background: '#c9a96e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a2e2a', fontWeight: 700, fontSize: 15 },
  uAva: { width: 30, height: 30, background: '#2d5a4e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  backBtn: { width: '100%', padding: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  main: { flex: 1, padding: '36px 40px', overflowY: 'auto' },
  hdr: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 },
  title: { fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 400, color: '#1a2e2a', margin: 0 },
  sub: { color: '#8a9e9a', fontSize: 14, marginTop: 4 },
  addBtn: { background: '#2d5a4e', color: 'white', border: 'none', padding: '10px 22px', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 28 },
  statCard: { background: 'white', borderRadius: 14, padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  statN: { fontSize: 38, fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, lineHeight: 1 },
  statL: { fontSize: 12, color: '#8a9e9a', marginTop: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  alert: { background: '#fffbf0', border: '1px solid #c9a96e55', color: '#8a6a30', padding: '14px 20px', fontSize: 14, fontWeight: 500, margin: '0 0 0px' },
  card: { background: 'white', borderRadius: 16, boxShadow: '0 2px 20px rgba(0,0,0,0.06)', overflow: 'hidden' },
  tbl: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#f5f0e8', padding: '12px 16px', textAlign: 'left', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#8a9e9a', fontWeight: 500, whiteSpace: 'nowrap' },
  td: { padding: '13px 16px', borderBottom: '1px solid #f0ece4', fontSize: 13, color: '#1a2e2a', verticalAlign: 'middle' },
  empty: { padding: 48, textAlign: 'center', color: '#8a9e9a', fontSize: 15 },
  emptyCard: { gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#8a9e9a', fontSize: 15, background: 'white', borderRadius: 16 },
  badge: { padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize', display: 'inline-block' },
  bst_pending: { background: '#fef3e2', color: '#b8934a' },
  bst_confirmed: { background: '#e8f4f0', color: '#2d5a4e' },
  bst_cancelled: { background: '#fde8e8', color: '#c0392b' },
  bOk: { background: '#e8f4f0', color: '#2d5a4e', border: 'none', padding: '5px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontWeight: 500 },
  bNo: { background: '#fde8e8', color: '#c0392b', border: 'none', padding: '5px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontWeight: 500 },
  bDel: { background: '#f5f0e8', color: '#8a9e9a', border: 'none', padding: '5px 10px', borderRadius: 7, fontSize: 12, cursor: 'pointer' },
  bEdit: { background: '#e8eef4', color: '#3a5a7a', border: 'none', padding: '6px 14px', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontWeight: 500 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 },
  annCard: { background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  tag: { display: 'inline-block', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.5, marginBottom: 10 },
  tag_event: { background: '#e8f4f0', color: '#2d5a4e' },
  tag_promo: { background: '#fef3e2', color: '#b8934a' },
  tag_update: { background: '#e8eef4', color: '#3a5a7a' },
  annTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 400, marginBottom: 8, color: '#1a2e2a' },
  annBody: { fontSize: 13, color: '#8a9e9a', lineHeight: 1.6 },
  ov: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' },
  modal: { background: 'white', borderRadius: 20, padding: 36, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' },
  mTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400, color: '#1a2e2a', marginBottom: 24 },
  fg: { marginBottom: 18 },
  lbl: { display: 'block', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#8a9e9a', marginBottom: 7 },
  inp: { width: '100%', padding: '11px 14px', border: '1.5px solid #e8e4dc', borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: '#1a2e2a', background: '#faf8f4', outline: 'none', boxSizing: 'border-box' },
  bCan: { padding: '10px 22px', background: '#f5f0e8', color: '#8a9e9a', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14 },
  bSave: { padding: '10px 22px', background: '#2d5a4e', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500 },
  toast: { position: 'fixed', bottom: 28, right: 28, padding: '14px 22px', borderRadius: 12, fontSize: 14, fontWeight: 500, zIndex: 300, background: '#1a2e2a', color: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' },
};

export default Admin;