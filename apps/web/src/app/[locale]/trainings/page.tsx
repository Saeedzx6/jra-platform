import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { api } from '@/lib/api';
import { Training, PaginatedResponse } from '@/types';
import { TrainingCard } from '@/components/trainings/TrainingCard';

export const metadata: Metadata = { title: 'Training Programs' };

interface TrainingsPageProps {
  params: { locale: string };
}

export default async function TrainingsPage({ params: { locale } }: TrainingsPageProps) {
  const t = await getTranslations('trainings');
  const res = await api.get<PaginatedResponse<Training>>('/trainings?limit=12').catch(() => ({ data: [], total: 0, page: 1, limit: 12 }));

  return (
    <div className="min-h-screen">
      <div className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">Professional Development</span>
          <h1 className="text-4xl font-black text-white mt-2 mb-2">{t('title')}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {res.data.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No training programs available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {res.data.map((t) => <TrainingCard key={t.id} training={t} locale={locale} />)}
          </div>
        )}
      </div>
    </div>
  );
}
