'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav
      className="flex justify-between items-center"
      style={{
        padding: '1.5rem clamp(1.5rem, 4vw, 3rem)',
        borderBottom: '0.5px solid rgba(13,13,13,0.12)',
      }}
    >
      <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '20px', letterSpacing: '-0.02em' }}>
        substrato
      </Link>
      <div className="flex gap-8">
        <Link href="/ideas" className="nav-link">Ideas</Link>
        <Link href="/autores" className="nav-link">Autores</Link>
        <Link href="/archivo" className="nav-link">Archivo</Link>
      </div>
      <Link
        href="/escribir"
        className="mono"
        style={{
          background: 'var(--color-tierra)',
          color: 'var(--color-pergamino)',
          padding: '8px 16px',
          borderRadius: '20px',
        }}
      >
        Escribir
      </Link>
    </nav>
  );
}