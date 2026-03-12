import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const TAGS = ['All', 'event', 'promo', 'update'];

  const filtered = activeTag === 'All'
    ? announcements
    : announcements.filter(a => a.tag === activeTag);

  const tagStyle = (tag) => {
    if (tag === 'promo')  return { bg: '#fef3e2', color: '#b8934a' };
    if (tag === 'update') return { bg: '#e8eef4', color: '#3a5a7a' };
    return { bg: '#e8f4f0', color: '#2d5a4e' };
  };

  const tagIcon = (tag) => {
    if (tag === 'promo')  return '🎁';
    if (tag === 'update') return '📌';
    return '🌺';
  };

  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroOverlay} />
        <div style={S.heroContent}>
          <div style={S.badge}>✦ Stay Informed</div>
          <h1 style={S.heroTitle}>
            Announcements & <em style={{ color: '#c9a96e', fontStyle: 'italic' }}>Updates</em>
          </h1>
          <p style={S.heroSub}>
            Stay up to date with the latest events, promotions, and news from Dfarm Resort.
          </p>
        </div>
      </div>

      <div style={S.content}>
        {/* Filter tabs */}
        <div style={S.filters}>
          {TAGS.map(t => (
            <button
              key={t}
              style={{ ...S.filterBtn, ...(activeTag === t ? S.filterActive : {}) }}
              onClick={() => setActiveTag(t)}
            >
              {t === 'All' ? '📋 All' : `${tagIcon(t)} ${t.charAt(0).toUpperCase() + t.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={S.empty}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p>Loading announcements...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={S.empty}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
            <p style={{ fontSize: 16, color: '#8a9e9a' }}>
              {activeTag === 'All'
                ? 'No announcements yet. Check back soon!'
                : `No ${activeTag} announcements at the moment.`}
            </p>
          </div>
        )}

        {/* Announcements grid */}
        {!loading && filtered.length > 0 && (
          <div style={S.grid}>
            {filtered.map((a, i) => {
              const tc = tagStyle(a.tag);
              const isFirst = i === 0 && activeTag === 'All';
              return (
                <div key={a.id} style={{ ...S.card, ...(isFirst ? S.cardFeatured : {}) }}>
                  {/* Color band top */}
                  <div style={{ ...S.cardBand, background: tc.color }} />

                  <div style={S.cardBody}>
                    {/* Tag + date row */}
                    <div style={S.cardMeta}>
                      <span style={{ ...S.tagBadge, background: tc.bg, color: tc.color }}>
                        {tagIcon(a.tag)} {a.tag}
                      </span>
                      <span style={S.cardDate}>
                        {a.createdAt?.toDate
                          ? a.createdAt.toDate().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
                          : 'Recently posted'}
                      </span>
                    </div>

                    <h2 style={{ ...S.cardTitle, fontSize: isFirst ? 28 : 20 }}>{a.title}</h2>
                    <p style={S.cardText}>{a.body}</p>

                    {isFirst && (
                      <div style={S.featuredLabel}>✦ Latest Update</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>
    </div>
  );
};

const S = {
  page: { minHeight: '100vh', background: '#f5f0e8', fontFamily: "'DM Sans',sans-serif" },

  hero: { height: '50vh', minHeight: 340, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0d2020,#1a3a2a,#2d5a4e)' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'rgba(10,25,20,0.5)' },
  heroContent: { position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: '0 24px' },
  badge: { display: 'inline-block', background: 'rgba(201,169,110,0.2)', border: '1px solid rgba(201,169,110,0.4)', color: '#c9a96e', padding: '6px 18px', borderRadius: 20, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 },
  heroTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,60px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 14 },
  heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 },

  content: { maxWidth: 1100, margin: '0 auto', padding: '50px 40px' },

  filters: { display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap' },
  filterBtn: { padding: '9px 22px', borderRadius: 30, border: '1.5px solid #e8e4dc', background: 'white', fontSize: 13, color: '#5a7270', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all 0.2s' },
  filterActive: { background: '#1a2e2a', color: 'white', border: '1.5px solid #1a2e2a' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },

  card: { background: 'white', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' },
  cardFeatured: { gridColumn: 'span 3', flexDirection: 'row', boxShadow: '0 4px 32px rgba(0,0,0,0.12)', border: '2px solid #c9a96e' },
  cardBand: { height: 5, flexShrink: 0 },
  cardBody: { padding: '28px 32px', flex: 1 },
  cardMeta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 },
  tagBadge: { padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' },
  cardDate: { fontSize: 12, color: '#b0a890' },
  cardTitle: { fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, color: '#1a2e2a', lineHeight: 1.3, marginBottom: 12 },
  cardText: { fontSize: 14, color: '#5a7270', lineHeight: 1.8 },
  featuredLabel: { marginTop: 20, fontSize: 12, color: '#c9a96e', letterSpacing: 1, textTransform: 'uppercase' },

  empty: { textAlign: 'center', padding: '80px 20px', color: '#8a9e9a', fontSize: 15 },
};

export default Announcements;
