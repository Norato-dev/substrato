import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-pergamino)' }}>
      <Navbar />
      <section style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="organic-blob breathe" style={{ position: 'absolute', width: '60vh', height: '60vh', maxWidth: '700px', maxHeight: '700px', background: 'var(--color-corteza)', top: '-15%', right: '-15%', opacity: 0.3 }} />
        <div className="organic-blob" style={{ position: 'absolute', width: '40vh', height: '40vh', background: 'var(--color-musgo)', bottom: '-10%', left: '-15%', opacity: 0.25 }} />

        <div style={{ position: 'relative', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)', maxWidth: '700px' }}>
          <div className="mono" style={{ color: 'var(--color-corteza)', marginBottom: '2rem' }}>
            404 · No encontrado
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '2rem' }}>
            Esta semilla no <em style={{ color: 'var(--color-corteza)' }}>germinó</em>
          </h1>
          <p className="serif italic" style={{ fontSize: '20px', color: 'rgba(13,13,13,0.6)', marginBottom: '3rem', maxWidth: '480px', lineHeight: 1.4 }}>
            La página que buscas no existe, fue movida, o aún no ha terminado de crecer.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/" className="mono" style={{ background: 'var(--color-tierra)', color: 'var(--color-pergamino)', padding: '12px 24px', borderRadius: '30px' }}>
              ← Volver al inicio
            </Link>
            <Link href="/ideas" className="mono" style={{ border: '0.5px solid rgba(13,13,13,0.2)', padding: '12px 24px', borderRadius: '30px', color: 'var(--color-tierra)' }}>
              Explorar ideas
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}