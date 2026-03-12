import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    const check = async () => {
      const snap = await getDoc(doc(db, 'users', user.uid));
      setIsAdmin(snap.exists() && snap.data().role === 'admin');
    };
    check();
  }, [user]);

  useEffect(() => { setDropdownOpen(false); setMobileOpen(false); }, [location]);

  const handleLogout = async () => {
    try { await logout(); navigate('/'); }
    catch (e) { console.error('Logout error:', e); }
  };

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/announcements', label: 'Announcements' },
    { to: '/testimonials', label: 'Reviews' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav style={{ ...S.nav, ...(transparent ? S.navTransparent : S.navSolid) }}>
        <div style={S.inner}>

          {/* Logo */}
          <Link to="/" style={S.logo}>
            <div style={S.logoIcon}>D</div>
            <span style={{ ...S.logoText, color: transparent ? 'white' : '#1a2e2a' }}>Dfarm Resort</span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={S.links}>
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} style={{
                ...S.link,
                color: transparent ? 'rgba(255,255,255,0.85)' : '#1a2e2a',
                borderBottom: location.pathname === l.to ? '2px solid #c9a96e' : '2px solid transparent',
              }}>
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" style={{
                ...S.link,
                color: '#c9a96e',
                borderBottom: location.pathname === '/admin' ? '2px solid #c9a96e' : '2px solid transparent',
              }}>
                ⚙️ Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div style={S.right}>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  style={{ ...S.userBtn, background: transparent ? 'rgba(255,255,255,0.12)' : '#f5f0e8', color: transparent ? 'white' : '#1a2e2a' }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div style={S.userAvatar}>{user.email?.[0]?.toUpperCase()}</div>
                  <span style={S.userName}>{user.email?.split('@')[0]}</span>
                  <span style={{ fontSize: 9, opacity: 0.5, marginLeft: 2 }}>▼</span>
                </button>

                {dropdownOpen && (
                  <div style={S.dropdown}>
                    <div style={S.dropHead}>
                      <div style={S.dropAvatar}>{user.email?.[0]?.toUpperCase()}</div>
                      <div>
                        <div style={S.dropName}>{user.email?.split('@')[0]}</div>
                        <div style={S.dropEmail}>{user.email}</div>
                      </div>
                    </div>
                    <div style={S.divider} />
                    <Link to="/bookings" style={S.dropItem}>📋 My Bookings</Link>
                    <Link to="/profile" style={S.dropItem}>👤 Profile Settings</Link>
                    <Link to="/testimonials" style={S.dropItem}>⭐ Write a Review</Link>
                    {isAdmin && <>
                      <div style={S.divider} />
                      <Link to="/admin" style={{ ...S.dropItem, color: '#2d5a4e', fontWeight: 600 }}>⚙️ Admin Dashboard</Link>
                    </>}
                    <div style={S.divider} />
                    <button style={S.dropLogout} onClick={handleLogout}>← Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={S.authBtns}>
                <Link to="/login" style={{ ...S.signInLink, color: transparent ? 'rgba(255,255,255,0.85)' : '#1a2e2a' }}>
                  Sign In
                </Link>
                <Link to="/bookings" style={S.bookBtn}>Book Now</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay & drawer (basic) */}
      {dropdownOpen && <div style={S.overlay} onClick={() => setDropdownOpen(false)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        a[style*='dropItem']:hover { background: #f5f0e8 !important; }
      `}</style>
    </>
  );
};

const S = {
  nav: {
    position: 'fixed', top: 0, width: '100%', zIndex: 100,
    transition: 'all 0.35s ease', fontFamily: "'DM Sans',sans-serif",
    boxSizing: 'border-box',
  },
  navTransparent: {
    background: 'transparent', backdropFilter: 'none', boxShadow: 'none',
  },
  navSolid: {
    background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
    boxShadow: '0 2px 28px rgba(0,0,0,0.08)',
  },
  inner: {
    maxWidth: 1200, margin: '0 auto', padding: '0 36px', height: 66,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 },
  logoIcon: { width: 34, height: 34, background: '#c9a96e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: '#1a2e2a', fontSize: 16 },
  logoText: { fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 600, letterSpacing: 0.2 },

  links: { display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' },
  link: { textDecoration: 'none', fontSize: 13.5, fontWeight: 400, letterSpacing: 0.2, padding: '4px 12px', paddingBottom: 3, transition: 'all 0.2s' },

  right: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  authBtns: { display: 'flex', alignItems: 'center', gap: 10 },
  signInLink: { textDecoration: 'none', fontSize: 13.5, fontWeight: 400, padding: '6px 12px' },
  bookBtn: { background: '#c9a96e', color: '#1a2e2a', textDecoration: 'none', padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: 0.2 },

  userBtn: { display: 'flex', alignItems: 'center', gap: 8, border: 'none', borderRadius: 10, padding: '5px 12px 5px 5px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, transition: 'all 0.2s' },
  userAvatar: { width: 28, height: 28, background: '#2d5a4e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 },
  userName: { fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },

  dropdown: { position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: 'white', borderRadius: 16, boxShadow: '0 12px 50px rgba(0,0,0,0.15)', minWidth: 240, overflow: 'hidden', zIndex: 200, border: '1px solid rgba(0,0,0,0.06)' },
  dropHead: { display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', background: '#faf8f4' },
  dropAvatar: { width: 38, height: 38, background: '#2d5a4e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 15, fontWeight: 700, flexShrink: 0 },
  dropName: { fontWeight: 600, fontSize: 14, color: '#1a2e2a' },
  dropEmail: { fontSize: 12, color: '#8a9e9a', marginTop: 1 },
  divider: { height: 1, background: '#f0ece4', margin: '4px 0' },
  dropItem: { display: 'block', padding: '11px 20px', fontSize: 14, color: '#1a2e2a', textDecoration: 'none', transition: 'background 0.15s' },
  dropLogout: { display: 'block', width: '100%', padding: '11px 20px', fontSize: 14, color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans',sans-serif" },

  overlay: { position: 'fixed', inset: 0, zIndex: 99 },
};

export default Navbar;