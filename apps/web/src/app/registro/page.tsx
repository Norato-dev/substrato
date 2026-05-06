'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', username: '', name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res: any = await api.auth.register(form);
      localStorage.setItem('substrato_token', res.token);
      router.push('/escribir');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = 'text') => (
    <div>
      <label className="mono" style={{ display: 'block', marginBottom: '6px', color: 'rgba(13,13,13,0.5)' }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        required
        style={{ width: '100%', padding: '12px 16px', border: '0.5px solid rgba(13,13,13,0.2)', borderRadius: '10px', background: 'transparent', fontSize: '15px', outline: 'none', color: 'var(--color-tierra)' }}
        onFocus={e => e.target.style.borderColor = 'var(--color-musgo)'}
        onBlur={e => e.target.style.borderColor = 'rgba(13,13,13,0.2)'}
      />
    </div>
  );

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-pergamino)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 1.5rem' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '24px', letterSpacing: '-0.02em', display: 'block', marginBottom: '3rem', textAlign: 'center' }}>substrato</Link>
        <h1 className="serif" style={{ fontSize: '36px', marginBottom: '0.5rem', textAlign: 'center' }}>Únete</h1>
        <p style={{ color: 'rgba(13,13,13,0.5)', marginBottom: '2.5rem', textAlign: 'center', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>El sustrato crece con cada voz nueva</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {field('name', 'Nombre completo')}
          {field('username', 'Username')}
          {field('email', 'Email', 'email')}
          {field('password', 'Contraseña', 'password')}
          {error && <div style={{ color: 'var(--color-corteza)', fontSize: '13px', fontFamily: 'ui-monospace, monospace' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '14px', background: 'var(--color-tierra)', color: 'var(--color-pergamino)', border: 'none', borderRadius: '10px', fontFamily: 'ui-monospace, monospace', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '13px', color: 'rgba(13,13,13,0.4)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" style={{ color: 'var(--color-tierra)', borderBottom: '1px solid var(--color-musgo)' }}>Entra</Link>
        </p>
      </div>
    </main>
  );
}