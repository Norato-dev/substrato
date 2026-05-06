'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { Category } from '@/types';
import { useToast } from '@/components/ui/Toast';
import ImageUpload from '@/components/ui/ImageUpload';


const Editor = dynamic(() => import('@/components/editor/Editor'), { ssr: false });

function EscribirContent() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [postId, setPostId] = useState<string | null>(editId);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState<any>({ type: 'doc', content: [{ type: 'paragraph' }] });
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [coverImage, setCoverImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('substrato_token');
    if (!token) { router.push('/login'); return; }

    api.categories.list().then((cats: any) => setCategories(cats));

    if (editId) {
      api.posts.list({} as any).then((data: any) => {
        const post = data.posts.find((p: any) => p.id === editId);
        if (post) {
          setTitle(post.title);
          setExcerpt(post.excerpt ?? '');
          setContent(post.content);
          setCategoryId(post.categoryId ?? post.category?.id ?? '');
          setStatus(post.status);
          setCoverImage(post.coverImage ?? '');
        }
      });
    }
  }, [editId]);

  const save = async () => {
    const token = localStorage.getItem('substrato_token');
    if (!token) return router.push('/login');
    if (!title || !categoryId) return toast.show('El título y la categoría son requeridos', 'error');

    const finalContent = content ?? { type: 'doc', content: [{ type: 'paragraph' }] };

    if (status === 'PUBLISHED' && !postId) {
      toast.confirm(
        `¿Publicar "${title}" ahora? Será visible para todos.`,
        () => doSave(finalContent, token),
        { confirmLabel: 'Publicar' }
      );
      return;
    }

    doSave(finalContent, token);
  };

  const doSave = async (finalContent: any, token: string) => {
    setSaving(true);
    try {
      let post: any;
      if (postId) {
        post = await api.posts.update(postId, { title, excerpt, content: finalContent, categoryId, status, coverImage, readTime: Math.ceil((JSON.stringify(finalContent).length / 5) / 200) }, token);
      } else {
        post = await api.posts.create({ title, excerpt, content: finalContent, categoryId, status, coverImage, readTime: Math.ceil((JSON.stringify(finalContent).length / 5) / 200) }, token);
        setPostId(post.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.show(status === 'PUBLISHED' ? '🌱 Publicado' : 'Borrador guardado', 'success');
      if (status === 'PUBLISHED') setTimeout(() => router.push('/'), 800);
    } catch (e: any) {
      toast.show(e.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-pergamino)' }}>
      <Navbar />
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 2rem)' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ fontFamily: 'ui-monospace, monospace', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '8px 14px', border: '0.5px solid rgba(13,13,13,0.2)', borderRadius: '20px', background: 'transparent', cursor: 'pointer', color: 'var(--color-tierra)' }}>
            <option value="">Categoría</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value as any)} style={{ fontFamily: 'ui-monospace, monospace', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '8px 14px', border: '0.5px solid rgba(13,13,13,0.2)', borderRadius: '20px', background: 'transparent', cursor: 'pointer', color: 'var(--color-tierra)' }}>
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicar</option>
          </select>
          <div style={{ flex: 1 }} />
          <Link href="/dashboard" style={{ fontFamily: 'ui-monospace, monospace', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '8px 16px', borderRadius: '20px', border: '0.5px solid rgba(13,13,13,0.2)', color: 'var(--color-tierra)' }}>
            ← Dashboard
          </Link>
          <button onClick={save} disabled={saving} style={{ fontFamily: 'ui-monospace, monospace', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '8px 20px', borderRadius: '20px', border: 'none', background: saved ? 'var(--color-musgo)' : 'var(--color-tierra)', color: 'var(--color-pergamino)', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.3s' }}>
            {saving ? 'Guardando...' : saved ? 'Guardado ✓' : status === 'PUBLISHED' ? 'Publicar' : 'Guardar borrador'}
          </button>
        </div>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="El título crece desde aquí..." style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.02em', lineHeight: 1.1, width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--color-tierra)', marginBottom: '1.5rem' }} />
        <input type="text" value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Una bajada que da contexto..." style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '20px', width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'rgba(13,13,13,0.5)', marginBottom: '3rem' }} />
        <div style={{ borderTop: '0.5px solid rgba(13,13,13,0.1)', paddingTop: '2rem' }}>
          <Editor key={editId ?? 'new'} content={content} onChange={setContent} />
        </div>
      </div>
    </main>
  );
}

import Link from 'next/link';
export default function EscribirPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }} className="mono">Cargando editor...</div>}>
      <EscribirContent />
    </Suspense>
  );
}