import { Post } from '@/types';

const heroColors = ['var(--color-musgo)', 'var(--color-corteza)', 'var(--color-liquen)', 'var(--color-polen)'];

export default function ArticleHero({ post }: { post: Post }) {
  const color = heroColors[post.title.length % heroColors.length];

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '90vh',
        background: 'var(--color-brote)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div
        className="organic-blob breathe"
        style={{
          position: 'absolute',
          width: '70vh',
          height: '70vh',
          maxWidth: '900px',
          maxHeight: '900px',
          background: color,
          top: '-10%',
          right: '-15%',
          opacity: 0.5,
        }}
      />
      <div
        className="organic-blob"
        style={{
          position: 'absolute',
          width: '40vh',
          height: '40vh',
          background: 'var(--color-musgo)',
          bottom: '-15%',
          left: '-10%',
          opacity: 0.3,
        }}
      />

      <div
        style={{
          position: 'relative',
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 5rem) clamp(3rem, 6vw, 5rem)',
          maxWidth: '1100px',
        }}
      >
        <div className="mono" style={{ color: 'var(--color-tierra)', opacity: 0.6, marginBottom: '2rem' }}>
          {post.category.name}
        </div>
        <h1
          className="serif"
          style={{
            fontSize: 'clamp(40px, 7vw, 96px)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            marginBottom: '2.5rem',
            maxWidth: '14ch',
          }}
        >
          {post.title}
        </h1>
        {post.excerpt && (
          <p
            className="serif italic"
            style={{
              fontSize: 'clamp(18px, 2vw, 24px)',
              color: 'rgba(13,13,13,0.65)',
              maxWidth: '560px',
              lineHeight: 1.4,
            }}
          >
            {post.excerpt}
          </p>
        )}
      </div>

      <div
        style={{
          position: 'relative',
          padding: '1.5rem clamp(1.5rem, 5vw, 5rem)',
          borderTop: '0.5px solid rgba(13,13,13,0.15)',
          background: 'rgba(240,237,230,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="organic-blob" style={{ width: '40px', height: '40px', background: color }} />
          <div>
            <div style={{ fontSize: '14px' }}>{post.author.name}</div>
            <div className="mono" style={{ color: 'rgba(13,13,13,0.5)', textTransform: 'none' }}>
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {post.readTime && (
            <div className="mono" style={{ color: 'rgba(13,13,13,0.5)' }}>
              {post.readTime} min de lectura
            </div>
          )}
          <div className="mono" style={{ color: 'rgba(13,13,13,0.5)' }}>
            {post.views} lecturas
          </div>
        </div>
      </div>
    </section>
  );
}