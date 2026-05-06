'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('substrato_token'));
  }, []);

  const logout = () => {
    localStorage.removeItem('substrato_token');
    setLoggedIn(false);
    setMenuOpen(false);
    setMobileNavOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem clamp(1.25rem, 4vw, 3rem)', borderBottom: '0.5px solid rgba(13,13,13,0.12)', position: 'relative' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '20px', letterSpacing: '-0.02em' }}>
          substrato
        </Link>

        <div className="nav-desktop" style={{ display: 'flex', gap: '2rem' }}>
          <Link href="/ideas" className="nav-link">Ideas</Link>
          <Link href="/autor" className="nav-link">Autores</Link>
          <Link href="/archivo" className="nav-link">Archivo</Link>
        </div>

        <div className="nav-desktop" style={{ display: 'flex', gap: '12px', alignItems: 'center', position: 'relative' }}>
          {loggedIn ? (
            <>
              <Link href="/escribir" className="mono" style={{ background: 'var(--color-tierra)', color: 'var(--color-pergamino)', padding: '8px 16px', borderRadius: '20px' }}>Escribir</Link>
              <button onClick={() => setMenuOpen(!menuOpen)} className="organic-blob" style={{ width: '36px', height: '36px', background: 'var(--color-musgo)', border: 'none', cursor: 'pointer' }} aria-label="Menú" />
              {menuOpen && (
                <>
                  <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--color-pergamino)', border: '0.5px solid rgba(13,13,13,0.15)', borderRadius: '12px', padding: '6px', minWidth: '180px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 50 }}>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>Dashboard</Link>
                    <button onClick={logout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-corteza)', fontSize: '13px', fontFamily: 'inherit' }}>Cerrar sesión</button>
                  </div>
                </>
              )}
            </>
          ) : (
            <Link href="/login" className="mono" style={{ background: 'var(--color-tierra)', color: 'var(--color-pergamino)', padding: '8px 16px', borderRadius: '20px' }}>Entrar</Link>
          )}
        </div>

        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Menú móvil"
          style={{ display: 'none', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', flexDirection: 'column', gap: '4px' }}
        >
          <span style={{ width: '22px', height: '1.5px', background: 'var(--color-tierra)', transition: 'transform 0.25s', transform: mobileNavOpen ? 'rotate(45deg) translateY(4px)' : 'none' }} />
          <span style={{ width: '22px', height: '1.5px', background: 'var(--color-tierra)', opacity: mobileNavOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ width: '22px', height: '1.5px', background: 'var(--color-tierra)', transition: 'transform 0.25s', transform: mobileNavOpen ? 'rotate(-45deg) translateY(-4px)' : 'none' }} />
        </button>
      </nav>

      {mobileNavOpen && (
        <div className="nav-mobile-panel" style={{ display: 'none', flexDirection: 'column', padding: '1.5rem', borderBottom: '0.5px solid rgba(13,13,13,0.12)', background: 'var(--color-pergamino)' }}>
          <Link href="/ideas" onClick={() => setMobileNavOpen(false)} style={{ padding: '12px 0', fontSize: '18px', fontFamily: 'Georgia, serif', borderBottom: '0.5px solid rgba(13,13,13,0.08)' }}>Ideas</Link>
          <Link href="/autor" onClick={() => setMobileNavOpen(false)} style={{ padding: '12px 0', fontSize: '18px', fontFamily: 'Georgia, serif', borderBottom: '0.5px solid rgba(13,13,13,0.08)' }}>Autores</Link>
          <Link href="/archivo" onClick={() => setMobileNavOpen(false)} style={{ padding: '12px 0', fontSize: '18px', fontFamily: 'Georgia, serif', borderBottom: '0.5px solid rgba(13,13,13,0.08)' }}>Archivo</Link>
          {loggedIn ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileNavOpen(false)} style={{ padding: '12px 0', fontSize: '18px', fontFamily: 'Georgia, serif', borderBottom: '0.5px solid rgba(13,13,13,0.08)' }}>Dashboard</Link>
              <Link href="/escribir" onClick={() => setMobileNavOpen(false)} style={{ marginTop: '1rem', background: 'var(--color-tierra)', color: 'var(--color-pergamino)', padding: '12px', borderRadius: '20px', textAlign: 'center', fontFamily: 'ui-monospace, monospace', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Escribir</Link>
              <button onClick={logout} style={{ marginTop: '8px', padding: '12px', borderRadius: '20px', textAlign: 'center', background: 'transparent', border: '0.5px solid var(--color-corteza)', color: 'var(--color-corteza)', cursor: 'pointer', fontFamily: 'ui-monospace, monospace', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Cerrar sesión</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileNavOpen(false)} style={{ marginTop: '1rem', background: 'var(--color-tierra)', color: 'var(--color-pergamino)', padding: '12px', borderRadius: '20px', textAlign: 'center', fontFamily: 'ui-monospace, monospace', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Entrar</Link>
          )}
        </div>
      )}
    </>
  );
}