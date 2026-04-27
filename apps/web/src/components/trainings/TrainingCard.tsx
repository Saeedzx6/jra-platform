import React from 'react';
import Link from 'next/link';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Training } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatPrice } from '@/lib/utils';

interface TrainingCardProps {
  training: Training;
  locale: string;
  registered?: boolean;
}

export function TrainingCard({ training, locale, registered }: TrainingCardProps) {
  const t = useTranslations('trainings');

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gold hover:shadow-md transition-all duration-300">
      <div className="h-40 bg-gradient-to-br from-navy-800 to-navy relative overflow-hidden">
        {training.imageUrl ? (
          <img src={training.imageUrl} alt={training.title} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-black text-white/10">JRA</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="default">{formatPrice(training.price)}</Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-navy mb-2 leading-tight line-clamp-2">{training.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{training.description}</p>

        <div className="space-y-1.5 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-gold" />
            <span>{formatDate(training.date, locale)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-gold" />
            <span>{training.seats} {t('seats')}</span>
          </div>
        </div>

        <Link href={`/${locale}/trainings/${training.slug}`}>
          <Button variant={registered ? 'navy' : 'default'} size="sm" className="w-full">
            {registered ? 'Enrolled' : t('enroll')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
