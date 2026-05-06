import Link from 'next/link';
import { Post } from '@/types';

export default function ArticleFooter({ post }: { post: Post }) {
  return (
    <footer style={{ borderTop: '0.5px solid rgba(13,13,13,0.12)' }}>
      <div
        style={{
          padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
          maxWidth: '720px',
          margin: '0 auto',
          display: 'flex',
          gap: '2rem',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <div className="organic-blob" style={{ width: '80px', height: '80px', background: 'var(--color-musgo)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div className="mono" style={{ color: 'rgba(13,13,13,0.4)', marginBottom: '8px' }}>
            Escrito por
          </div>
          <h3 className="serif" style={{ fontSize: '28px', marginBottom: '8px' }}>
            {post.author.name}
          </h3>
          {post.author.bio && (
            <p style={{ color: 'rgba(13,13,13,0.6)', marginBottom: '1rem' }}>
              {post.author.bio}
            </p>
          )}
          <Link
            href={`/autor/${post.author.username}`}
            className="mono"
            style={{
              borderBottom: '1px solid var(--color-tierra)',
              paddingBottom: '2px',
            }}
          >
            Ver todos sus artículos →
          </Link>
        </div>
      </div>
    </footer>
  );
}