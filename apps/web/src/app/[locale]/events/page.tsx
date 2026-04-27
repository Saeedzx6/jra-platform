import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { api } from '@/lib/api';
import { Event, PaginatedResponse } from '@/types';
import { EventCard } from '@/components/events/EventCard';

export const metadata: Metadata = { title: 'Events' };

interface EventsPageProps {
  params: { locale: string };
}

export default async function EventsPage({ params: { locale } }: EventsPageProps) {
  const t = await getTranslations('events');
  const res = await api.get<PaginatedResponse<Event>>('/events?limit=12').catch(() => ({ data: [], total: 0, page: 1, limit: 12 }));

  return (
    <div className="min-h-screen">
      <div className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">JRA Calendar</span>
          <h1 className="text-4xl font-black text-white mt-2 mb-2">{t('title')}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {res.data.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No events scheduled yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {res.data.map((e) => <EventCard key={e.id} event={e} locale={locale} />)}
          </div>
        )}
      </div>
    </div>
  );
}
