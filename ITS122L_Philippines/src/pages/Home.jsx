import { ROOMS } from '../data/rooms';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../firebase/config';



const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Load announcements from Firebase
  useEffect(() => {
    const q = query(collection(db, 'announcements'), limit(3));
    const unsub = onSnapshot(q, snap => setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);





  const displayRooms = ROOMS;

  const tagStyle = (tag) => {
    if (tag === 'promo') return { bg: '#fef3e2', color: '#b8934a' };
    if (tag === 'update') return { bg: '#e8eef4', color: '#3a5a7a' };
    return { bg: '#e8f4f0', color: '#2d5a4e' };
  };

  return (
    <div style={S.page}>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroOverlay} />

        {/* Ripple animations */}
        {[1,2,3].map(i => <div key={i} style={{ ...S.ripple, ...S[`ripple${i}`] }} />)}

        <div style={S.heroContent}>
          <div style={S.heroBadge}>✦ Premium Resort Experience</div>
          <h1 style={S.heroTitle}>
            Your <em style={S.heroEm}>Paradise</em><br />Escape Awaits
          </h1>
          <p style={S.heroSub}>
            Discover exclusive villas, world-class amenities, and breathtaking natural beauty at Dfarm Resort.
          </p>
          <div style={S.heroActions}>
            <Link to="/bookings" style={S.btnPrimary}>Book Your Stay</Link>
            <a href="#rooms" style={S.btnOutline}>Explore Rooms</a>
          </div>
        </div>

        <div style={S.scrollHint}>
          <div style={S.scrollLine} />
          <span style={S.scrollText}>Scroll</span>
        </div>
      </section>

      {/* ── QUICK STATS ───────────────────────────────────────────────── */}
      <div style={S.statsBar}>
        {[
          { num: '24+', label: 'Luxury Rooms' },
          { num: '5★', label: 'Guest Rating' },
          { num: '10yr', label: 'Excellence' },
          { num: '24/7', label: 'Concierge' },
        ].map((s, i) => (
            <div key={i} style={S.statItem}>
            <div style={S.statNum}>{s.num}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── ABOUT ─────────────────────────────────────────────────────── */}
      <section style={S.about}>
        <div style={S.sectionInner}>
          <div style={S.aboutGrid}>
            <div style={S.aboutText}>
              <div style={S.sectionLabel}>About Dfarm Resort</div>
              <h2 style={S.sectionTitle}>A Sanctuary of<br />Serenity & Style</h2>
              <p style={S.aboutPara}>Nestled in the heart of nature, Dfarm Resort offers an unparalleled escape from the everyday. Our resort combines the warmth of Filipino hospitality with world-class amenities designed for the modern traveler.</p>
              <p style={S.aboutPara}>From lush gardens to tranquil pools, every corner of Dfarm Resort is crafted to offer peace, beauty, and comfort.</p>
              <Link to="/bookings" style={{ ...S.btnPrimary, display: 'inline-block', marginTop: 12 }}>Reserve Now</Link>
            </div>
            <div style={S.aboutImages}>
            <div style={{ ...S.aboutImg, gridColumn: 'span 2', height: 260, backgroundImage: `url(${ROOMS[3].image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={S.imgLabel}>Private Villa III</div>
            </div>
            <div style={{ ...S.aboutImg, backgroundImage: `url(${ROOMS[0].image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={S.imgLabel}>Tower Room</div>
            </div>
            <div style={{ ...S.aboutImg, backgroundImage: `url(${ROOMS[1].image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={S.imgLabel}>Sea View</div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────── */}
      <section style={S.services}>
        <div style={S.sectionInner}>
          <div style={S.sectionLabel}>What We Offer</div>
          <h2 style={{ ...S.sectionTitle, color: 'white' }}>World-Class Services</h2>
          <p style={S.servicesSub}>Tailored experiences designed to rejuvenate your mind, body, and soul.</p>
          <div style={S.servicesGrid}>
            {[
              { icon: '🧖', title: 'Spa & Wellness', desc: 'Rejuvenate with signature treatments, holistic therapies, and ocean-front yoga.', price: 'From ₱1,500/session' },
              { icon: '🍽️', title: 'Fine Dining', desc: 'Savor gourmet dishes from world-renowned chefs using fresh local ingredients.', price: 'Open 7AM–10PM' },
              { icon: '🗺️', title: 'Private Tours', desc: 'Explore hidden gems with our expert guides and luxury transport.', price: 'From ₱2,500/person' },
              { icon: '🎉', title: 'Event Venues', desc: 'Host your dream wedding or corporate event in our stunning spaces.', price: 'Contact for packages' },
              { icon: '🏊', title: 'Pool & Recreation', desc: 'Infinity pools, water sports, kayaking, and beachfront activities.', price: 'Included with stay' },
              { icon: '🌙', title: '24/7 Concierge', desc: 'Our dedicated team is always ready to assist you any time.', price: 'Always available' },
            ].map((s, i) => (
              <div key={i} style={S.serviceCard}>
                <div style={S.serviceIcon}>{s.icon}</div>
                <h3 style={S.serviceTitle}>{s.title}</h3>
                <p style={S.serviceDesc}>{s.desc}</p>
                <div style={S.servicePrice}>{s.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROOMS ─────────────────────────────────────────────────────── */}
      <section style={S.rooms} id="rooms">
        <div style={S.sectionInner}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 48 }}>
            <div>
              <div style={S.sectionLabel}>Accommodations</div>
              <h2 style={S.sectionTitle}>Our Rooms & Villas</h2>
            </div>
            <Link to="/bookings" style={S.btnPrimary}>View All Rooms</Link>
          </div>
          <div style={S.roomsGrid}>
            {displayRooms.slice(0, 3).map((r, i) => {
              const icons = ['🌿', '🌊', '🏡'];
              const gradients = [
                'linear-gradient(135deg,#2d5a4e,#1a3a30)',
                'linear-gradient(135deg,#1a4a6a,#0d2b44)',
                'linear-gradient(135deg,#5a3a1a,#3a2010)',
              ];
              const badgeColors = [
                { bg: '#c9a96e', color: '#1a2e2a' },
                { bg: '#4a90d9', color: 'white' },
                { bg: '#c9a96e', color: '#1a2e2a' },
              ];
              return (
                <div key={r.value} style={S.roomCard}>
                  <div style={{ ...S.roomImg, backgroundImage: `url(${r.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div style={{ ...S.roomBadge, background: badgeColors[i%3].bg, color: badgeColors[i%3].color }}>
                      {r.badge || r.type}
                    </div>
                  </div>
                  <div style={S.roomBody}>
                    <h3 style={S.roomName}>{r.name || r.value}</h3>
                      <p style={S.roomDesc}>{r.description}</p>
                      <div style={S.roomFeats}>
                        <span style={S.feat}>Up to {r.capacity} guests</span>
                        <span style={S.feat}>Free WiFi</span>
                      </div>
                      <div style={S.roomFooter}>
                        <div style={S.roomPrice}>₱{Number(r.price || r.pricePerNight).toLocaleString()} <span style={S.perNight}>{r.value === 'Function Room' ? '/day' : '/night'}</span></div>
                      <Link to="/bookings" style={S.roomBookBtn}>Book Now</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENTS ─────────────────────────────────────────────── */}
      {announcements.length > 0 && (
        <section style={S.announcements}>
          <div style={S.sectionInner}>
            <div style={S.sectionLabel}>Updates</div>
            <h2 style={S.sectionTitle}>Latest Announcements</h2>
            <div style={S.annGrid}>
              {announcements.map(a => {
                const t = tagStyle(a.tag);
                return (
                  <div key={a.id} style={S.annCard}>
                    <div style={S.annImgPlaceholder}>
                      {a.tag === 'event' ? '🌺' : a.tag === 'promo' ? '💆' : '🔧'}
                    </div>
                    <div style={S.annBody}>
                      <span style={{ ...S.annTag, background: t.bg, color: t.color }}>{a.tag}</span>
                      <h3 style={S.annTitle}>{a.title}</h3>
                      <p style={S.annText}>{a.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section style={S.cta}>
        <h2 style={S.ctaTitle}>Ready for Your Dream Escape?</h2>
        <p style={S.ctaSub}>Book today and enjoy exclusive early-bird rates and complimentary welcome amenities.</p>
        <div style={S.ctaActions}>
          <Link to="/bookings" style={S.btnPrimary}>Reserve Your Stay</Link>
          <a href="#about" style={S.btnOutlineLight}>Learn More</a>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <div style={S.footerGrid}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={S.footerLogo}>D</div>
                <span style={S.footerLogoText}>Dfarm Resort</span>
              </div>
              <p style={S.footerDesc}>Your paradise escape awaits. Experience world-class luxury and Filipino hospitality at its finest.</p>
            </div>
            {[
              { title: 'Resort', links: ['About Us', 'Rooms & Villas', 'Services', 'Gallery'] },
              { title: 'Help', links: ['Support Center', 'Cancellation Policy', 'Safety', 'Contact'] },
              { title: 'Connect', links: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={S.footerColTitle}>{col.title}</h4>
                <ul style={S.footerList}>
                  {col.links.map(l => <li key={l}><a href="#" style={S.footerLink}>{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={S.footerBottom}>
            <span>© 2026 Dfarm Resort. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 24 }}>
              <a href="#" style={S.footerSmLink}>Privacy Policy</a>
              <a href="#" style={S.footerSmLink}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes ripple {
          0% { opacity:0; transform:scale(0.8); }
          50% { opacity:1; }
          100% { opacity:0; transform:scale(1.2); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(40px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes bounce {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50% { transform:translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
};

const S = {
  page: { minHeight: '100vh', fontFamily: "'DM Sans',sans-serif", background: '#faf8f4', color: '#1a2e2a' },

  // Hero
  hero: { height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  heroBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0d2b24 0%,#1a4a3a 40%,#2d6b55 100%)' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(10,30,25,0.3),rgba(10,30,25,0.6))' },
  ripple: { position: 'absolute', borderRadius: '50%', border: '1px solid rgba(201,169,110,0.15)', animation: 'ripple 6s ease-out infinite' },
  ripple1: { width: 200, height: 200, top: '30%', left: '20%', animationDelay: '0s' },
  ripple2: { width: 350, height: 350, top: '20%', left: '15%', animationDelay: '1.5s' },
  ripple3: { width: 500, height: 500, top: '10%', left: '8%', animationDelay: '3s' },
  heroContent: { position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', animation: 'fadeUp 1.2s ease forwards', padding: '0 24px' },
  heroBadge: { display: 'inline-block', background: 'rgba(201,169,110,0.2)', border: '1px solid rgba(201,169,110,0.4)', color: '#c9a96e', padding: '6px 18px', borderRadius: 20, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 },
  heroTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(52px,8vw,96px)', fontWeight: 300, lineHeight: 1.05, marginBottom: 20, letterSpacing: -1 },
  heroEm: { fontStyle: 'italic', color: '#c9a96e' },
  heroSub: { fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 300 },
  heroActions: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  scrollHint: { position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'bounce 2s ease infinite' },
  scrollLine: { width: 1, height: 40, background: 'linear-gradient(to bottom,rgba(255,255,255,0.4),transparent)' },
  scrollText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },

  // Stats bar
  statsBar: { background: 'white', display: 'flex', justifyContent: 'center', gap: 0, boxShadow: '0 4px 30px rgba(0,0,0,0.08)', position: 'relative', zIndex: 10 },
  statItem: { padding: '28px 48px', textAlign: 'center', borderRight: '1px solid #f0ece4' },
  statNum: { fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: '#2d5a4e', fontWeight: 300, lineHeight: 1 },
  statLabel: { fontSize: 12, color: '#8a9e9a', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },

  // Shared
  sectionInner: { maxWidth: 1100, margin: '0 auto' },
  sectionLabel: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a96e', marginBottom: 14 },
  sectionTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,4vw,52px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 20 },

  // About
  about: { background: '#faf8f4', padding: '100px 40px' },
  aboutGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' },
  aboutText: {},
  aboutPara: { color: '#5a7270', lineHeight: 1.8, marginBottom: 14, fontSize: 15 },
  aboutImages: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  aboutImg: { borderRadius: 14, background: 'linear-gradient(135deg,#2d5a4e,#1a3a30)', height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, position: 'relative', color: 'rgba(255,255,255,0.2)' },
  imgLabel: { position: 'absolute', bottom: 14, left: 14, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', color: 'white', padding: '5px 12px', borderRadius: 20, fontSize: 11 },

  // Services
  services: { background: '#1a2e2a', padding: '100px 40px' },
  servicesSub: { color: 'rgba(255,255,255,0.55)', maxWidth: 500, lineHeight: 1.7, fontSize: 15, marginBottom: 56 },
  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 },
  serviceCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, transition: 'all 0.3s', cursor: 'default' },
  serviceIcon: { width: 52, height: 52, background: 'rgba(201,169,110,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 18 },
  serviceTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: 'white', marginBottom: 10 },
  serviceDesc: { color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.7, marginBottom: 14 },
  servicePrice: { fontSize: 12, color: '#c9a96e' },

  // Rooms
  rooms: { background: '#f5f0e8', padding: '100px 40px' },
  roomsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 26 },
  roomCard: { background: 'white', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.07)' },
  roomImg: { height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, position: 'relative', color: 'rgba(255,255,255,0.2)' },
  roomBadge: { position: 'absolute', top: 14, left: 14, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  roomBody: { padding: 24 },
  roomName: { fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, marginBottom: 8 },
  roomDesc: { color: '#8a9e9a', fontSize: 13, lineHeight: 1.6, marginBottom: 14 },
  roomFeats: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 },
  feat: { background: '#f5f0e8', padding: '3px 12px', borderRadius: 20, fontSize: 11, color: '#2d5a4e' },
  roomFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  roomPrice: { fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: '#2d5a4e' },
  perNight: { fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#8a9e9a' },
  roomBookBtn: { background: '#2d5a4e', color: 'white', padding: '8px 20px', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 500 },

  // Announcements
  announcements: { background: 'white', padding: '100px 40px' },
  annGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 48 },
  annCard: { borderRadius: 16, overflow: 'hidden', background: '#f5f0e8' },
  annImgPlaceholder: { height: 150, background: 'linear-gradient(135deg,#2d5a4e,#3a7060)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 },
  annBody: { padding: 24 },
  annTag: { display: 'inline-block', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.5, marginBottom: 10 },
  annTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 400, marginBottom: 8, color: '#1a2e2a' },
  annText: { fontSize: 13, color: '#8a9e9a', lineHeight: 1.6 },

  // CTA
  cta: { background: 'linear-gradient(135deg,#2d5a4e,#1a2e2a)', padding: '90px 40px', textAlign: 'center' },
  ctaTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,60px)', fontWeight: 300, color: 'white', marginBottom: 16 },
  ctaSub: { color: 'rgba(255,255,255,0.65)', fontSize: 16, marginBottom: 36 },
  ctaActions: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },

  // Buttons
  btnPrimary: { background: '#c9a96e', color: '#1a2e2a', padding: '13px 32px', borderRadius: 9, textDecoration: 'none', fontSize: 14, fontWeight: 600, letterSpacing: 0.5, display: 'inline-block' },
  btnOutline: { background: 'transparent', color: 'white', padding: '13px 32px', borderRadius: 9, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.4)', display: 'inline-block' },
  btnOutlineLight: { background: 'transparent', color: 'white', padding: '13px 32px', borderRadius: 9, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.3)', display: 'inline-block' },

  // Footer
  footer: { background: '#1a2e2a', padding: '60px 40px' },
  footerInner: { maxWidth: 1100, margin: '0 auto' },
  footerGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 50, marginBottom: 48 },
  footerLogo: { width: 36, height: 36, background: '#c9a96e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1a2e2a', fontSize: 16 },
  footerLogoText: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: 'white', fontWeight: 600 },
  footerDesc: { color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7, maxWidth: 260, marginTop: 4 },
  footerColTitle: { color: 'white', fontSize: 13, fontWeight: 500, marginBottom: 18, letterSpacing: 0.5 },
  footerList: { listStyle: 'none', padding: 0, margin: 0 },
  footerLink: { color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13, lineHeight: 2.2, display: 'block' },
  footerBottom: { borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)', flexWrap: 'wrap', gap: 12 },
  footerSmLink: { color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 12 },
};

export default Home;