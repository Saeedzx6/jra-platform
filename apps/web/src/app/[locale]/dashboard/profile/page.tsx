'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProfilePageProps {
  params: { locale: string };
}

export default function ProfilePage({ params: { locale } }: ProfilePageProps) {
  const t = useTranslations('dashboard');
  const { user, refresh } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    businessName: user?.profile?.businessName ?? '',
    location: user?.profile?.location ?? '',
    phone: user?.profile?.phone ?? '',
    website: user?.profile?.website ?? '',
    bio: user?.profile?.bio ?? '',
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.profile) return;
    setSaving(true);
    setError('');
    try {
      await api.put(`/members/${user.profile.id}`, form);
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute locale={locale}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-navy py-10 px-4">
          <div className="max-w-2xl mx-auto">
            <Link href={`/${locale}/dashboard`} className="text-gray-400 hover:text-gold flex items-center gap-1 mb-4 text-sm">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-black text-white">{t('edit_profile')}</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Business Name</label>
                <Input value={form.businessName} onChange={(e) => update('businessName', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Location</label>
                <Input value={form.location} onChange={(e) => update('location', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
                <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Website</label>
                <Input type="url" value={form.website} onChange={(e) => update('website', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">About Your Business</label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => update('bio', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {saved && <p className="text-green-600 text-sm">Profile saved successfully!</p>}
              <Button type="submit" disabled={saving} size="lg" className="w-full">
                {saving ? 'Saving...' : t('save')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
