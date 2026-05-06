import Navbar from '@/components/layout/Navbar';
import { Skeleton, SkeletonBlob } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <main>
      <Navbar />
      <section style={{ minHeight: '90vh', background: 'var(--color-brote)', opacity: 0.6, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 5rem)' }}>
        <Skeleton width="120px" height="11px" style={{ marginBottom: '2rem' }} />
        <Skeleton height="80px" style={{ marginBottom: '12px', maxWidth: '700px' }} />
        <Skeleton height="80px" width="60%" />
      </section>
      <article style={{ padding: 'clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)', maxWidth: '720px', margin: '0 auto' }}>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} height="20px" style={{ marginBottom: '1rem', width: i % 3 === 2 ? '60%' : '100%' }} />
        ))}
      </article>
    </main>
  );
}