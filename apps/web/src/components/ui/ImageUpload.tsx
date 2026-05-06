'use client';
import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { useToast } from './Toast';

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  shape?: 'square' | 'organic';
}

export default function ImageUpload({ value, onChange, label = 'Subir imagen', shape = 'square' }: Props) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem('substrato_token');
    if (!token) return toast.show('Inicia sesión', 'error');

    setUploading(true);
    try {
      const data = await api.upload.image(file, token);
      onChange(data.url);
      toast.show('Imagen subida', 'success');
    } catch (e: any) {
      toast.show(e.message || 'Error al subir', 'error');
    } finally {
      setUploading(false);
    }
  };

  const radius = shape === 'organic' ? '60% 40% 55% 45% / 45% 55% 40% 60%' : '12px';

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
      {value ? (
        <div style={{ position: 'relative', width: 'fit-content' }}>
          <img src={value} alt="" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: radius }} />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="mono"
            style={{ position: 'absolute', bottom: '-8px', right: '-8px', background: 'var(--color-tierra)', color: 'var(--color-pergamino)', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', cursor: 'pointer' }}
          >
            {uploading ? '...' : 'Cambiar'}
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mono"
          style={{ width: '120px', height: '120px', border: '0.5px dashed rgba(13,13,13,0.3)', borderRadius: radius, background: 'transparent', cursor: 'pointer', color: 'rgba(13,13,13,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {uploading ? 'Subiendo...' : `+ ${label}`}
        </button>
      )}
    </div>
  );
}