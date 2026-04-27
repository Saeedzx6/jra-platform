import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Post, PaginatedResponse } from '@/types';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'News & Updates' };

interface NewsPageProps {
  params: { locale: string };
}

export default async function NewsPage({ params: { locale } }: NewsPageProps) {
  const t = await getTranslations('news');
  const res = await api.get<PaginatedResponse<Post>>('/posts?limit=12').catch(() => ({ data: [], total: 0, page: 1, limit: 12 }));

  return (
    <div className="min-h-screen">
      <div className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">Latest from JRA</span>
          <h1 className="text-4xl font-black text-white mt-2 mb-2">{t('title')}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {res.data.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No posts published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {res.data.map((post) => (
              <Link key={post.id} href={`/${locale}/news/${post.slug}`} className="group">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gold hover:shadow-md transition-all h-full flex flex-col">
                  <div className="h-48 bg-gradient-to-br from-navy-800 to-navy" />
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(post.createdAt).toLocaleDateString()} {post.author && `• ${post.author.name}`}
                    </p>
                    <h2 className="font-bold text-navy mb-2 group-hover:text-gold transition-colors line-clamp-2 flex-1">
                      {post.title}
                    </h2>
                    {post.excerpt && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>}
                    <div className="flex items-center gap-1 text-gold text-sm font-medium">
                      {t('read_more')} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
