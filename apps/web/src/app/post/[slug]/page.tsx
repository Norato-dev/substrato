import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import ArticleHero from '@/components/blog/ArticleHero';
import ArticleBody from '@/components/blog/ArticleBody';
import ArticleFooter from '@/components/blog/ArticleFooter';
import { api } from '@/lib/api';
import { Post } from '@/types';

async function getPost(slug: string): Promise<Post | null> {
  try {
    return (await api.posts.get(slug)) as Post;
  } catch {
    return null;
  }
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
      <ArticleFooter post={post} />
    </main>
  );
}