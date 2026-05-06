import Link from 'next/link';
import { Post } from '@/types';

export default function Hero({ post, sidePosts }: { post: Post; sidePosts: Post[] }) {
  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr', minHeight: '88vh' }} className="hero-grid">
      <div className="hero-left" style={{ padding: 'clamp(2.5rem, 5vw, 5rem) clamp(1.5rem, 4vw, 4rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '0.5px solid rgba(13,13,13,0.12)' }}>
        <div>
          <div className="mono" style={{ color: 'var(--color-musgo)', marginBottom: '2rem' }}>
            Destacado esta semana
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(38px, 5vw, 64px)', marginBottom: '2rem', maxWidth: '720px' }}>
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="serif italic" style={{ fontSize: '20px', color: 'rgba(13,13,13,0.6)', maxWidth: '560px' }}>
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-6 mt-12">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="organic-blob" style={{ width: '36px', height: '36px', background: 'var(--color-musgo)' }} />
              <div>
                <div style={{ fontSize: '13px' }}>{post.author.name}</div>
                <div className="mono" style={{ color: 'rgba(13,13,13,0.4)', textTransform: 'none' }}>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            {post.readTime && (
              <div className="mono" style={{ color: 'rgba(13,13,13,0.35)' }}>
                {post.readTime} min
              </div>
            )}
          </div>
          <Link
            href={`/post/${post.slug}`}
            className="mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '1px solid var(--color-tierra)',
              paddingBottom: '2px',
              width: 'fit-content',
            }}
          >
            Leer artículo →
          </Link>
        </div>
      </div>

      <div className="hero-right" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, background: 'var(--color-brote)', position: 'relative', overflow: 'hidden', minHeight: '400px' }}>
          <div
            className="organic-blob breathe"
            style={{
              position: 'absolute',
              width: '60%',
              height: '60%',
              background: 'var(--color-musgo)',
              top: '20%',
              left: '20%',
              opacity: 0.4,
            }}
          />
        </div>
        <div style={{ borderTop: '0.5px solid rgba(13,13,13,0.12)' }}>
          {sidePosts.map((p, i) => (
            <Link
              key={p.id}
              href={`/post/${p.slug}`}
              className="block hover:bg-black/[0.03] transition-colors"
              style={{
                padding: '1.5rem clamp(1.5rem, 3vw, 2.5rem)',
                borderBottom: i < sidePosts.length - 1 ? '0.5px solid rgba(13,13,13,0.08)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <div>
                <div className="serif" style={{ fontSize: '15px', lineHeight: 1.35, marginBottom: '4px' }}>
                  {p.title}
                </div>
                <div className="mono" style={{ color: 'rgba(13,13,13,0.35)' }}>
                  {p.category.name} · {p.readTime} min
                </div>
              </div>
              <div className="serif" style={{ fontSize: '28px', color: 'rgba(13,13,13,0.08)', lineHeight: 1, flexShrink: 0 }}>
                {String(i + 2).padStart(2, '0')}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}