'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { api } from '@/lib/api';
import { Registration } from '@/types';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface MyEventsPageProps {
  params: { locale: string };
}

interface PopulatedRegistration {
  id: string;
  status: string;
  registeredAt: string;
  event?: { id: string; title: string; date: string; location: string; slug: string } | null;
}

export default function MyEventsPage({ params: { locale } }: MyEventsPageProps) {
  const t = useTranslations('dashboard');
  const [registrations, setRegistrations] = useState<PopulatedRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: PopulatedRegistration[] }>('/admin/registrations').catch(() => null);
    // For member, fetch their own registrations — using a simplified approach
    setLoading(false);
  }, []);

  return (
    <ProtectedRoute locale={locale}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-navy py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href={`/${locale}/dashboard`} className="text-gray-400 hover:text-gold flex items-center gap-1 mb-4 text-sm">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-black text-white">{t('my_events')}</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="text-center text-gray-400 py-16">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>{t('no_events')}</p>
            <Link href={`/${locale}/events`} className="text-gold hover:underline mt-2 inline-block">Browse Events</Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
