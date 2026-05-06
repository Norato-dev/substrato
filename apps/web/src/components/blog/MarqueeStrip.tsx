'use client';

export default function MarqueeStrip({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-inner {
          animation: marquee 18s linear infinite;
          white-space: nowrap;
          display: inline-block;
        }
      `}</style>
      <div style={{ background: 'var(--color-tierra)', overflow: 'hidden', padding: '12px 0', borderTop: '0.5px solid rgba(13,13,13,0.12)', borderBottom: '0.5px solid rgba(13,13,13,0.12)' }}>
        <div className="marquee-inner">
          {doubled.map((item, i) => (
            <span key={i}>
              <span className="mono" style={{ color: 'rgba(240,237,230,0.4)', margin: '0 2rem' }}>{item}</span>
              <span style={{ display: 'inline-block', width: '4px', height: '4px', background: 'var(--color-musgo)', borderRadius: '50%', verticalAlign: 'middle' }} />
            </span>
          ))}
        </div>
      </div>
    </>
  );
}