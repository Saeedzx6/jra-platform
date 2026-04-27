import React from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessPageProps {
  params: { locale: string };
}

export default async function RegisterSuccessPage({ params: { locale } }: SuccessPageProps) {
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-black text-navy mb-4">{t('success_title')}</h1>
        <p className="text-gray-500 leading-relaxed mb-8">{t('success_body')}</p>
        <Link href={`/${locale}`}>
          <Button size="lg">{t('back_home')}</Button>
        </Link>
      </div>
    </div>
  );
}
