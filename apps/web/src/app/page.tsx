import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/blog/Hero';
import MarqueeStrip from '@/components/blog/MarqueeStrip';
import PostGrid from '@/components/blog/PostGrid';
import { api } from '@/lib/api';
import { PaginatedPosts } from '@/types';

export const dynamic = 'force-dynamic';

async function getPosts(): Promise<PaginatedPosts> {
  try {
    return await api.posts.list({ status: 'PUBLISHED' }) as PaginatedPosts;
  } catch {
    return { posts: [], total: 0, page: 1, totalPages: 0 };
  }
}

export default async function Home() {
  const data = await getPosts();
  const [hero, ...rest] = data.posts;
  const sidePosts = rest.slice(0, 3);
  const gridPosts = rest.slice(3, 6);

  return (
    <main>
      <Navbar />
      {hero ? (
        <>
          <Hero post={hero} sidePosts={sidePosts} />
          <MarqueeStrip items={['Ideas', 'Diseño', 'Tecnología', 'Cultura', 'Naturaleza', 'Proceso']} />
          {gridPosts.length > 0 && <PostGrid posts={gridPosts} />}
        </>
      ) : (
        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
          <h1 className="serif" style={{ fontSize: '48px' }}>Aún no hay artículos</h1>
          <p style={{ marginTop: '1rem', color: 'rgba(13,13,13,0.5)' }}>El substrato está preparándose para crecer.</p>
        </div>
      )}
    </main>
  );
}