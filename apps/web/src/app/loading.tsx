import Navbar from '@/components/layout/Navbar';
import { Skeleton, SkeletonBlob } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <main>
      <Navbar />
      <section style={{ display: 'grid', gridTemplateColumns: '1fr', minHeight: '88vh' }} className="lg:grid-cols-12">
        <div style={{ padding: 'clamp(2.5rem, 5vw, 5rem) clamp(1.5rem, 4vw, 4rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="lg:col-span-7">
          <div>
            <Skeleton width="180px" height="11px" style={{ marginBottom: '2rem' }} />
            <Skeleton height="56px" style={{ marginBottom: '12px', maxWidth: '720px' }} />
            <Skeleton height="56px" width="80%" style={{ marginBottom: '2rem' }} />
            <Skeleton height="20px" style={{ marginBottom: '8px', maxWidth: '500px' }} />
            <Skeleton height="20px" width="70%" style={{ maxWidth: '500px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '3rem' }}>
            <SkeletonBlob />
            <div>
              <Skeleton width="120px" height="14px" style={{ marginBottom: '6px' }} />
              <Skeleton width="160px" height="11px" />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--color-brote)', minHeight: '400px', opacity: 0.5 }} className="lg:col-span-5" />
      </section>
    </main>
  );
}