'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { Post, User, Category } from '@/types';
import { useToast } from '@/components/ui/Toast';
import ImageUpload from '@/components/ui/ImageUpload';
import { Skeleton, SkeletonBlob } from '@/components/ui/Skeleton';

type Tab = 'posts' | 'comments' | 'categories' | 'users' | 'profile';

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>('posts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('substrato_token');
    if (!token) return router.push('/login') as any;
    api.auth.me(token)
      .then((u: any) => {
        setUser(u);
        if (u.role === 'READER') setTab('comments');
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !user) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--color-pergamino)' }}>
        <Navbar />
        <div style={{ padding: '4rem', textAlign: 'center' }} className="mono">Cargando...</div>
      </main>
    );
  }

  const isAdmin = user.role === 'ADMIN';
  const isEditor = user.role === 'EDITOR' || isAdmin;
  const canWrite = user.role !== 'READER';

  const colors = ['var(--color-musgo)', 'var(--color-corteza)', 'var(--color-liquen)', 'var(--color-polen)'];
  const color = colors[user.username.length % colors.length];

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: 'posts', label: 'Mis artículos', show: canWrite },
    { key: 'comments', label: 'Mis comentarios', show: true },
    { key: 'categories', label: 'Categorías', show: isEditor },
    { key: 'users', label: 'Usuarios', show: isAdmin },
    { key: 'profile', label: 'Perfil', show: true },
  ];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-pergamino)' }}>
      <Navbar />

      <section style={{ padding: 'clamp(3rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)', borderBottom: '0.5px solid rgba(13,13,13,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div className="organic-blob" style={{ width: '60px', height: '60px', background: color, flexShrink: 0 }} />
          <div>
            <h1 className="serif" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>{user.name}</h1>
            <div className="mono" style={{ color: 'rgba(13,13,13,0.4)' }}>@{user.username} · {user.role}</div>
          </div>
        </div>
        {canWrite && (
          <Link href="/escribir" className="mono" style={{ background: 'var(--color-tierra)', color: 'var(--color-pergamino)', padding: '10px 20px', borderRadius: '20px' }}>
            + Nuevo artículo
          </Link>
        )}
      </section>

      <div style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ display: 'flex', borderBottom: '0.5px solid rgba(13,13,13,0.12)', overflowX: 'auto' }}>
          {tabs.filter(t => t.show).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="mono"
              style={{
                padding: '1.25rem 1.5rem',
                background: 'transparent',
                border: 'none',
                borderBottom: tab === t.key ? '2px solid var(--color-tierra)' : '2px solid transparent',
                cursor: 'pointer',
                color: tab === t.key ? 'var(--color-tierra)' : 'rgba(13,13,13,0.4)',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '2rem 0' }}>
          {tab === 'posts' && <PostsTab user={user} toast={toast} />}
          {tab === 'comments' && <CommentsTab toast={toast} />}
          {tab === 'categories' && <CategoriesTab toast={toast} />}
          {tab === 'users' && <UsersTab toast={toast} currentUserId={user.id} />}
          {tab === 'profile' && <ProfileTab user={user} setUser={setUser} toast={toast} />}
        </div>
      </div>
    </main>
  );
}

function PostsTab({ user, toast }: any) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');

  useEffect(() => {
    api.posts.list({}).then((p: any) => setPosts(p.posts.filter((post: Post) => post.author.username === user.username)));
  }, []);

  const filtered = posts.filter(p => p.status === filter);
  const token = () => localStorage.getItem('substrato_token')!;

  const publish = (post: Post) => toast.confirm(`¿Publicar "${post.title}"?`, async () => {
    try {
      const updated: any = await api.posts.update(post.id, { status: 'PUBLISHED' }, token());
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'PUBLISHED', slug: updated.slug } : p));
      toast.show('Publicado 🌱', 'success'); setFilter('PUBLISHED');
    } catch (e: any) { toast.show(e.message, 'error'); }
  }, { confirmLabel: 'Publicar' });

  const unpublish = (post: Post) => toast.confirm(`¿Mover "${post.title}" a borradores?`, async () => {
    try {
      await api.posts.update(post.id, { status: 'DRAFT' }, token());
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'DRAFT' } : p));
      toast.show('Movido a borradores', 'success'); setFilter('DRAFT');
    } catch (e: any) { toast.show(e.message, 'error'); }
  }, { confirmLabel: 'Mover' });

  const remove = (post: Post) => toast.confirm(`¿Eliminar "${post.title}"?`, async () => {
    try {
      await api.posts.delete(post.id, token());
      setPosts(prev => prev.filter(p => p.id !== post.id));
      toast.show('Eliminado', 'success');
    } catch (e: any) { toast.show(e.message, 'error'); }
  }, { confirmLabel: 'Eliminar', danger: true });

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        {(['PUBLISHED', 'DRAFT'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className="mono" style={{ padding: '6px 14px', borderRadius: '20px', border: '0.5px solid rgba(13,13,13,0.2)', background: filter === f ? 'var(--color-tierra)' : 'transparent', color: filter === f ? 'var(--color-pergamino)' : 'var(--color-tierra)', cursor: 'pointer' }}>
            {f === 'PUBLISHED' ? 'Publicados' : 'Borradores'} ({posts.filter(p => p.status === f).length})
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="serif italic" style={{ fontSize: '20px', color: 'rgba(13,13,13,0.35)', textAlign: 'center', padding: '3rem 0' }}>
          {filter === 'DRAFT' ? 'No tienes borradores' : 'No has publicado nada aún'}
        </p>
      ) : filtered.map(p => (
        <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', padding: '1.5rem 0', borderTop: '0.5px solid rgba(13,13,13,0.1)', alignItems: 'center' }}>
          <div>
            <div className="mono" style={{ color: 'rgba(13,13,13,0.4)', marginBottom: '0.5rem' }}>{p.category.name} · {new Date(p.createdAt).toLocaleDateString('es')}</div>
            <h2 className="serif" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}>{p.title}</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link href={`/escribir?id=${p.id}`} className="mono" style={{ padding: '6px 12px', border: '0.5px solid rgba(13,13,13,0.2)', borderRadius: '20px', fontSize: '11px' }}>Editar</Link>
            {p.status === 'DRAFT' ? (
              <button onClick={() => publish(p)} className="mono" style={{ padding: '6px 12px', border: 'none', borderRadius: '20px', fontSize: '11px', background: 'var(--color-musgo)', color: 'var(--color-tierra)', cursor: 'pointer' }}>Publicar</button>
            ) : (
              <>
                <Link href={`/post/${p.slug}`} className="mono" style={{ padding: '6px 12px', border: '0.5px solid var(--color-musgo)', borderRadius: '20px', fontSize: '11px', color: 'var(--color-musgo)' }}>Ver →</Link>
                <button onClick={() => unpublish(p)} className="mono" style={{ padding: '6px 12px', border: '0.5px solid rgba(13,13,13,0.2)', borderRadius: '20px', fontSize: '11px', background: 'transparent', cursor: 'pointer' }}>Despublicar</button>
              </>
            )}
            <button onClick={() => remove(p)} className="mono" style={{ padding: '6px 12px', border: '0.5px solid var(--color-corteza)', borderRadius: '20px', fontSize: '11px', color: 'var(--color-corteza)', background: 'transparent', cursor: 'pointer' }}>Eliminar</button>
          </div>
        </div>
      ))}
    </>
  );
}

function CommentsTab({ toast }: any) {
  const [comments, setComments] = useState<any[]>([]);
  useEffect(() => {
    const token = localStorage.getItem('substrato_token')!;
    api.users.myComments(token).then((c: any) => setComments(c)).catch(() => toast.show('Error al cargar', 'error'));
  }, []);

  return comments.length === 0 ? (
    <p className="serif italic" style={{ fontSize: '20px', color: 'rgba(13,13,13,0.35)', textAlign: 'center', padding: '3rem 0' }}>Aún no has comentado nada</p>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {comments.map(c => (
        <Link key={c.id} href={`/post/${c.post.slug}`} style={{ padding: '1.5rem 0', borderTop: '0.5px solid rgba(13,13,13,0.1)' }}>
          <div className="mono" style={{ color: 'rgba(13,13,13,0.4)', marginBottom: '0.5rem' }}>en {c.post.title} · {new Date(c.createdAt).toLocaleDateString('es')}</div>
          <p style={{ fontSize: '15px' }}>{c.content}</p>
        </Link>
      ))}
    </div>
  );
}

function CategoriesTab({ toast }: any) {
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#5DCAA5');
  const token = () => localStorage.getItem('substrato_token')!;

  const load = () => api.categories.list().then((c: any) => setCats(c));
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!name) return toast.show('Nombre requerido', 'error');
    try { await api.categories.create({ name, color }, token()); setName(''); load(); toast.show('Categoría creada', 'success'); }
    catch (e: any) { toast.show(e.message, 'error'); }
  };

  const remove = (c: Category) => toast.confirm(`¿Eliminar "${c.name}"?`, async () => {
    try { await api.categories.delete(c.id, token()); load(); toast.show('Eliminada', 'success'); }
    catch (e: any) { toast.show(e.message, 'error'); }
  }, { confirmLabel: 'Eliminar', danger: true });

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nueva categoría" style={{ flex: 1, minWidth: '200px', padding: '10px 14px', border: '0.5px solid rgba(13,13,13,0.2)', borderRadius: '20px', background: 'transparent', outline: 'none' }} />
        <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '50%', cursor: 'pointer', background: 'transparent' }} />
        <button onClick={create} className="mono" style={{ padding: '10px 18px', borderRadius: '20px', border: 'none', background: 'var(--color-tierra)', color: 'var(--color-pergamino)', cursor: 'pointer' }}>Crear</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {cats.map(c => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderTop: '0.5px solid rgba(13,13,13,0.1)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: c.color || 'var(--color-musgo)' }} />
              <div>
                <div style={{ fontSize: '15px' }}>{c.name}</div>
                <div className="mono" style={{ color: 'rgba(13,13,13,0.4)' }}>{c._count?.posts ?? 0} artículo{c._count?.posts !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <button onClick={() => remove(c)} className="mono" style={{ padding: '6px 12px', border: '0.5px solid var(--color-corteza)', borderRadius: '20px', fontSize: '11px', color: 'var(--color-corteza)', background: 'transparent', cursor: 'pointer' }}>Eliminar</button>
          </div>
        ))}
      </div>
    </>
  );
}

function UsersTab({ toast, currentUserId }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const token = () => localStorage.getItem('substrato_token')!;
  const load = () => api.users.list(token()).then((u: any) => setUsers(u));
  useEffect(() => { load(); }, []);

  const changeRole = (id: string, role: string) => {
    toast.confirm(`¿Cambiar rol a ${role}?`, async () => {
      try { await api.users.updateRole(id, role, token()); load(); toast.show('Rol actualizado', 'success'); }
      catch (e: any) { toast.show(e.message, 'error'); }
    }, { confirmLabel: 'Cambiar' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {users.map(u => (
        <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', padding: '1.25rem 0', borderTop: '0.5px solid rgba(13,13,13,0.1)', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>{u.name}</div>
            <div className="mono" style={{ color: 'rgba(13,13,13,0.4)' }}>@{u.username} · {u.email} · {u._count?.posts ?? 0} posts</div>
          </div>
          {u.id === currentUserId ? (
            <span className="mono" style={{ padding: '6px 12px', borderRadius: '20px', border: '0.5px solid rgba(13,13,13,0.2)', fontSize: '11px' }}>{u.role} (tú)</span>
          ) : (
            <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} className="mono" style={{ padding: '6px 12px', borderRadius: '20px', border: '0.5px solid rgba(13,13,13,0.2)', fontSize: '11px', background: 'transparent', cursor: 'pointer' }}>
              <option value="READER">READER</option>
              <option value="AUTHOR">AUTHOR</option>
              <option value="EDITOR">EDITOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          )}
        </div>
      ))}
    </div>
  );
}

function ProfileTab({ user, setUser, toast }: any) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar || '');

  const save = async () => {
    setSaving(true);
    try {
      const data: any = { name, bio, avatar };
      if (password) data.password = password;
      const updated: any = await api.users.updateProfile(data, localStorage.getItem('substrato_token')!);
      setUser(updated);
      setPassword('');
      toast.show('Perfil actualizado', 'success');
    } catch (e: any) { toast.show(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const fieldStyle = { width: '100%', padding: '12px 16px', border: '0.5px solid rgba(13,13,13,0.2)', borderRadius: '10px', background: 'transparent', fontSize: '15px', outline: 'none', color: 'var(--color-tierra)', fontFamily: 'inherit' as const };

  return (
    <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label className="mono" style={{ display: 'block', marginBottom: '6px', color: 'rgba(13,13,13,0.5)' }}>Avatar</label>
        <ImageUpload value={avatar} onChange={setAvatar} shape="organic" label="Avatar" />
      </div>
      <div>
        <label className="mono" style={{ display: 'block', marginBottom: '6px', color: 'rgba(13,13,13,0.5)' }}>Nombre</label>
        <input value={name} onChange={e => setName(e.target.value)} style={fieldStyle} />
      </div>
      <div>
        <label className="mono" style={{ display: 'block', marginBottom: '6px', color: 'rgba(13,13,13,0.5)' }}>Bio</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ ...fieldStyle, resize: 'vertical' }} />
      </div>
      <div>
        <label className="mono" style={{ display: 'block', marginBottom: '6px', color: 'rgba(13,13,13,0.5)' }}>Nueva contraseña (opcional)</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Dejar vacío para no cambiar" style={fieldStyle} />
      </div>
      <button onClick={save} disabled={saving} className="mono" style={{ marginTop: '1rem', padding: '12px 24px', background: 'var(--color-tierra)', color: 'var(--color-pergamino)', border: 'none', borderRadius: '10px', cursor: 'pointer', alignSelf: 'flex-start' }}>
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  );
}