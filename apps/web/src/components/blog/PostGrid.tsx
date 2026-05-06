import Link from 'next/link';
import { Post } from '@/types';

export default function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <>
      <div
        className="flex justify-between items-baseline section-divider"
        style={{ padding: '2.5rem clamp(1.5rem, 4vw, 4rem)' }}
      >
        <div className="serif italic" style={{ fontSize: '13px', color: 'rgba(13,13,13,0.4)' }}>
          creciendo ahora
        </div>
        <Link href="/ideas" className="mono" style={{ color: 'var(--color-musgo)' }}>
          Ver todo →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 section-divider">
        {posts.map((p, i) => {
          const sizes = ['22px', '18px', '20px'];
          const colors = [
            { cat: 'var(--color-corteza)', blob: 'var(--color-corteza)' },
            { cat: 'var(--color-liquen)', blob: 'var(--color-liquen)' },
            { cat: 'var(--color-musgo)', blob: 'var(--color-musgo)' },
          ];
          const c = colors[i % 3];
          return (
            <Link
              key={p.id}
              href={`/post/${p.slug}`}
              className="block transition-colors"
              style={{
                padding: 'clamp(2rem, 3vw, 2.5rem)',
                borderRight: i < posts.length - 1 ? '0.5px solid rgba(13,13,13,0.12)' : 'none',
              }}
            >
              <div className="mono" style={{ color: c.cat, marginBottom: '1rem' }}>
                {p.category.name}
              </div>
              <div className="serif" style={{ fontSize: sizes[i % 3], lineHeight: 1.25, marginBottom: '1rem' }}>
                {p.title}
              </div>
              {p.excerpt && (
                <div style={{ fontSize: '13px', color: 'rgba(13,13,13,0.5)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                  {p.excerpt}
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="organic-blob" style={{ width: '24px', height: '24px', background: c.blob }} />
                <div style={{ fontSize: '12px', color: 'rgba(13,13,13,0.5)' }}>
                  {p.author.name} · {p.readTime} min
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}