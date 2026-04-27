'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Search, SlidersHorizontal } from 'lucide-react';
import { api } from '@/lib/api';
import { MemberProfile, PaginatedResponse, MemberCategory } from '@/types';
import { MemberCard } from '@/components/members/MemberCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CATEGORIES: MemberCategory[] = [
  'FINE_DINING', 'CASUAL_DINING', 'FAST_FOOD', 'CAFE', 'BAKERY', 'CATERING', 'NIGHTLIFE', 'OTHER',
];

interface MembersPageProps {
  params: { locale: string };
}

export default function MembersPage({ params: { locale } }: MembersPageProps) {
  const t = useTranslations();
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stars, setStars] = useState('');

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (stars) params.set('stars', stars);

      const res = await api.get<PaginatedResponse<MemberProfile>>(`/members?${params}`);
      setMembers(res.data);
      setTotal(res.total);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, stars]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMembers();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">Our Community</span>
          <h1 className="text-4xl font-black text-white mt-2 mb-2">{t('members.title')}</h1>
          <p className="text-gray-300">{total} active establishments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4 text-navy" />
                <span className="font-bold text-navy text-sm">Filters</span>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('members.search_placeholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    {t('members.filter_category')}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">{t('members.all_categories')}</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{t(`categories.${c}`)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    {t('members.filter_stars')}
                  </label>
                  <select
                    value={stars}
                    onChange={(e) => { setStars(e.target.value); setPage(1); }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">All Ratings</option>
                    {[5, 4, 3, 2, 1].map((s) => (
                      <option key={s} value={s}>{'★'.repeat(s)} {s} Stars</option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full" size="sm">Search</Button>
                {(search || category || stars) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => { setSearch(''); setCategory(''); setStars(''); setPage(1); }}
                  >
                    Clear Filters
                  </Button>
                )}
              </form>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">{t('members.no_results')}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {members.map((m) => <MemberCard key={m.id} member={m} locale={locale} />)}
                </div>

                {/* Pagination */}
                {total > 12 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-gray-500">Page {page}</span>
                    <Button variant="outline" size="sm" disabled={page * 12 >= total} onClick={() => setPage(p => p + 1)}>
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
