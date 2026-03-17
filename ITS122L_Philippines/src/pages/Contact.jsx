import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import mapImg from '../assets/map.jpg';

const Contact = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return showToast('Please fill in all required fields.', 'error');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'contacts'), { ...form, status: 'unread', createdAt: serverTimestamp() });
      setSuccess(true);
    } catch { showToast('Error sending message. Try again.', 'error'); }
    setSubmitting(false);
  };

  const SOCIALS = [
    { icon: '📘', label: 'Facebook', handle: 'Dfarm & Park', url: 'https://www.facebook.com' },
    { icon: '📸', label: 'Instagram', handle: '@dfarmnpark', url: 'https://www.instagram.com/dfarmnpark' },
    { icon: '𝕏', label: 'Twitter / X', handle: '#dfarm', url: 'https://x.com/hashtag/dfarm' },
    { icon: '🧭', label: 'TripAdvisor', handle: 'DFARM & PARK', url: 'https://www.tripadvisor.com' },
  ];

  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroOverlay} />
        <div style={S.heroContent}>
          <div style={S.badge}>✦ Get In Touch</div>
          <h1 style={S.heroTitle}>Contact <em style={{ color: '#c9a96e', fontStyle: 'italic' }}>Dfarm Resort</em></h1>
          <p style={S.heroSub}>We'd love to hear from you. Reach out for bookings, inquiries, or just to say hello.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={S.tabBar}>
        <div style={S.tabInner}>
          {[
            { id: 'contact', label: '✉️ Contact Us' },
            { id: 'location', label: '📍 Location & Directions' },
          ].map(t => (
            <button key={t.id} style={{ ...S.tab, ...(activeTab === t.id ? S.tabActive : {}) }} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTACT TAB */}
      {activeTab === 'contact' && (
        <div style={S.content}>
          <div style={S.contactGrid}>
            {/* Left — Info */}
            <div style={S.infoCol}>
              <h2 style={S.colTitle}>Resort Information</h2>

              {[
                { icon: '📍', title: 'Address', lines: ['Purok Narra, Baloganon,', 'Masinloc, Zambales, Philippines'] },
                { icon: '📞', title: 'Phone', lines: ['+63 (0) XXX-XXX-XXXX'] },
                { icon: '✉️', title: 'Email', lines: ['info@dfarmresort.com'] },
                { icon: '🕐', title: 'Office Hours', lines: ['Mon – Sun: 8:00 AM – 6:00 PM'] },
              ].map((item, i) => (
                <div key={i} style={S.infoItem}>
                  <div style={S.infoIcon}>{item.icon}</div>
                  <div>
                    <div style={S.infoTitle}>{item.title}</div>
                    {item.lines.map((l, j) => <div key={j} style={S.infoLine}>{l}</div>)}
                  </div>
                </div>
              ))}

              {/* Socials */}
              <div style={S.socialsSection}>
                <div style={S.socialsTitle}>Follow Us</div>
                <div style={S.socialsList}>
                  {SOCIALS.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={S.socialItem}>
                      <span style={S.socialIcon}>{s.icon}</span>
                      <div>
                        <div style={S.socialLabel}>{s.label}</div>
                        <div style={S.socialHandle}>{s.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div style={S.formCol}>
              {success ? (
                <div style={S.successCard}>
                  <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
                  <h2 style={S.successTitle}>Message Sent!</h2>
                  <p style={S.successSub}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button style={S.successBtn} onClick={() => { setSuccess(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div style={S.formCard}>
                  <h2 style={S.formTitle}>Send Us a Message</h2>
                  <div style={S.formRow}>
                    <div style={S.fg}>
                      <label style={S.lbl}>Full Name *</label>
                      <input style={S.inp} placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div style={S.fg}>
                      <label style={S.lbl}>Email Address *</label>
                      <input style={S.inp} type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div style={S.formRow}>
                    <div style={S.fg}>
                      <label style={S.lbl}>Phone Number</label>
                      <input style={S.inp} placeholder="+63 XXX XXX XXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div style={S.fg}>
                      <label style={S.lbl}>Subject</label>
                      <select style={S.inp} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                        <option value="">Select a topic...</option>
                        <option>Room Inquiry</option>
                        <option>Booking Assistance</option>
                        <option>Event / Function Room</option>
                        <option>Feedback</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div style={S.fg}>
                    <label style={S.lbl}>Message *</label>
                    <textarea style={{ ...S.inp, height: 130, resize: 'vertical' }} placeholder="Tell us how we can help..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <button style={{ ...S.submitBtn, opacity: submitting ? 0.7 : 1 }} onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send Message →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOCATION TAB */}
      {activeTab === 'location' && (
        <div style={S.content}>

          {/* Map + address hero row */}
          <div style={S.locationHero}>
            <div style={S.locationInfo}>
              <div style={S.sectionLabel}>You'll Find Us Here</div>
              <h2 style={S.locTitle}>Dfarm Resort & Park</h2>
              <p style={S.locAddress}>📍 Purok Narra, Baloganon, Masinloc, Zambales, Philippines</p>
              <div style={S.locHighlights}>
                <div style={S.locHighlight}><span style={S.locHIcon}>🚗</span><div><strong>~4.5 hrs</strong><br /><span>from Balintawak Toll</span></div></div>
                <div style={S.locHighlight}><span style={S.locHIcon}>📏</span><div><strong>~240 km</strong><br /><span>from Metro Manila</span></div></div>
                <div style={S.locHighlight}><span style={S.locHIcon}>🛣️</span><div><strong>via NLEX–SCTEX</strong><br /><span>North Luzon Expressway</span></div></div>
              </div>
            </div>
            <div style={S.mapImgWrap}>
              <img src={mapImg} alt="Dfarm Resort Map" style={S.mapImg} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              <div style={{ ...S.mapFallback, display: 'none' }}>🗺️<br />map.jpg</div>
            </div>
          </div>

          {/* Directions */}
          <div style={S.directionsGrid}>

            {/* Private Vehicle */}
            <div style={S.dirCard}>
              <div style={S.dirHeader}>
                <span style={S.dirIcon}>🚗</span>
                <h3 style={S.dirTitle}>By Private Vehicle</h3>
              </div>
              <div style={S.dirSteps}>
                {[
                  { step: '1', text: 'Take North Luzon Expressway (NLEX) heading north.' },
                  { step: '2', text: 'Exit at NLEX Dau Toll Plaza (Exit 50) leading to Subic-Clark-Tarlac Expressway (SCTEX).' },
                  { step: '3', text: 'Follow SCTEX towards the tollentrance. Watch for the Hi-way Sign to SUBIC on your LEFT after the toll.' },
                  { step: '4', text: 'Take the SUBIC TIPO Expressway into SBMA. Inside SBMA, follow road signs to ZAMBALES.' },
                  { step: '5', text: 'Use the shortcuts (map triangles) in Zambales — bypass San Antonio, Palauig, and Masinloc town proper via San Marcelino and Iba.' },
                  { step: '6', text: 'In Barrio Inhobol, Masinloc, pass a TOTAL gas station on your left. After the station, watch for a FORK road — take the RIGHT SIDE ROAD to bypass Masinloc town proper.' },
                  { step: '7', text: 'Pass Barrio COLLIAT, cross the bridge to BALOGANON. About 500m after the bridge is a small intersection of Purok Apitong, Yakal, Tanguile and Narra — turn RIGHT to PUROK NARRA.' },
                  { step: '8', text: 'Dfarm is 3 km from the intersection (2 km cemented, 1 km unpaved). At the fork, take the unpaved road, turn LEFT, then LEFT again at the next intersection. Follow the directional signage to DFARM.' },
                ].map(s => (
                  <div key={s.step} style={S.dirStep}>
                    <div style={S.stepNum}>{s.step}</div>
                    <p style={S.stepText}>{s.text}</p>
                  </div>
                ))}
                <div style={S.cautionBox}>
                  ⚠️ <strong>Caution:</strong> Some portions of the road when wet are slippery. Drive safely.
                </div>
              </div>
            </div>

            {/* Public Transport */}
            <div style={S.dirCard}>
              <div style={S.dirHeader}>
                <span style={S.dirIcon}>🚌</span>
                <h3 style={S.dirTitle}>By Public Transportation</h3>
              </div>
              <div style={S.dirSteps}>
                <p style={S.dirIntro}>Take the <strong>Victory Liner Bus</strong> (aircon, Sta. Cruz destination) from any of the following terminals:</p>

                <div style={S.terminalList}>
                  {[
                    { name: 'Caloocan', nums: '(02) 361-1506 / 361-1510 / 364-2926' },
                    { name: 'Sampaloc', nums: '(02) 741-1436' },
                    { name: 'Cubao', nums: '(02) 727-4534' },
                    { name: 'Pasay', nums: '(02) 833-5019 / 833-5020' },
                  ].map((t, i) => (
                    <div key={i} style={S.terminal}>
                      <strong style={{ color: '#1a2e2a' }}>{t.name}</strong>
                      <span style={{ color: '#8a9e9a', fontSize: 13 }}>{t.nums}</span>
                    </div>
                  ))}
                </div>

                <div style={S.busStep}>
                  <div style={S.stepNum}>1</div>
                  <p style={S.stepText}>Board the aircon bus. Ask the conductor to drop you off at <strong>Baloganon, Masinloc crossing</strong>.</p>
                </div>
                <div style={S.busStep}>
                  <div style={S.stepNum}>2</div>
                  <p style={S.stepText}>From the crossing, take a <strong>tricycle to DFARM</strong>. You may call our staff upon arrival for assistance.</p>
                </div>

                <div style={S.fareBox}>
                  <div style={S.fareTitle}>Bus Fare (approx.)</div>
                  <div style={S.fareAmount}>₱390 <span>/person</span></div>
                  <div style={S.fareNote}>Caloocan to Masinloc · Aircon bus</div>
                </div>

                <div style={S.returnBox}>
                  <strong>🔄 Return Trip:</strong> Call Sta. Cruz station for bus schedule:<br />
                  <span style={{ color: '#c9a96e', fontWeight: 600 }}>(047) 831-1337</span>
                </div>
              </div>
            </div>
          </div>

          {/* Socials strip */}
          <div style={S.socialsStrip}>
            <div style={S.socialStripLabel}>Find us on social media</div>
            <div style={S.socialStripRow}>
              {SOCIALS.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={S.socialChip}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#1a2e2a' }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#8a9e9a' }}>{s.handle}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      )}

      {toast && <div style={{ ...S.toast, borderLeft: `4px solid ${toast.type === 'error' ? '#e05a4a' : '#4caf8a'}` }}>{toast.msg}</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        a[style]:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
};

const S = {
  page: { minHeight: '100vh', background: '#f5f0e8', fontFamily: "'DM Sans',sans-serif" },

  hero: { height: '44vh', minHeight: 300, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0d2020,#1a3a2a,#2d5a4e)' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'rgba(10,25,20,0.45)' },
  heroContent: { position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: '0 24px' },
  badge: { display: 'inline-block', background: 'rgba(201,169,110,0.2)', border: '1px solid rgba(201,169,110,0.4)', color: '#c9a96e', padding: '6px 18px', borderRadius: 20, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 },
  heroTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(34px,5vw,58px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 12 },
  heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 },

  tabBar: { background: 'white', borderBottom: '1px solid #f0ece4', position: 'sticky', top: 66, zIndex: 50 },
  tabInner: { maxWidth: 1100, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 0 },
  tab: { padding: '18px 28px', background: 'none', border: 'none', borderBottom: '3px solid transparent', fontSize: 14, color: '#8a9e9a', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 500, transition: 'all 0.2s' },
  tabActive: { color: '#2d5a4e', borderBottom: '3px solid #c9a96e' },

  content: { maxWidth: 1100, margin: '0 auto', padding: '52px 40px' },

  // Contact tab
  contactGrid: { display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 48, alignItems: 'start' },
  infoCol: {},
  colTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400, color: '#1a2e2a', marginBottom: 28 },
  infoItem: { display: 'flex', gap: 16, marginBottom: 22, alignItems: 'flex-start' },
  infoIcon: { width: 42, height: 42, background: '#e8f4f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
  infoTitle: { fontWeight: 600, fontSize: 13, color: '#1a2e2a', marginBottom: 3 },
  infoLine: { fontSize: 14, color: '#5a7270', lineHeight: 1.6 },

  socialsSection: { marginTop: 32, paddingTop: 28, borderTop: '1px solid #f0ece4' },
  socialsTitle: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#c9a96e', marginBottom: 16 },
  socialsList: { display: 'flex', flexDirection: 'column', gap: 10 },
  socialItem: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'white', borderRadius: 12, textDecoration: 'none', border: '1px solid #f0ece4', transition: 'all 0.2s' },
  socialIcon: { fontSize: 22, width: 36, textAlign: 'center' },
  socialLabel: { fontWeight: 600, fontSize: 13, color: '#1a2e2a' },
  socialHandle: { fontSize: 12, color: '#8a9e9a', marginTop: 1 },

  formCol: {},
  formCard: { background: 'white', borderRadius: 20, padding: 36, boxShadow: '0 4px 30px rgba(0,0,0,0.07)' },
  formTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 400, color: '#1a2e2a', marginBottom: 24 },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  fg: { marginBottom: 18 },
  lbl: { display: 'block', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#8a9e9a', marginBottom: 7 },
  inp: { width: '100%', padding: '11px 14px', border: '1.5px solid #e8e4dc', borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: '#1a2e2a', background: '#faf8f4', outline: 'none', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: '14px', background: '#2d5a4e', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.3 },
  successCard: { background: 'white', borderRadius: 20, padding: '60px 36px', textAlign: 'center', boxShadow: '0 4px 30px rgba(0,0,0,0.07)' },
  successTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 400, color: '#1a2e2a', marginBottom: 12 },
  successSub: { color: '#8a9e9a', fontSize: 15, marginBottom: 28, lineHeight: 1.7 },
  successBtn: { background: '#2d5a4e', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },

  // Location tab
  locationHero: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52, alignItems: 'center', marginBottom: 52, background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 4px 30px rgba(0,0,0,0.07)' },
  locationInfo: {},
  sectionLabel: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a96e', marginBottom: 12 },
  locTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 300, color: '#1a2e2a', marginBottom: 10, lineHeight: 1.2 },
  locAddress: { fontSize: 15, color: '#5a7270', marginBottom: 28, lineHeight: 1.6 },
  locHighlights: { display: 'flex', flexDirection: 'column', gap: 14 },
  locHighlight: { display: 'flex', alignItems: 'center', gap: 14 },
  locHIcon: { width: 44, height: 44, background: '#e8f4f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 },
  mapImgWrap: { borderRadius: 18, overflow: 'hidden', height: 360, position: 'relative' },
  mapImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  mapFallback: { width: '100%', height: '100%', background: '#e8f4f0', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, fontSize: 48, color: '#8a9e9a', textAlign: 'center' },

  directionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 48 },
  dirCard: { background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' },
  dirHeader: { background: 'linear-gradient(135deg,#1a2e2a,#2d5a4e)', padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 14 },
  dirIcon: { fontSize: 28 },
  dirTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: 'white' },
  dirSteps: { padding: '28px 28px' },
  dirIntro: { fontSize: 14, color: '#5a7270', marginBottom: 20, lineHeight: 1.7 },
  dirStep: { display: 'flex', gap: 14, marginBottom: 16, alignItems: 'flex-start' },
  busStep: { display: 'flex', gap: 14, marginBottom: 16, alignItems: 'flex-start' },
  stepNum: { width: 26, height: 26, background: '#2d5a4e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 },
  stepText: { fontSize: 14, color: '#5a7270', lineHeight: 1.7, margin: 0 },
  cautionBox: { background: '#fef3e2', border: '1px solid #f0d090', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#8a6030', marginTop: 8 },
  terminalList: { display: 'flex', flexDirection: 'column', gap: 8, background: '#faf8f4', borderRadius: 12, padding: '14px 18px', marginBottom: 20 },
  terminal: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, fontSize: 14 },
  fareBox: { background: 'linear-gradient(135deg,#e8f4f0,#d0ece4)', borderRadius: 14, padding: '18px 22px', marginTop: 20, marginBottom: 16, textAlign: 'center' },
  fareTitle: { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#2d5a4e', marginBottom: 6 },
  fareAmount: { fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: '#1a2e2a', fontWeight: 300, lineHeight: 1 },
  fareNote: { fontSize: 12, color: '#5a7270', marginTop: 4 },
  returnBox: { background: '#f5f0e8', borderRadius: 10, padding: '14px 18px', fontSize: 14, color: '#5a7270', lineHeight: 1.7 },

  socialsStrip: { background: 'white', borderRadius: 20, padding: '32px 36px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' },
  socialStripLabel: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#c9a96e', marginBottom: 20 },
  socialStripRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 },
  socialChip: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#faf8f4', borderRadius: 14, textDecoration: 'none', border: '1px solid #f0ece4', transition: 'all 0.2s' },

  toast: { position: 'fixed', bottom: 28, right: 28, padding: '14px 22px', borderRadius: 12, fontSize: 14, fontWeight: 500, zIndex: 300, background: '#1a2e2a', color: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' },
};

export default Contact;