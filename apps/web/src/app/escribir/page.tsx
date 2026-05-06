'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { Category } from '@/types';

const Editor = dynamic(() => import('@/components/editor/Editor'), { ssr: false });

export default function EscribirPage() {
  const [postId, setPostId] = useState<string | null>(null);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState<any>({ type: 'doc', content: [{ type: 'paragraph' }] });
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.categories.list().then((cats: any) => setCategories(cats));
  }, []);

  const save = async () => {
    const token = localStorage.getItem('substrato_token');
    if (!token) return router.push('/login');
    if (!title || !categoryId) return alert('El título y la categoría son requeridos');

    const finalContent = content ?? { type: 'doc', content: [{ type: 'paragraph' }] };

    setSaving(true);
    try {
      let post: any;

      if (postId) {
        post = await api.posts.update(postId, {
          title,
          excerpt,
          content: finalContent,
          categoryId,
          status,
          readTime: Math.ceil((JSON.stringify(finalContent).length / 5) / 200),
        }, token);
      } else {
        post = await api.posts.create({
          title,
          excerpt,
          content: finalContent,
          categoryId,
          status,
          readTime: Math.ceil((JSON.stringify(finalContent).length / 5) / 200),
        }, token);
        setPostId(post.id);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (status === 'PUBLISHED') router.push('/');
    } catch (e: any) {
      alert(e.message || JSON.stringify(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-pergamino)' }}>
      <Navbar />

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 2rem)' }}>

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '11px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '8px 14px',
              border: '0.5px solid rgba(13,13,13,0.2)',
              borderRadius: '20px',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--color-tierra)',
            }}
          >
            <option value="">Categoría</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={e => setStatus(e.target.value as any)}
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '11px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '8px 14px',
              border: '0.5px solid rgba(13,13,13,0.2)',
              borderRadius: '20px',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--color-tierra)',
            }}
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicar</option>
          </select>

          <div style={{ flex: 1 }} />

          <button
            onClick={save}
            disabled={saving}
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '11px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '8px 20px',
              borderRadius: '20px',
              border: 'none',
              background: saved ? 'var(--color-musgo)' : 'var(--color-tierra)',
              color: 'var(--color-pergamino)',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
            }}
          >
            {saving ? 'Guardando...' : saved ? 'Guardado ✓' : status === 'PUBLISHED' ? 'Publicar' : 'Guardar borrador'}
          </button>
        </div>

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="El título crece desde aquí..."
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            width: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--color-tierra)',
            marginBottom: '1.5rem',
          }}
        />

        <input
          type="text"
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="Una bajada que da contexto..."
          style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: '20px',
            width: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'rgba(13,13,13,0.5)',
            marginBottom: '3rem',
          }}
        />

        <div style={{ borderTop: '0.5px solid rgba(13,13,13,0.1)', paddingTop: '2rem' }}>
          <Editor content={content} onChange={setContent} />
        </div>
      </div>
    </main>
  );
}