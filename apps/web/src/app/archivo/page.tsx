import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Post } from '@/types';

async function getAllPosts() {
  try {
    const data: any = await api.posts.list({ status: 'PUBLISHED' });
    return data.posts as Post[];
  } catch { return []; }
}

function groupByMonth(posts: Post[]) {
  const groups = new Map<string, Post[]>();
  for (const p of posts) {
    const date = new Date(p.publishedAt || p.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }
  return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
}

const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const palette = ['var(--color-musgo)', 'var(--color-corteza)', 'var(--color-liquen)', 'var(--color-polen)'];

export default async function ArchivoPage() {
  const posts = await getAllPosts();
  const groups = groupByMonth(posts);

  return (
    <main>
      <Navbar />
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)', borderBottom: '0.5px solid rgba(13,13,13,0.12)' }}>
        <h1 className="serif" style={{ fontSize: 'clamp(36px, 6vw, 72px)', marginBottom: '1rem' }}>Archivo</h1>
        <p className="serif italic" style={{ fontSize: '20px', color: 'rgba(13,13,13,0.5)' }}>
          Todo lo que ha crecido aquí, en orden de aparición
        </p>
        <div className="mono" style={{ color: 'rgba(13,13,13,0.4)', marginTop: '1.5rem' }}>
          {posts.length} artículo{posts.length !== 1 ? 's' : ''} · {groups.length} mes{groups.length !== 1 ? 'es' : ''}
        </div>
      </section>

      {posts.length === 0 ? (
        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
          <p className="serif italic" style={{ fontSize: '24px', color: 'rgba(13,13,13,0.4)' }}>
            El archivo está vacío todavía
          </p>
        </div>
      ) : (
        <div style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          {groups.map(([key, items]) => {
            const [year, month] = key.split('-');
            return (
              <section key={key} style={{ borderTop: '0.5px solid rgba(13,13,13,0.12)', padding: '3rem 0' }}>
                <div className="archivo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'start' }}>
                  <div style={{ position: 'sticky', top: '2rem' }}>
                    <div className="serif" style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1, marginBottom: '4px' }}>
                      {months[parseInt(month) - 1]}
                    </div>
                    <div className="mono" style={{ color: 'rgba(13,13,13,0.4)', fontSize: '14px' }}>
                      {year} · {items.length} artículo{items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div>
                    {items.map((p, i) => {
                      const color = palette[p.author.username.length % palette.length];
                      const date = new Date(p.publishedAt || p.createdAt);
                      return (
                        <Link
                          key={p.id}
                          href={`/post/${p.slug}`}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr',
                            gap: '1.5rem',
                            padding: '1.5rem 0',
                            borderTop: i > 0 ? '0.5px solid rgba(13,13,13,0.08)' : 'none',
                            alignItems: 'baseline',
                          }}
                        >
                          <div className="mono" style={{ color: 'rgba(13,13,13,0.3)', fontSize: '12px', minWidth: '32px' }}>
                            {String(date.getDate()).padStart(2, '0')}
                          </div>
                          <div>
                            <div className="mono" style={{ color: color, marginBottom: '6px' }}>
                              {p.category.name}
                            </div>
                            <h3 className="serif" style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', lineHeight: 1.25, marginBottom: '6px' }}>
                              {p.title}
                            </h3>
                            <div className="mono" style={{ color: 'rgba(13,13,13,0.4)' }}>
                              {p.author.name} · {p.readTime} min
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}