import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db, auth } from '../firebase/config';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState({ displayName: '', phone: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  useEffect(() => { if (!loading && !user) navigate('/login'); }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setProfile({ displayName: d.displayName || user.displayName || '', phone: d.phone || '', email: user.email || '' });
      }
    };
    load();
  }, [user]);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: profile.displayName,
        phone: profile.phone,
      });
      showToast('✅ Profile updated successfully!');
    } catch (e) { showToast('Error saving profile.', 'error'); }
    setSaving(false);
  };

  const changePassword = async () => {
    if (!passwords.current) return showToast('Enter your current password.', 'error');
    if (passwords.newPass.length < 6) return showToast('New password must be at least 6 characters.', 'error');
    if (passwords.newPass !== passwords.confirm) return showToast('New passwords do not match.', 'error');
    setSaving(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, passwords.current);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwords.newPass);
      setPasswords({ current: '', newPass: '', confirm: '' });
      showToast('✅ Password changed successfully!');
    } catch (e) {
      if (e.code === 'auth/wrong-password') showToast('Current password is incorrect.', 'error');
      else showToast('Error changing password.', 'error');
    }
    setSaving(false);
  };

  if (loading) return <div style={S.loading}>Loading...</div>;

  const initial = (profile.displayName || user?.email || '?')[0].toUpperCase();

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerInner}>
          <div style={S.headerLeft}>
            <div style={S.avatar}>{initial}</div>
            <div>
              <h1 style={S.pageTitle}>{profile.displayName || user?.email?.split('@')[0]}</h1>
              <p style={S.pageSub}>{user?.email}</p>
            </div>
          </div>
          <button style={S.backBtn} onClick={() => navigate('/bookings')}>← My Bookings</button>
        </div>
      </div>

      <div style={S.content}>
        {/* Tabs */}
        <div style={S.tabs}>
          <button style={{ ...S.tab, ...(activeTab === 'profile' ? S.tabActive : {}) }} onClick={() => setActiveTab('profile')}>👤 Profile Info</button>
          <button style={{ ...S.tab, ...(activeTab === 'password' ? S.tabActive : {}) }} onClick={() => setActiveTab('password')}>🔒 Change Password</button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={S.card}>
            <h2 style={S.cardTitle}>Profile Settings</h2>
            <p style={S.cardSub}>Update your personal information below.</p>

            <div style={S.formGrid}>
              <div style={S.fg}>
                <label style={S.lbl}>Display Name</label>
                <input style={S.inp} value={profile.displayName} onChange={e => setProfile({ ...profile, displayName: e.target.value })} placeholder="Your full name" />
              </div>
              <div style={S.fg}>
                <label style={S.lbl}>Phone Number</label>
                <input style={S.inp} value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+63 9XX XXX XXXX" />
              </div>
              <div style={{ ...S.fg, gridColumn: 'span 2' }}>
                <label style={S.lbl}>Email Address</label>
                <input style={{ ...S.inp, ...S.inpDisabled }} value={profile.email} disabled />
                <p style={S.helpText}>Email cannot be changed. Contact support if needed.</p>
              </div>
            </div>

            <div style={S.cardFooter}>
              <button style={{ ...S.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={saveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div style={S.card}>
            <h2 style={S.cardTitle}>Change Password</h2>
            <p style={S.cardSub}>Choose a strong password with at least 6 characters.</p>

            <div style={S.formSingle}>
              <div style={S.fg}>
                <label style={S.lbl}>Current Password</label>
                <input style={S.inp} type="password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} placeholder="••••••••" />
              </div>
              <div style={S.fg}>
                <label style={S.lbl}>New Password</label>
                <input style={S.inp} type="password" value={passwords.newPass} onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} placeholder="••••••••" />
                {passwords.newPass && passwords.newPass.length < 6 && (
                  <p style={{ ...S.helpText, color: '#e05a4a' }}>Must be at least 6 characters</p>
                )}
              </div>
              <div style={S.fg}>
                <label style={S.lbl}>Confirm New Password</label>
                <input style={S.inp} type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="••••••••" />
                {passwords.confirm && passwords.newPass !== passwords.confirm && (
                  <p style={{ ...S.helpText, color: '#e05a4a' }}>Passwords do not match</p>
                )}
                {passwords.confirm && passwords.newPass === passwords.confirm && passwords.confirm.length >= 6 && (
                  <p style={{ ...S.helpText, color: '#4caf8a' }}>✓ Passwords match</p>
                )}
              </div>
            </div>

            <div style={S.cardFooter}>
              <button style={{ ...S.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={changePassword} disabled={saving}>
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        )}

        {/* Account Info card */}
        <div style={S.infoCard}>
          <div style={S.infoRow}>
            <span style={S.infoLabel}>Account Email</span>
            <span style={S.infoValue}>{user?.email}</span>
          </div>
          <div style={S.infoRow}>
            <span style={S.infoLabel}>Account ID</span>
            <span style={{ ...S.infoValue, fontFamily: 'monospace', fontSize: 12 }}>{user?.uid?.slice(0, 16)}...</span>
          </div>
          <div style={S.infoRow}>
            <span style={S.infoLabel}>Member Since</span>
            <span style={S.infoValue}>{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</span>
          </div>
        </div>
      </div>

      {toast && <div style={{ ...S.toast, borderLeft: `4px solid ${toast.type === 'error' ? '#e05a4a' : '#4caf8a'}` }}>{toast.msg}</div>}
    </div>
  );
};

const S = {
  page: { minHeight: '100vh', background: '#f5f0e8', fontFamily: "'DM Sans',sans-serif" },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  header: { background: '#1a2e2a' },
  headerInner: { maxWidth: 800, margin: '0 auto', padding: '40px 40px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 18 },
  avatar: { width: 64, height: 64, background: '#c9a96e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: '#1a2e2a', flexShrink: 0 },
  pageTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300, color: 'white', margin: 0 },
  pageSub: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 },
  backBtn: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '10px 20px', borderRadius: 9, fontSize: 13, cursor: 'pointer' },
  content: { maxWidth: 800, margin: '0 auto', padding: '40px' },
  tabs: { display: 'flex', gap: 8, marginBottom: 28 },
  tab: { padding: '10px 22px', borderRadius: 10, border: 'none', background: 'white', color: '#8a9e9a', fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 1px 6px rgba(0,0,0,0.06)' },
  tabActive: { background: '#1a2e2a', color: 'white' },
  card: { background: 'white', borderRadius: 18, padding: 36, boxShadow: '0 2px 20px rgba(0,0,0,0.07)', marginBottom: 20 },
  cardTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 400, color: '#1a2e2a', marginBottom: 6 },
  cardSub: { color: '#8a9e9a', fontSize: 14, marginBottom: 28 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  formSingle: { maxWidth: 440 },
  fg: { marginBottom: 4 },
  lbl: { display: 'block', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#8a9e9a', marginBottom: 7 },
  inp: { width: '100%', padding: '11px 14px', border: '1.5px solid #e8e4dc', borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: '#1a2e2a', background: '#faf8f4', outline: 'none', boxSizing: 'border-box', marginBottom: 4 },
  inpDisabled: { background: '#f0ece4', color: '#8a9e9a', cursor: 'not-allowed' },
  helpText: { fontSize: 12, color: '#8a9e9a', margin: '2px 0 12px' },
  cardFooter: { borderTop: '1px solid #f0ece4', paddingTop: 24, marginTop: 8 },
  saveBtn: { background: '#2d5a4e', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  infoCard: { background: 'white', borderRadius: 16, padding: '20px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0ece4' },
  infoLabel: { fontSize: 13, color: '#8a9e9a' },
  infoValue: { fontSize: 13, color: '#1a2e2a', fontWeight: 500 },
  toast: { position: 'fixed', bottom: 28, right: 28, padding: '14px 22px', borderRadius: 12, fontSize: 14, fontWeight: 500, zIndex: 300, background: '#1a2e2a', color: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' },
};

export default Profile;