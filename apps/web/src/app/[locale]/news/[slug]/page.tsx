import React from 'react';
import { api } from '@/lib/api';
import { Post } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

interface NewsDetailProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({ params: { slug } }: NewsDetailProps): Promise<Metadata> {
  const post = await api.get<Post>(`/posts/${slug}`).catch(() => null);
  return { title: post?.title ?? 'Article', description: post?.excerpt ?? '' };
}

export default async function NewsDetailPage({ params: { locale, slug } }: NewsDetailProps) {
  const post = await api.get<Post>(`/posts/${slug}`).catch(() => null);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy mb-2">Article Not Found</h1>
          <Link href={`/${locale}/news`} className="text-gold hover:underline">← Back to News</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href={`/${locale}/news`} className="text-gray-400 hover:text-gold flex items-center gap-1 mb-6 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to News
          </Link>
          <p className="text-gold text-sm mb-3">
            {new Date(post.createdAt).toLocaleDateString()} {post.author && `· ${post.author.name}`}
          </p>
          <h1 className="text-3xl font-black text-white">{post.title}</h1>
          {post.excerpt && <p className="text-gray-300 mt-3 text-lg">{post.excerpt}</p>}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
          />
        </div>
      </div>
    </div>
  );
}
