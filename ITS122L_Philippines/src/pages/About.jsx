import { Link } from 'react-router-dom';
import imgGrounds from '../assets/grounds.jpg';
import imgNature  from '../assets/nature.jpg';


const About = () => {
  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroOverlay} />
        <div style={S.heroContent}>
          <div style={S.badge}>✦ Our Story</div>
          <h1 style={S.heroTitle}>About <em style={{ fontStyle: 'italic', color: '#c9a96e' }}>Dfarm Resort</em></h1>
          <p style={S.heroSub}>A hidden paradise nestled in the heart of nature, built with love and Filipino hospitality.</p>
        </div>
      </div>

      {/* Story section */}
      <section style={S.section}>
        <div style={S.inner}>
          <div style={S.twoCol}>
            <div>
              <div style={S.label}>Our Story</div>
              <h2 style={S.title}>A Sanctuary Born from Nature</h2>
              <p style={S.para}>Dfarm Resort was born from a dream — to create a place where guests could escape the noise of everyday life and reconnect with nature, family, and themselves. Nestled in a serene location, our resort offers an experience that blends the warmth of Filipino hospitality with the peace and beauty of the natural world.</p>
              <p style={S.para}>What started as a small family farm has evolved into a full resort destination, offering accommodations, event venues, breathtaking views, and a genuine sense of belonging for every guest who visits.</p>
              <p style={S.para}>Every corner of Dfarm Resort has been thoughtfully designed to make you feel at home while being surrounded by extraordinary beauty.</p>
            </div>
            <div style={S.imageStack}>
                <div style={{ ...S.imgPlaceholder, backgroundImage: `url(${imgGrounds})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <span style={S.imgCaption}></span>
                    </div>
                    <div style={{ ...S.imgPlaceholder, backgroundImage: `url(${imgNature})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <span style={S.imgCaption}></span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={S.statsSection}>
        <div style={S.inner}>
          <div style={S.statsGrid}>
            {[
              { num: '10+', label: 'Years of Operation', icon: '🏆' },
              { num: '6', label: 'Room & Venue Types', icon: '🛏️' },
              { num: '5★', label: 'Guest Satisfaction', icon: '⭐' },
              { num: '24/7', label: 'Guest Support', icon: '🤝' },
            ].map((s, i) => (
              <div key={i} style={S.statCard}>
                <div style={S.statIcon}>{s.icon}</div>
                <div style={S.statNum}>{s.num}</div>
                <div style={S.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What makes us special */}
      <section style={S.section}>
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={S.label}>Why Choose Us</div>
            <h2 style={S.title}>What Makes Dfarm Special</h2>
          </div>
          <div style={S.featGrid}>
            {[
              { icon: '🌿', title: 'Natural Beauty', desc: 'Surrounded by lush greenery, fresh air, and stunning natural scenery that calms the soul.' },
              { icon: '🏡', title: 'Private Villas', desc: 'Our exclusive villas offer privacy, comfort, and all the amenities you need for a perfect stay.' },
              { icon: '🌅', title: 'Breathtaking Views', desc: 'Wake up to panoramic sea views and sunrises that you will remember for a lifetime.' },
              { icon: '🎉', title: 'Event Ready', desc: 'Host your dream celebration — from intimate gatherings to full events in our function room.' },
              { icon: '🤝', title: 'Filipino Hospitality', desc: 'Our team treats every guest like family, going above and beyond to make your stay perfect.' },
              { icon: '🏊', title: 'Private Infinity Pool', desc: 'Select villas feature a private infinity pool with stunning views — pure luxury.' },
            ].map((f, i) => (
              <div key={i} style={S.featCard}>
                <div style={S.featIcon}>{f.icon}</div>
                <h3 style={S.featTitle}>{f.title}</h3>
                <p style={S.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodations overview */}
      <section style={S.darkSection}>
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ ...S.label, color: '#c9a96e' }}>Our Accommodations</div>
            <h2 style={{ ...S.title, color: 'white' }}>Rooms & Venues</h2>
          </div>
          <div style={S.roomsGrid}>
            {[
              { icon: '🏢', name: 'Tower Room', price: '₱2,500/night', cap: 'Good for 2', desc: '1 queen bed, cable TV, aircon, hot & cold shower, refrigerator' },
              { icon: '🌊', name: 'Sea View', price: '₱2,500/night', cap: 'Good for 2', desc: '1 queen bed, cable TV, aircon, hot & cold shower, refrigerator' },
              { icon: '🌅', name: 'Sea View Premier', price: '₱3,500/night', cap: 'Good for 2', desc: '1 queen bed, cable TV, aircon, hot & cold shower, refrigerator' },
              { icon: '🏡', name: 'Private Villa III', price: '₱10,000/night', cap: 'Good for 8', desc: '2 bedrooms, 4 queen beds, living & dining area, view deck' },
              { icon: '🏰', name: 'Private Villa II', price: '₱22,000/night', cap: 'Good for 12', desc: '3 bedrooms, lanai, private infinity pool' },
              { icon: '🎉', name: 'Function Room', price: '₱15,000/day', cap: 'Up to 50 pax', desc: 'Includes 4 hours aircon, perfect for events and celebrations' },
            ].map((r, i) => (
              <div key={i} style={S.roomRow}>
                <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.1)' }}>
                {r.image
                    ? <img src={r.image} alt={r.value} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{r.icon}</div>
                }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={S.roomRowName}>{r.name}</div>
                  <div style={S.roomRowDesc}>{r.cap} · {r.desc}</div>
                </div>
                <div style={S.roomRowPrice}>{r.price}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/bookings" style={S.ctaBtn}>Reserve Now</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={S.ctaSection}>
        <h2 style={S.ctaTitle}>Come Experience Dfarm Resort</h2>
        <p style={S.ctaSub}>Whether you're looking for a relaxing getaway, a family reunion, or an unforgettable celebration — we have the perfect place for you.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/bookings" style={S.btnGold}>Book Your Stay</Link>
          <Link to="/contact" style={S.btnOutline}>Contact Us</Link>
        </div>
      </section>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
    </div>
  );
};

const S = {
  page: { minHeight: '100vh', fontFamily: "'DM Sans',sans-serif", background: '#faf8f4' },
  hero: { height: '60vh', minHeight: 400, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0d2b24,#1a4a3a,#2d6b55)' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'rgba(10,30,25,0.5)' },
  heroContent: { position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: '0 24px' },
  badge: { display: 'inline-block', background: 'rgba(201,169,110,0.2)', border: '1px solid rgba(201,169,110,0.4)', color: '#c9a96e', padding: '6px 18px', borderRadius: 20, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 },
  heroTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 16 },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 },
  section: { padding: '90px 40px', background: '#faf8f4' },
  darkSection: { padding: '90px 40px', background: '#1a2e2a' },
  ctaSection: { padding: '80px 40px', background: 'linear-gradient(135deg,#2d5a4e,#1a2e2a)', textAlign: 'center' },
  inner: { maxWidth: 1100, margin: '0 auto' },
  label: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a96e', marginBottom: 14 },
  title: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,48px)', fontWeight: 300, color: '#1a2e2a', lineHeight: 1.15, marginBottom: 20 },
  para: { color: '#5a7270', lineHeight: 1.8, fontSize: 15, marginBottom: 16 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' },
  imageStack: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  imgPlaceholder: { height: 200, background: 'linear-gradient(135deg,#2d5a4e,#1a3a30)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 40, gap: 10 },
  imgCaption: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans',sans-serif" },
  statsSection: { background: '#1a2e2a', padding: '60px 40px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 },
  statCard: { background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '32px 24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' },
  statIcon: { fontSize: 28, marginBottom: 12 },
  statNum: { fontFamily: "'Cormorant Garamond',serif", fontSize: 42, color: '#c9a96e', fontWeight: 300, lineHeight: 1 },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 8 },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 },
  featCard: { background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' },
  featIcon: { fontSize: 32, marginBottom: 14 },
  featTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: '#1a2e2a', marginBottom: 10 },
  featDesc: { fontSize: 14, color: '#8a9e9a', lineHeight: 1.7 },
  roomsGrid: { display: 'flex', flexDirection: 'column', gap: 12 },
  roomRow: { display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 22px', border: '1px solid rgba(255,255,255,0.08)' },
  roomRowIcon: { fontSize: 28, width: 48, textAlign: 'center', flexShrink: 0 },
  roomRowName: { fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: 'white', fontWeight: 400, marginBottom: 4 },
  roomRowDesc: { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 },
  roomRowPrice: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: '#c9a96e', fontWeight: 300, flexShrink: 0 },
  ctaTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'white', marginBottom: 14 },
  ctaSub: { color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' },
  btnGold: { background: '#c9a96e', color: '#1a2e2a', padding: '13px 32px', borderRadius: 9, textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-block' },
  btnOutline: { background: 'transparent', color: 'white', padding: '13px 32px', borderRadius: 9, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.3)', display: 'inline-block' },
  ctaBtn: { background: '#c9a96e', color: '#1a2e2a', padding: '13px 32px', borderRadius: 9, textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-block' },
};

export default About;