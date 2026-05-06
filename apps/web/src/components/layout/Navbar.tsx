'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('substrato_token'));
  }, []);

  const logout = () => {
    localStorage.removeItem('substrato_token');
    setLoggedIn(false);
    setMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="flex justify-between items-center" style={{ padding: '1.5rem clamp(1.5rem, 4vw, 3rem)', borderBottom: '0.5px solid rgba(13,13,13,0.12)' }}>
      <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '20px', letterSpacing: '-0.02em' }}>
        substrato
      </Link>
      <div className="flex gap-8">
        <Link href="/ideas" className="nav-link">Ideas</Link>
        <Link href="/autor" className="nav-link">Autores</Link>
        <Link href="/archivo" className="nav-link">Archivo</Link>
      </div>
      <div className="flex gap-3 items-center" style={{ position: 'relative' }}>
        {loggedIn ? (
          <>
            <Link href="/escribir" className="mono" style={{ background: 'var(--color-tierra)', color: 'var(--color-pergamino)', padding: '8px 16px', borderRadius: '20px' }}>
              Escribir
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="organic-blob"
              style={{ width: '36px', height: '36px', background: 'var(--color-musgo)', border: 'none', cursor: 'pointer' }}
              aria-label="Menú"
            />
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--color-pergamino)', border: '0.5px solid rgba(13,13,13,0.15)', borderRadius: '12px', padding: '6px', minWidth: '180px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 50 }}>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="mono" style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', textTransform: 'none', letterSpacing: 'normal', fontSize: '13px', fontFamily: 'inherit' }}>
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="mono"
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-corteza)', textTransform: 'none', letterSpacing: 'normal', fontSize: '13px', fontFamily: 'inherit' }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <Link href="/login" className="mono" style={{ background: 'var(--color-tierra)', color: 'var(--color-pergamino)', padding: '8px 16px', borderRadius: '20px' }}>
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}