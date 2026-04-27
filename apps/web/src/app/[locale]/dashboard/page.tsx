'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import Link from 'next/link';
import { User, Calendar, BookOpen, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardPageProps {
  params: { locale: string };
}

export default function DashboardPage({ params: { locale } }: DashboardPageProps) {
  const t = useTranslations('dashboard');
  const { user } = useAuth();

  const statusVariant = (status?: string) => {
    if (status === 'ACTIVE') return 'success';
    if (status === 'SUSPENDED') return 'danger';
    return 'warning';
  };

  const cards = [
    { icon: User, label: t('profile'), href: `/${locale}/dashboard/profile`, color: 'bg-blue-50 text-blue-600' },
    { icon: Calendar, label: t('my_events'), href: `/${locale}/dashboard/my-events`, color: 'bg-gold/10 text-gold-700' },
    { icon: BookOpen, label: t('my_trainings'), href: `/${locale}/dashboard/my-trainings`, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <ProtectedRoute locale={locale}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-navy py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-gold text-sm font-semibold mb-1">{t('welcome')},</p>
            <h1 className="text-3xl font-black text-white">{user?.name}</h1>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-gray-400 text-sm">{t('status')}:</span>
              <Badge variant={statusVariant(user?.profile?.status)}>
                {user?.profile?.status ?? 'PENDING'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10">
          {user?.profile?.status === 'PENDING' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
              Your membership application is under review. You'll be notified once it's approved.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {cards.map((card) => (
              <Link key={card.href} href={card.href} className="group">
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gold hover:shadow-md transition-all text-center">
                  <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <p className="font-semibold text-navy group-hover:text-gold transition-colors">{card.label}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Member info */}
          {user?.profile && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-navy mb-4">Your Business</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-400">Business Name:</span><p className="font-medium text-navy">{user.profile.businessName}</p></div>
                <div><span className="text-gray-400">Category:</span><p className="font-medium text-navy">{user.profile.category.replace('_', ' ')}</p></div>
                <div><span className="text-gray-400">Location:</span><p className="font-medium text-navy">{user.profile.location}</p></div>
                <div><span className="text-gray-400">Email:</span><p className="font-medium text-navy">{user.email}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
