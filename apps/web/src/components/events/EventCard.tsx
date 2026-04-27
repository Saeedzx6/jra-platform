import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  locale: string;
  registered?: boolean;
}

export function EventCard({ event, locale, registered }: EventCardProps) {
  const t = useTranslations('events');
  const isPast = new Date(event.date) < new Date();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gold hover:shadow-md transition-all duration-300">
      <div className="h-44 bg-gradient-to-br from-navy to-navy-700 relative overflow-hidden">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-white/20" />
          </div>
        )}
        {isPast && (
          <div className="absolute top-3 left-3 bg-gray-800/80 text-white text-xs px-2 py-1 rounded-full">Past Event</div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-navy mb-3 leading-tight line-clamp-2">{event.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{event.description}</p>

        <div className="space-y-1.5 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-gold" />
            <span>{formatDate(event.date, locale)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            <span>{event.location}</span>
          </div>
        </div>

        <Link href={`/${locale}/events/${event.slug}`}>
          <Button variant={registered ? 'navy' : 'default'} size="sm" className="w-full group">
            {registered ? t('registered') : t('register')}
            {!registered && <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </Link>
      </div>
    </div>
  );
}
