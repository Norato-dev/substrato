'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('substrato_token'));
  }, []);

  return (
    <nav className="flex justify-between items-center" style={{ padding: '1.5rem clamp(1.5rem, 4vw, 3rem)', borderBottom: '0.5px solid rgba(13,13,13,0.12)' }}>
      <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '20px', letterSpacing: '-0.02em' }}>
        substrato
      </Link>
      <div className="flex gap-8">
        <Link href="/ideas" className="nav-link">Ideas</Link>
        <Link href="/autores" className="nav-link">Autores</Link>
        <Link href="/archivo" className="nav-link">Archivo</Link>
      </div>
      <div className="flex gap-3 items-center">
        {loggedIn && (
          <Link href="/dashboard" className="mono" style={{ color: 'rgba(13,13,13,0.5)' }}>
            Dashboard
          </Link>
        )}
        <Link href={loggedIn ? '/escribir' : '/login'} className="mono" style={{ background: 'var(--color-tierra)', color: 'var(--color-pergamino)', padding: '8px 16px', borderRadius: '20px' }}>
          {loggedIn ? 'Escribir' : 'Entrar'}
        </Link>
      </div>
    </nav>
  );
}