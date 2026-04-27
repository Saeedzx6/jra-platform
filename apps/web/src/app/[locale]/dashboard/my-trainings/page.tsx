'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface MyTrainingsPageProps {
  params: { locale: string };
}

export default function MyTrainingsPage({ params: { locale } }: MyTrainingsPageProps) {
  const t = useTranslations('dashboard');

  return (
    <ProtectedRoute locale={locale}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-navy py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href={`/${locale}/dashboard`} className="text-gray-400 hover:text-gold flex items-center gap-1 mb-4 text-sm">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-black text-white">{t('my_trainings')}</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="text-center text-gray-400 py-16">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>{t('no_trainings')}</p>
            <Link href={`/${locale}/trainings`} className="text-gold hover:underline mt-2 inline-block">Browse Training Programs</Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
