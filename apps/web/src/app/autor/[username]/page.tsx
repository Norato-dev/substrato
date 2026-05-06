import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Post } from '@/types';

async function getAuthorPosts(username: string) {
  try {
    const data: any = await api.posts.list({ status: 'PUBLISHED' });
    return (data.posts as Post[]).filter(p => p.author.username === username);
  } catch { return []; }
}

export default async function AutorPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const posts = await getAuthorPosts(username);

  const author = posts.length > 0 ? posts[0].author : { name: username, username, bio: undefined };
  const colors = ['var(--color-musgo)', 'var(--color-corteza)', 'var(--color-liquen)', 'var(--color-polen)'];
  const color = colors[username.length % colors.length];

  return (
    <main>
      <Navbar />
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)', borderBottom: '0.5px solid rgba(13,13,13,0.12)', display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="organic-blob" style={{ width: '120px', height: '120px', background: color, flexShrink: 0 }} />
        <div>
          <div className="mono" style={{ color: 'rgba(13,13,13,0.4)', marginBottom: '0.75rem' }}>Autor</div>
          <h1 className="serif" style={{ fontSize: 'clamp(36px, 5vw, 64px)', marginBottom: '1rem' }}>{author.name}</h1>
          {author.bio && (
            <p style={{ fontSize: '18px', color: 'rgba(13,13,13,0.6)', maxWidth: '560px', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              {author.bio}
            </p>
          )}
          <div className="mono" style={{ color: 'rgba(13,13,13,0.35)', marginTop: '1rem' }}>
            {posts.length} artículo{posts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      <div style={{ padding: 'clamp(3rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)' }}>
        {posts.length === 0 ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <p className="serif italic" style={{ fontSize: '28px', color: 'rgba(13,13,13,0.35)', marginBottom: '1.5rem' }}>
              Aún no ha sembrado nada
            </p>
            <Link
              href="/escribir"
              className="mono"
              style={{ borderBottom: '1px solid var(--color-musgo)', paddingBottom: '2px', color: 'var(--color-tierra)' }}
            >
              Escribir primer artículo →
            </Link>
          </div>
        ) : (
          <>
            <div className="serif italic" style={{ fontSize: '13px', color: 'rgba(13,13,13,0.4)', marginBottom: '2rem' }}>artículos</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {posts.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/post/${p.slug}`}
                  style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', padding: '2rem 0', borderTop: '0.5px solid rgba(13,13,13,0.1)', alignItems: 'start' }}
                >
                  <div>
                    <div className="mono" style={{ color: color, marginBottom: '0.75rem' }}>{p.category.name}</div>
                    <h2 className="serif" style={{ fontSize: 'clamp(22px, 3vw, 32px)', marginBottom: '0.75rem' }}>{p.title}</h2>
                    {p.excerpt && <p style={{ color: 'rgba(13,13,13,0.5)', fontSize: '15px' }}>{p.excerpt}</p>}
                  </div>
                  <div className="serif" style={{ fontSize: '48px', color: 'rgba(13,13,13,0.06)', lineHeight: 1, flexShrink: 0 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}