'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { Post, User } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');

  useEffect(() => {
    const token = localStorage.getItem('substrato_token');
    if (!token) return router.push('/login') as any;
    Promise.all([
      api.auth.me(token) as any,
      api.posts.list({}) as any,
    ]).then(([u, p]) => {
      setUser(u);
      setPosts(p.posts.filter((post: Post) => post.author.username === u.username));
    }).catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p => p.status === activeTab);
  const colors = ['var(--color-musgo)', 'var(--color-corteza)', 'var(--color-liquen)', 'var(--color-polen)'];
  const color = colors[(user?.username?.length ?? 0) % colors.length];

  const handleDelete = (id: string, title: string) => {
    toast.confirm(
      `¿Eliminar "${title}"? Esta acción no se puede deshacer.`,
      async () => {
        const token = localStorage.getItem('substrato_token')!;
        try {
          await api.posts.delete(id, token);
          setPosts(prev => prev.filter(p => p.id !== id));
          toast.show('Artículo eliminado', 'success');
        } catch (e: any) {
          toast.show(e.message || 'Error al eliminar', 'error');
        }
      },
      { confirmLabel: 'Eliminar', danger: true }
    );
  };

  const handlePublish = (post: Post) => {
    toast.confirm(
      `¿Publicar "${post.title}"? Será visible para todos.`,
      async () => {
        const token = localStorage.getItem('substrato_token')!;
        try {
          const updated: any = await api.posts.update(post.id, { status: 'PUBLISHED' }, token);
          setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'PUBLISHED', slug: updated.slug } : p));
          toast.show('Artículo publicado 🌱', 'success');
          setActiveTab('PUBLISHED');
        } catch (e: any) {
          toast.show(e.message || 'Error al publicar', 'error');
        }
      },
      { confirmLabel: 'Publicar' }
    );
  };

  const handleUnpublish = (post: Post) => {
    toast.confirm(
      `¿Mover "${post.title}" a borradores?`,
      async () => {
        const token = localStorage.getItem('substrato_token')!;
        try {
          await api.posts.update(post.id, { status: 'DRAFT' }, token);
          setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'DRAFT' } : p));
          toast.show('Movido a borradores', 'success');
          setActiveTab('DRAFT');
        } catch (e: any) {
          toast.show(e.message || 'Error', 'error');
        }
      },
      { confirmLabel: 'Mover' }
    );
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--color-pergamino)' }}>
        <Navbar />
        <div style={{ padding: '4rem', textAlign: 'center' }} className="mono">Cargando...</div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-pergamino)' }}>
      <Navbar />
      <section style={{ padding: 'clamp(3rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)', borderBottom: '0.5px solid rgba(13,13,13,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div className="organic-blob" style={{ width: '60px', height: '60px', background: color, flexShrink: 0 }} />
          <div>
            <h1 className="serif" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>{user?.name}</h1>
            <div className="mono" style={{ color: 'rgba(13,13,13,0.4)' }}>@{user?.username} · {user?.role}</div>
          </div>
        </div>
        <Link href="/escribir" className="mono" style={{ background: 'var(--color-tierra)', color: 'var(--color-pergamino)', padding: '10px 20px', borderRadius: '20px' }}>+ Nuevo artículo</Link>
      </section>

      <div style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ display: 'flex', borderBottom: '0.5px solid rgba(13,13,13,0.12)' }}>
          {(['PUBLISHED', 'DRAFT'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="mono"
              style={{
                padding: '1.25rem 1.5rem', background: 'transparent', border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--color-tierra)' : '2px solid transparent',
                cursor: 'pointer', color: activeTab === tab ? 'var(--color-tierra)' : 'rgba(13,13,13,0.4)',
              }}
            >
              {tab === 'PUBLISHED' ? 'Publicados' : 'Borradores'} ({posts.filter(p => p.status === tab).length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <p className="serif italic" style={{ fontSize: '24px', color: 'rgba(13,13,13,0.35)', marginBottom: '1.5rem' }}>
              {activeTab === 'DRAFT' ? 'No tienes borradores' : 'No has publicado nada aún'}
            </p>
            <Link href="/escribir" className="mono" style={{ borderBottom: '1px solid var(--color-musgo)', paddingBottom: '2px' }}>Escribir algo →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map(p => (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', padding: '2rem 0', borderTop: '0.5px solid rgba(13,13,13,0.1)', alignItems: 'center' }}>
                <div>
                  <div className="mono" style={{ color: 'rgba(13,13,13,0.4)', marginBottom: '0.5rem' }}>
                    {p.category.name} · {new Date(p.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="serif" style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', marginBottom: '0.5rem' }}>{p.title}</h2>
                  {p.excerpt && <p style={{ color: 'rgba(13,13,13,0.5)', fontSize: '14px' }}>{p.excerpt}</p>}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                  <Link href={`/escribir?id=${p.id}`} className="mono" style={{ padding: '8px 14px', border: '0.5px solid rgba(13,13,13,0.2)', borderRadius: '20px', fontSize: '11px', color: 'var(--color-tierra)' }}>Editar</Link>
                  {p.status === 'DRAFT' ? (
                    <button onClick={() => handlePublish(p)} className="mono" style={{ padding: '8px 14px', border: 'none', borderRadius: '20px', fontSize: '11px', background: 'var(--color-musgo)', color: 'var(--color-tierra)', cursor: 'pointer' }}>Publicar</button>
                  ) : (
                    <>
                      <Link href={`/post/${p.slug}`} className="mono" style={{ padding: '8px 14px', border: '0.5px solid var(--color-musgo)', borderRadius: '20px', fontSize: '11px', color: 'var(--color-musgo)' }}>Ver →</Link>
                      <button onClick={() => handleUnpublish(p)} className="mono" style={{ padding: '8px 14px', border: '0.5px solid rgba(13,13,13,0.2)', borderRadius: '20px', fontSize: '11px', color: 'rgba(13,13,13,0.6)', background: 'transparent', cursor: 'pointer' }}>Despublicar</button>
                    </>
                  )}
                  <button onClick={() => handleDelete(p.id, p.title)} className="mono" style={{ padding: '8px 14px', border: '0.5px solid var(--color-corteza)', borderRadius: '20px', fontSize: '11px', color: 'var(--color-corteza)', background: 'transparent', cursor: 'pointer' }}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}