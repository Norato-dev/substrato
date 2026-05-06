import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import ArticleHero from '@/components/blog/ArticleHero';
import ArticleBody from '@/components/blog/ArticleBody';
import ArticleFooter from '@/components/blog/ArticleFooter';
import Comments from '@/components/blog/Comments';
import ReactionButton from '@/components/blog/ReactionButton';
import { api } from '@/lib/api';
import { Post } from '@/types';

export const dynamic = 'force-dynamic';

async function getPost(slug: string): Promise<Post | null> {
  try { return (await api.posts.get(slug)) as Post; } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'No encontrado · Substrato' };

  const title = (post as any).seoTitle || post.title;
  const description = (post as any).seoDesc || post.excerpt || `Un artículo de ${post.author.name} en Substrato`;
  const image = post.coverImage;

  return {
    title: `${title} · Substrato`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      authors: [post.author.name],
      publishedTime: post.publishedAt,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main>
      <Navbar />
      <ArticleHero post={post} />
      <ArticleBody post={post} />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 1.5rem 3rem' }}>
        <ReactionButton postId={post.id} initialCount={(post as any)._count?.reactions ?? 0} />
      </div>
      <ArticleFooter post={post} />
      <Comments postId={post.id} initial={(post as any).comments ?? []} />
    </main>
  );
}