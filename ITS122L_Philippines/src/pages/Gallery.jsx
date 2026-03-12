import { useState } from 'react';
import { ROOMS } from '../data/rooms';
import imgPool     from '../assets/pool.jpg';
//import imgSunset   from '../assets/sunset.jpg';
//import imgDeck     from '../assets/deck.jpg';
//import imgGarden   from '../assets/garden.jpg';
//import imgNature   from '../assets/nature.jpg';
//import imgBirthday from '../assets/birthday.jpg';
const CATEGORIES = ['All', 'Rooms', 'Pool & Views', 'Events', 'Nature'];

const EXTRA = [
  { id: 'pool',      category: 'Pool & Views', label: 'Pool',       emoji: '🏊', src: imgPool,     color: '#1a4a6a', span: 2 },
  //{ id: 'sunset',    category: 'Pool & Views', label: 'Sea View Sunset',     emoji: '🌅', src: imgSunset,   color: '#8a4a1a', span: 1 },
  //{ id: 'deck',      category: 'Pool & Views', label: 'View Deck',           emoji: '🌄', src: imgDeck,     color: '#1a3a5a', span: 2 },
  //{ id: 'garden',    category: 'Nature',       label: 'Garden Area',         emoji: '🌺', src: imgGarden,   color: '#3a5a2a', span: 1 },
  //{ id: 'nature',    category: 'Nature',       label: 'Surrounding Nature',  emoji: '🌳', src: imgNature,   color: '#2a4a2a', span: 1 },
  //{ id: 'grounds',   category: 'Nature',       label: 'Resort Grounds',      emoji: '🌿', src: null,        color: '#2d6b3a', span: 1 },
  //{ id: 'birthday',  category: 'Events',       label: 'Birthday Setup',      emoji: '🎂', src: imgBirthday, color: '#5a2a4a', span: 1 },
  //{ id: 'teambuild', category: 'Events',       label: 'Team Building',       emoji: '🤝', src: null,        color: '#3a4a2a', span: 1 },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  // Build room cards from rooms.js — images come automatically from r.image
  const ROOM_CARDS = ROOMS.map(r => ({
    id: r.value,
    category: r.value === 'Function Room' ? 'Events' : 'Rooms',
    label: r.value,
    emoji: r.icon,
    src: r.image || null,
    color: '#2d5a4e',
    span: ['Private Villa II', 'Private Villa III'].includes(r.value) ? 2 : 1,
  }));

  const ALL = [...ROOM_CARDS, ...EXTRA];
  const filtered = activeCategory === 'All' ? ALL : ALL.filter(g => g.category === activeCategory);

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroOverlay} />
        <div style={S.heroContent}>
          <div style={S.badge}>✦ Visual Tour</div>
          <h1 style={S.heroTitle}>Photo <em style={{ color: '#c9a96e', fontStyle: 'italic' }}>Gallery</em></h1>
          <p style={S.heroSub}>Get a glimpse of the beauty and experiences waiting for you at Dfarm Resort</p>
        </div>
      </div>

      <div style={S.content}>
        {/* Category filter */}
        <div style={S.filters}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              style={{ ...S.filterBtn, ...(activeCategory === c ? S.filterActive : {}) }}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={S.grid}>
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setLightbox(item)}
              style={{
                ...S.card,
                gridColumn: `span ${item.span}`,
                ...(item.src
                  ? { backgroundImage: `url(${item.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { background: `linear-gradient(135deg,${item.color},${item.color}99)` }
                ),
              }}
            >
              {!item.src && <div style={S.cardEmoji}>{item.emoji}</div>}
              <div style={S.cardOverlay}>
                <div style={S.cardLabel}>{item.label}</div>
                <div style={S.cardCat}>{item.category}</div>
              </div>
              <div style={S.cardZoom}>🔍</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div style={S.lightboxBg} onClick={() => setLightbox(null)}>
          <div style={S.lightboxCard} onClick={e => e.stopPropagation()}>
            <div style={{
              ...S.lightboxImg,
              ...(lightbox.src
                ? { backgroundImage: `url(${lightbox.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: `linear-gradient(135deg,${lightbox.color},${lightbox.color}99)` }
              ),
            }}>
              {!lightbox.src && <span style={{ fontSize: 80 }}>{lightbox.emoji}</span>}
            </div>
            <div style={S.lightboxInfo}>
              <div style={S.lightboxCategory}>{lightbox.category}</div>
              <div style={S.lightboxLabel}>{lightbox.label}</div>
            </div>
            <button style={S.lightboxClose} onClick={() => setLightbox(null)}>✕ Close</button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>
    </div>
  );
};

const S = {
  page: { minHeight: '100vh', background: '#f5f0e8', fontFamily: "'DM Sans',sans-serif" },
  hero: { height: '52vh', minHeight: 360, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0d2020,#1a3a2a,#2a5a40)' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'rgba(10,25,20,0.5)' },
  heroContent: { position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: '0 24px' },
  badge: { display: 'inline-block', background: 'rgba(201,169,110,0.2)', border: '1px solid rgba(201,169,110,0.4)', color: '#c9a96e', padding: '6px 18px', borderRadius: 20, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 },
  heroTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,68px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 14 },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 },
  content: { maxWidth: 1200, margin: '0 auto', padding: '50px 40px' },
  filters: { display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap' },
  filterBtn: { padding: '9px 22px', borderRadius: 30, border: '1.5px solid #e8e4dc', background: 'white', fontSize: 13, color: '#5a7270', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  filterActive: { background: '#1a2e2a', color: 'white', border: '1.5px solid #1a2e2a' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 60 },
  card: { height: 220, borderRadius: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
  cardEmoji: { fontSize: 52 },
  cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.72))', padding: '30px 18px 16px' },
  cardLabel: { color: 'white', fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 400 },
  cardCat: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 },
  cardZoom: { position: 'absolute', top: 14, right: 14, fontSize: 18, opacity: 0.7 },
  lightboxBg: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  lightboxCard: { background: 'white', borderRadius: 20, overflow: 'hidden', maxWidth: 560, width: '100%' },
  lightboxImg: { height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  lightboxInfo: { padding: '20px 24px 0' },
  lightboxCategory: { fontSize: 11, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 },
  lightboxLabel: { fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: '#1a2e2a', fontWeight: 400 },
  lightboxClose: { display: 'block', width: '100%', padding: '16px', background: 'none', border: 'none', borderTop: '1px solid #f0ece4', marginTop: 20, cursor: 'pointer', fontSize: 14, color: '#8a9e9a', fontFamily: "'DM Sans',sans-serif" },
};

export default Gallery;