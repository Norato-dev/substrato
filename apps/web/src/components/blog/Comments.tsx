'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; username?: string; avatar?: string };
  replies?: Comment[];
}

export default function Comments({ postId, initial }: { postId: string; initial: Comment[] }) {
  const toast = useToast();
  const [comments, setComments] = useState<Comment[]>(initial);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('substrato_token') : null;
  const currentUserId = typeof window !== 'undefined' ? JSON.parse(atob(token?.split('.')[1] ?? 'e30=') || '{}').id : null;

  const submit = async (parentId?: string) => {
    const content = parentId ? replyText : text;
    if (!content.trim()) return;
    if (!token) return toast.show('Inicia sesión para comentar', 'error');

    setSubmitting(true);
    try {
      const newComment: any = await api.comments.create({ content, postId, parentId }, token);
      if (parentId) {
        setComments(prev => prev.map(c => c.id === parentId ? { ...c, replies: [...(c.replies || []), newComment] } : c));
        setReplyText('');
        setReplyTo(null);
      } else {
        setComments(prev => [{ ...newComment, replies: [] }, ...prev]);
        setText('');
      }
      toast.show('Comentario publicado', 'success');
    } catch (e: any) {
      toast.show(e.message || 'Error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string, isReply = false, parentId?: string) => {
    toast.confirm('¿Eliminar este comentario?', async () => {
      try {
        await api.comments.delete(id, token!);
        if (isReply && parentId) {
          setComments(prev => prev.map(c => c.id === parentId ? { ...c, replies: c.replies?.filter(r => r.id !== id) } : c));
        } else {
          setComments(prev => prev.filter(c => c.id !== id));
        }
        toast.show('Comentario eliminado', 'success');
      } catch (e: any) {
        toast.show(e.message, 'error');
      }
    }, { confirmLabel: 'Eliminar', danger: true });
  };

  const blob = (name: string) => {
    const palette = ['var(--color-musgo)', 'var(--color-corteza)', 'var(--color-liquen)', 'var(--color-polen)'];
    return palette[name.length % palette.length];
  };

  return (
    <section style={{ borderTop: '0.5px solid rgba(13,13,13,0.12)', padding: 'clamp(3rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)', maxWidth: '720px', margin: '0 auto' }}>
      <div className="serif italic" style={{ fontSize: '13px', color: 'rgba(13,13,13,0.4)', marginBottom: '2rem' }}>
        respuestas · {comments.length}
      </div>

      {token ? (
        <div style={{ marginBottom: '3rem' }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Una idea que crece desde aquí..."
            rows={3}
            style={{ width: '100%', padding: '14px 16px', border: '0.5px solid rgba(13,13,13,0.15)', borderRadius: '10px', background: 'transparent', fontSize: '15px', outline: 'none', color: 'var(--color-tierra)', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              onClick={() => submit()}
              disabled={submitting || !text.trim()}
              className="mono"
              style={{ background: 'var(--color-tierra)', color: 'var(--color-pergamino)', padding: '8px 18px', borderRadius: '20px', border: 'none', cursor: submitting || !text.trim() ? 'not-allowed' : 'pointer', opacity: submitting || !text.trim() ? 0.5 : 1 }}
            >
              {submitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '1.5rem', background: 'var(--color-brote)', borderRadius: '10px', marginBottom: '3rem', textAlign: 'center' }}>
          <Link href="/login" className="mono" style={{ borderBottom: '1px solid var(--color-musgo)' }}>
            Inicia sesión para comentar →
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {comments.map(c => (
          <div key={c.id}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="organic-blob" style={{ width: '36px', height: '36px', background: blob(c.author.name), flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{c.author.name}</div>
                  <div className="mono" style={{ color: 'rgba(13,13,13,0.35)', fontSize: '10px' }}>
                    {new Date(c.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <p style={{ fontSize: '15px', lineHeight: 1.6, marginBottom: '8px' }}>{c.content}</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {token && (
                    <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)} className="mono" style={{ background: 'transparent', border: 'none', color: 'rgba(13,13,13,0.5)', cursor: 'pointer', padding: 0 }}>
                      Responder
                    </button>
                  )}
                  {c.author.id === currentUserId && (
                    <button onClick={() => handleDelete(c.id)} className="mono" style={{ background: 'transparent', border: 'none', color: 'var(--color-corteza)', cursor: 'pointer', padding: 0 }}>
                      Eliminar
                    </button>
                  )}
                </div>

                {replyTo === c.id && (
                  <div style={{ marginTop: '1rem' }}>
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      rows={2}
                      placeholder="Tu respuesta..."
                      style={{ width: '100%', padding: '10px 14px', border: '0.5px solid rgba(13,13,13,0.15)', borderRadius: '8px', background: 'transparent', fontSize: '14px', outline: 'none', color: 'var(--color-tierra)', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button onClick={() => submit(c.id)} disabled={submitting || !replyText.trim()} className="mono" style={{ background: 'var(--color-tierra)', color: 'var(--color-pergamino)', padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '11px' }}>Responder</button>
                      <button onClick={() => { setReplyTo(null); setReplyText(''); }} className="mono" style={{ background: 'transparent', color: 'rgba(13,13,13,0.5)', border: 'none', cursor: 'pointer', fontSize: '11px' }}>Cancelar</button>
                    </div>
                  </div>
                )}

                {c.replies && c.replies.length > 0 && (
                  <div style={{ marginTop: '1.5rem', paddingLeft: '1rem', borderLeft: '0.5px solid rgba(13,13,13,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {c.replies.map(r => (
                      <div key={r.id} style={{ display: 'flex', gap: '10px' }}>
                        <div className="organic-blob" style={{ width: '28px', height: '28px', background: blob(r.author.name), flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '2px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 500 }}>{r.author.name}</div>
                            <div className="mono" style={{ color: 'rgba(13,13,13,0.35)', fontSize: '10px' }}>
                              {new Date(r.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                          <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{r.content}</p>
                          {r.author.id === currentUserId && (
                            <button onClick={() => handleDelete(r.id, true, c.id)} className="mono" style={{ background: 'transparent', border: 'none', color: 'var(--color-corteza)', cursor: 'pointer', padding: 0, marginTop: '4px', fontSize: '10px' }}>
                              Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="serif italic" style={{ color: 'rgba(13,13,13,0.35)', textAlign: 'center', padding: '2rem 0' }}>
            Sé la primera voz en este sustrato
          </p>
        )}
      </div>
    </section>
  );
}