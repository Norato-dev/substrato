'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

export default function ReactionButton({ postId, initialCount = 0 }: { postId: string; initialCount?: number }) {
  const toast = useToast();
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('substrato_token');
    if (!token) return;
    api.reactions.status(postId, token).then((r: any) => {
      setActive(r.active);
      setCount(r.count);
    }).catch(() => {});
  }, [postId]);

  const toggle = async () => {
    const token = localStorage.getItem('substrato_token');
    if (!token) return toast.show('Inicia sesión para reaccionar', 'error');
    if (loading) return;

    setLoading(true);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);

    try {
      const res: any = await api.reactions.toggle(postId, token);
      setActive(res.active);
      setCount(res.count);
    } catch (e: any) {
      toast.show(e.message || 'Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggle}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 20px',
          borderRadius: '30px',
          border: `0.5px solid ${active ? 'var(--color-musgo)' : 'rgba(13,13,13,0.2)'}`,
          background: active ? 'var(--color-brote)' : 'transparent',
          cursor: loading ? 'wait' : 'pointer',
          transition: 'all 0.3s ease',
          color: 'var(--color-tierra)',
          fontFamily: 'inherit',
          fontSize: '14px',
        }}
      >
        <span className={animating ? 'reaction-pop' : ''} style={{ display: 'inline-block', fontSize: '18px', color: active ? 'var(--color-musgo)' : 'rgba(13,13,13,0.4)' }}>
          {active ? '✦' : '✧'}
        </span>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '13px' }}>
          {count} {count === 1 ? 'aprecio' : 'aprecios'}
        </span>
      </button>
      <style>{`
        @keyframes reaction-pop {
          0% { transform: scale(1); }
          30% { transform: scale(1.4) rotate(-12deg); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .reaction-pop { animation: reaction-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </>
  );
}