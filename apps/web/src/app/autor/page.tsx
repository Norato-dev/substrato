import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Post } from '@/types';

export const dynamic = 'force-dynamic';

async function getAuthors() {
  try {
    const data: any = await api.posts.list({ status: 'PUBLISHED' });
    const map = new Map<string, { author: Post['author']; count: number; latest: string }>();

    for (const p of data.posts as Post[]) {
      const existing = map.get(p.author.username);
      if (existing) {
        existing.count++;
        if (p.publishedAt && (!existing.latest || p.publishedAt > existing.latest)) {
          existing.latest = p.publishedAt;
        }
      } else {
        map.set(p.author.username, { author: p.author, count: 1, latest: p.publishedAt ?? p.createdAt });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  } catch { return []; }
}

const palette = ['var(--color-musgo)', 'var(--color-corteza)', 'var(--color-liquen)', 'var(--color-polen)'];

export default async function AutoresPage() {
  const authors = await getAuthors();

  return (
    <main>
      <Navbar />
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)', borderBottom: '0.5px solid rgba(13,13,13,0.12)' }}>
        <h1 className="serif" style={{ fontSize: 'clamp(36px, 6vw, 72px)', marginBottom: '1rem' }}>Autores</h1>
        <p className="serif italic" style={{ fontSize: '20px', color: 'rgba(13,13,13,0.5)' }}>
          Las voces que siembran este sustrato
        </p>
      </section>

      {authors.length === 0 ? (
        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
          <p className="serif italic" style={{ fontSize: '24px', color: 'rgba(13,13,13,0.4)' }}>
            Aún no hay autores con artículos publicados
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 0 }}>
          {authors.map((a, i) => {
            const color = palette[a.author.username.length % palette.length];
            return (
              <Link
                key={a.author.username}
                href={`/autor/${a.author.username}`}
                style={{
                  padding: '2.5rem',
                  borderTop: '0.5px solid rgba(13,13,13,0.12)',
                  borderRight: '0.5px solid rgba(13,13,13,0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  transition: 'background 0.2s',
                }}
              >
                <div className="organic-blob breathe" style={{ width: '80px', height: '80px', background: color }} />
                <div>
                  <h2 className="serif" style={{ fontSize: '24px', marginBottom: '4px' }}>{a.author.name}</h2>
                  <div className="mono" style={{ color: 'rgba(13,13,13,0.4)' }}>@{a.author.username}</div>
                </div>
                {a.author.bio && (
                  <p style={{ fontSize: '14px', color: 'rgba(13,13,13,0.6)', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                    {a.author.bio}
                  </p>
                )}
                <div className="mono" style={{ color: color, marginTop: 'auto' }}>
                  {a.count} artículo{a.count !== 1 ? 's' : ''} →
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}