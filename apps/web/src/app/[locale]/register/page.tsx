'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MemberCategory } from '@/types';
import { CheckCircle } from 'lucide-react';

const CATEGORIES: MemberCategory[] = [
  'FINE_DINING', 'CASUAL_DINING', 'FAST_FOOD', 'CAFE', 'BAKERY', 'CATERING', 'NIGHTLIFE', 'OTHER',
];

interface RegisterPageProps {
  params: { locale: string };
}

export default function RegisterPage({ params: { locale } }: RegisterPageProps) {
  const t = useTranslations('auth');
  const tCat = useTranslations('categories');
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    businessName: '', category: '' as MemberCategory | '', location: '',
    phone: '', website: '', bio: '',
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }

    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', form);
      router.push(`/${locale}/register/success`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-gold font-black text-2xl">JRA</span>
          </div>
          <h1 className="text-2xl font-black text-navy">{t('register_title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('register_subtitle')}</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 flex-1 ${s > 1 ? 'justify-end' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-gold text-navy' : 'bg-gray-200 text-gray-500'}`}>
                  {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                <span className={`text-sm font-medium ${step >= s ? 'text-navy' : 'text-gray-400'}`}>
                  {s === 1 ? t('step1') : t('step2')}
                </span>
              </div>
              {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-gold' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('name')}</label>
                  <Input required value={form.name} onChange={(e) => update('name', e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('email')}</label>
                  <Input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('password')}</label>
                  <Input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="Min 8 chars, one uppercase, one number"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('business_name')}</label>
                  <Input required value={form.businessName} onChange={(e) => update('businessName', e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('category')}</label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{tCat(c)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('location')}</label>
                  <Input required value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Amman, 3rd Circle" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('phone')}</label>
                  <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+962 6..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('website')}</label>
                  <Input type="url" value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('bio')}</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => update('bio', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    placeholder="Briefly describe your restaurant..."
                  />
                </div>
              </>
            )}

            {error && <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  {t('back')}
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Submitting...' : step === 1 ? t('next') : t('submit')}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('has_account')}{' '}
            <Link href={`/${locale}/login`} className="text-gold font-medium hover:underline">{t('login_link')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
