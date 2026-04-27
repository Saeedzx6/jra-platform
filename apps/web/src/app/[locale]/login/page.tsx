'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LoginPageProps {
  params: { locale: string };
}

export default function LoginPage({ params: { locale } }: LoginPageProps) {
  const t = useTranslations('auth');
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(user.role === 'ADMIN' ? `/${locale}/admin` : `/${locale}/dashboard`);
    }
  }, [user, locale, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-gold font-black text-2xl">JRA</span>
          </div>
          <h1 className="text-2xl font-black text-navy">{t('login_title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('login_subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('email')}</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('password')}</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : t('login_btn')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('no_account')}{' '}
            <Link href={`/${locale}/register`} className="text-gold font-medium hover:underline">
              {t('register_link')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
