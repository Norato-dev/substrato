'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'danger' | 'primary';
  };
  duration?: number;
}

interface ToastContextType {
  show: (message: string, variant?: ToastVariant) => void;
  confirm: (message: string, onConfirm: () => void, options?: { confirmLabel?: string; danger?: boolean }) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const show = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, variant, duration: 3500 }]);
    setTimeout(() => remove(id), 3500);
  }, []);

  const confirm = useCallback((message: string, onConfirm: () => void, options?: { confirmLabel?: string; danger?: boolean }) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, {
      id,
      message,
      variant: 'info',
      action: {
        label: options?.confirmLabel ?? 'Confirmar',
        onClick: () => { onConfirm(); remove(id); },
        variant: options?.danger ? 'danger' : 'primary',
      },
    }]);
  }, []);

  const colors: Record<ToastVariant, { bg: string; border: string; text: string }> = {
    success: { bg: 'var(--color-brote)', border: 'var(--color-musgo)', text: 'var(--color-tierra)' },
    error: { bg: '#FAECE7', border: 'var(--color-corteza)', text: 'var(--color-tierra)' },
    info: { bg: 'var(--color-pergamino)', border: 'rgba(13,13,13,0.2)', text: 'var(--color-tierra)' },
  };

  return (
    <ToastContext.Provider value={{ show, confirm }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 9999, maxWidth: '380px' }}>
        {toasts.map(t => {
          const c = colors[t.variant];
          return (
            <div
              key={t.id}
              style={{
                background: c.bg,
                border: `0.5px solid ${c.border}`,
                borderLeft: `3px solid ${c.border}`,
                padding: '14px 18px',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                animation: 'toast-in 0.25s ease-out',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                color: c.text,
              }}
            >
              <div style={{ flex: 1, fontSize: '14px', lineHeight: 1.5 }}>{t.message}</div>
              {t.action && (
                <>
                  <button
                    onClick={() => remove(t.id)}
                    className="mono"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(13,13,13,0.5)', padding: '6px 10px' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={t.action.onClick}
                    className="mono"
                    style={{
                      background: t.action.variant === 'danger' ? 'var(--color-corteza)' : 'var(--color-tierra)',
                      color: 'var(--color-pergamino)',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    {t.action.label}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}