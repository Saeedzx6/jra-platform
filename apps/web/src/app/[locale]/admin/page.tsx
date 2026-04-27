'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Users, Calendar, BookOpen, FileText, Clock } from 'lucide-react';

interface Stats {
  members: number;
  events: number;
  trainings: number;
  posts: number;
  pending: number;
}

interface AdminOverviewPageProps {
  params: { locale: string };
}

export default function AdminOverviewPage({ params: { locale } }: AdminOverviewPageProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get<Stats>('/admin/stats').then(setStats).catch(() => {});
  }, []);

  const cards = [
    { icon: Users, label: 'Active Members', value: stats?.members ?? '—', color: 'bg-blue-50 text-blue-600' },
    { icon: Clock, label: 'Pending Applications', value: stats?.pending ?? '—', color: 'bg-yellow-50 text-yellow-600' },
    { icon: Calendar, label: 'Events', value: stats?.events ?? '—', color: 'bg-gold/10 text-gold-700' },
    { icon: BookOpen, label: 'Trainings', value: stats?.trainings ?? '—', color: 'bg-green-50 text-green-600' },
    { icon: FileText, label: 'Published Posts', value: stats?.posts ?? '—', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-navy mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black text-navy">{card.value}</div>
            <div className="text-xs text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
