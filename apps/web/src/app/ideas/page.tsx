'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Post, Category } from '@/types';
import { Skeleton, SkeletonBlob } from '@/components/ui/Skeleton';

export default function IdeasPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.posts.list({ status: 'PUBLISHED' }) as any,
      api.categories.list() as any,
    ]).then(([p, c]) => {
      setPosts(p.posts);
      setCategories(c);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || p.category.id === activeCategory;
    return matchSearch && matchCat;
  });

  const colors: Record<string, string> = {};
  categories.forEach((c, i) => {
    const palette = ['var(--color-musgo)', 'var(--color-corteza)', 'var(--color-liquen)', 'var(--color-polen)'];
    colors[c.id] = palette[i % palette.length];
  });

  return (
    <main>
      <Navbar />
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)', borderBottom: '0.5px solid rgba(13,13,13,0.12)' }}>
        <h1 className="serif" style={{ fontSize: 'clamp(36px, 6vw, 72px)', marginBottom: '2rem' }}>Ideas</h1>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '480px', padding: '12px 20px', border: '0.5px solid rgba(13,13,13,0.2)', borderRadius: '30px', background: 'transparent', fontSize: '15px', outline: 'none', color: 'var(--color-tierra)', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <button
            onClick={() => setActiveCategory('')}
            className="mono"
            style={{ padding: '6px 16px', borderRadius: '20px', border: '0.5px solid rgba(13,13,13,0.2)', background: !activeCategory ? 'var(--color-tierra)' : 'transparent', color: !activeCategory ? 'var(--color-pergamino)' : 'var(--color-tierra)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Todas
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(activeCategory === c.id ? '' : c.id)}
              className="mono"
              style={{ padding: '6px 16px', borderRadius: '20px', border: `0.5px solid ${colors[c.id]}`, background: activeCategory === c.id ? colors[c.id] : 'transparent', color: activeCategory === c.id ? 'var(--color-tierra)' : colors[c.id], cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <div style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        {loading ? (
          <div>
            {[...Array(5)].map((_, i) => (
            <div key={i} style={{ padding: '2rem 0', borderTop: '0.5px solid rgba(13,13,13,0.1)' }}>
                <Skeleton width="100px" height="11px" style={{ marginBottom: '12px' }} />
                <Skeleton height="28px" style={{ marginBottom: '8px', maxWidth: '600px' }} />
                <Skeleton height="14px" width="80%" style={{ marginBottom: '12px' }} />
                <Skeleton width="180px" height="11px" />
            </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <p className="serif italic" style={{ fontSize: '24px', color: 'rgba(13,13,13,0.4)' }}>Nada crece aquí todavía</p>
          </div>
        ) : (
          filtered.map((p, i) => (
            <Link
              key={p.id}
              href={`/post/${p.slug}`}
              style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', padding: '2rem 0', borderTop: '0.5px solid rgba(13,13,13,0.1)', alignItems: 'start' }}
            >
              <div>
                <div className="mono" style={{ color: colors[p.category.id] || 'var(--color-musgo)', marginBottom: '0.75rem' }}>{p.category.name}</div>
                <h2 className="serif" style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', marginBottom: '0.5rem' }}>{p.title}</h2>
                {p.excerpt && <p style={{ color: 'rgba(13,13,13,0.5)', fontSize: '14px', marginBottom: '0.75rem' }}>{p.excerpt}</p>}
                <div className="mono" style={{ color: 'rgba(13,13,13,0.3)' }}>{p.author.name} · {p.readTime} min</div>
              </div>
              <div className="serif" style={{ fontSize: '48px', color: 'rgba(13,13,13,0.06)', lineHeight: 1, flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}