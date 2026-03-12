import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return showToast('Please fill in name, email, and message.', 'error');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) return showToast('Please enter a valid email address.', 'error');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'contacts'), { ...form, createdAt: serverTimestamp(), status: 'unread' });
      setSent(true);
    } catch { showToast('Error sending message. Please try again.', 'error'); }
    setSubmitting(false);
  };

  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroOverlay} />
        <div style={S.heroContent}>
          <div style={S.badge}>✦ Get in Touch</div>
          <h1 style={S.heroTitle}>Contact <em style={{ color: '#c9a96e', fontStyle: 'italic' }}>Us</em></h1>
          <p style={S.heroSub}>Have a question or want to plan your perfect stay? We'd love to hear from you.</p>
        </div>
      </div>

      <div style={S.content}>
        <div style={S.twoCol}>

          {/* Contact info */}
          <div>
            <div style={S.label}>Reach Out</div>
            <h2 style={S.sectionTitle}>We're Here to Help</h2>
            <p style={S.para}>Whether you have questions about accommodations, want to plan an event, or just want to learn more about Dfarm Resort — our team is ready to assist you.</p>

            <div style={S.infoCards}>
              {[
                { icon: '📍', title: 'Location', lines: ['Dfarm Resort', 'Philippines'] },
                { icon: '📞', title: 'Phone', lines: ['Contact us for reservations', 'and inquiries'] },
                { icon: '✉️', title: 'Email', lines: ['Send us a message below', 'or via our contact form'] },
                { icon: '🕐', title: 'Hours', lines: ['Open daily — 24/7', 'Front desk always available'] },
              ].map((c, i) => (
                <div key={i} style={S.infoCard}>
                  <div style={S.infoIcon}>{c.icon}</div>
                  <div>
                    <div style={S.infoTitle}>{c.title}</div>
                    {c.lines.map((l, j) => <div key={j} style={S.infoLine}>{l}</div>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Social / quick actions */}
            <div style={S.quickActions}>
              <div style={S.qaTitle}>Quick Actions</div>
              <div style={S.qaRow}>
                <a href="/bookings" style={S.qaBtn}>🏖️ Book a Stay</a>
                <a href="/gallery" style={S.qaBtn}>📸 View Gallery</a>
                <a href="/testimonials" style={S.qaBtn}>⭐ Read Reviews</a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div style={S.formCard}>
            {sent ? (
              <div style={S.successState}>
                <div style={S.successIcon}>✅</div>
                <h3 style={S.successTitle}>Message Sent!</h3>
                <p style={S.successText}>Thank you for reaching out. Our team will get back to you as soon as possible.</p>
                <button style={S.resetBtn} onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h3 style={S.formTitle}>Send Us a Message</h3>
                <p style={S.formSub}>We typically respond within 24 hours.</p>

                <div style={S.fieldRow}>
                  <div style={S.fg}>
                    <label style={S.lbl}>Your Name *</label>
                    <input style={S.inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                  </div>
                  <div style={S.fg}>
                    <label style={S.lbl}>Phone Number</label>
                    <input style={S.inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+63 9XX XXX XXXX" />
                  </div>
                </div>

                <div style={S.fg}>
                  <label style={S.lbl}>Email Address *</label>
                  <input style={S.inp} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                </div>

                <div style={S.fg}>
                  <label style={S.lbl}>Subject</label>
                  <select style={S.inp} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                    <option value="">Select a topic...</option>
                    <option>Reservation Inquiry</option>
                    <option>Event / Function Room</option>
                    <option>Rates & Availability</option>
                    <option>Feedback or Concern</option>
                    <option>Other</option>
                  </select>
                </div>

                <div style={S.fg}>
                  <label style={S.lbl}>Message *</label>
                  <textarea style={{ ...S.inp, height: 130, resize: 'vertical' }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help..." />
                </div>

                <button style={{ ...S.submitBtn, opacity: submitting ? 0.7 : 1 }} onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Sending...' : '→ Send Message'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {toast && <div style={{ ...S.toast, borderLeft: `4px solid ${toast.type === 'error' ? '#e05a4a' : '#4caf8a'}` }}>{toast.msg}</div>}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
    </div>
  );
};

const S = {
  page: { minHeight: '100vh', background: '#faf8f4', fontFamily: "'DM Sans',sans-serif" },
  hero: { height: '52vh', minHeight: 360, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2020,#1a3a2a,#2d5a4e)' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'rgba(10,20,18,0.5)' },
  heroContent: { position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: '0 24px' },
  badge: { display: 'inline-block', background: 'rgba(201,169,110,0.2)', border: '1px solid rgba(201,169,110,0.4)', color: '#c9a96e', padding: '6px 18px', borderRadius: 20, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 },
  heroTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,68px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 14 },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 },

  content: { maxWidth: 1100, margin: '0 auto', padding: '70px 40px' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 72, alignItems: 'start' },

  label: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a96e', marginBottom: 12 },
  sectionTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 300, color: '#1a2e2a', lineHeight: 1.1, marginBottom: 16 },
  para: { color: '#5a7270', lineHeight: 1.8, fontSize: 15, marginBottom: 32 },

  infoCards: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 },
  infoCard: { display: 'flex', gap: 14, alignItems: 'flex-start', background: 'white', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 10px rgba(0,0,0,0.05)' },
  infoIcon: { fontSize: 22, width: 38, height: 38, background: '#f5f0e8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoTitle: { fontWeight: 600, fontSize: 13, color: '#1a2e2a', marginBottom: 3 },
  infoLine: { fontSize: 13, color: '#8a9e9a', lineHeight: 1.5 },

  quickActions: { background: '#1a2e2a', borderRadius: 16, padding: '20px 22px' },
  qaTitle: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 },
  qaRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  qaBtn: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', padding: '9px 16px', borderRadius: 9, fontSize: 13, textDecoration: 'none', cursor: 'pointer' },

  formCard: { background: 'white', borderRadius: 20, padding: 40, boxShadow: '0 4px 30px rgba(0,0,0,0.08)' },
  formTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400, color: '#1a2e2a', marginBottom: 6 },
  formSub: { color: '#8a9e9a', fontSize: 14, marginBottom: 28 },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  fg: { marginBottom: 18 },
  lbl: { display: 'block', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#8a9e9a', marginBottom: 7 },
  inp: { width: '100%', padding: '11px 14px', border: '1.5px solid #e8e4dc', borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: '#1a2e2a', background: '#faf8f4', outline: 'none', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: '14px', background: '#1a2e2a', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.5 },

  successState: { textAlign: 'center', padding: '30px 0' },
  successIcon: { fontSize: 52, marginBottom: 16 },
  successTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 400, color: '#1a2e2a', marginBottom: 12 },
  successText: { fontSize: 15, color: '#8a9e9a', lineHeight: 1.7, marginBottom: 28 },
  resetBtn: { background: '#f5f0e8', color: '#1a2e2a', border: 'none', padding: '12px 28px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontFamily: "'DM Sans',sans-serif" },

  toast: { position: 'fixed', bottom: 28, right: 28, padding: '14px 22px', borderRadius: 12, fontSize: 14, fontWeight: 500, zIndex: 300, background: '#1a2e2a', color: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' },
};

export default Contact;