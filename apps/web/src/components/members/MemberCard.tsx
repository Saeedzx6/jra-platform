import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Globe, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MemberProfile } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MemberCardProps {
  member: MemberProfile;
  locale: string;
}

export function MemberCard({ member, locale }: MemberCardProps) {
  const t = useTranslations();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gold hover:shadow-md transition-all duration-300 flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-navy/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
          {member.logoUrl ? (
            <img src={member.logoUrl} alt={member.businessName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-navy font-black text-xl">{member.businessName[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-navy truncate">{member.businessName}</h3>
          <Badge variant="outline" className="mt-1 text-xs">
            {t(`categories.${member.category}`)}
          </Badge>
        </div>
      </div>

      {member.stars > 0 && (
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < member.stars ? 'text-gold fill-gold' : 'text-gray-200 fill-gray-200'}`}
            />
          ))}
        </div>
      )}

      {member.bio && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{member.bio}</p>
      )}

      <div className="space-y-1.5 text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
          <span className="truncate">{member.location}</span>
        </div>
        {member.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
            <span>{member.phone}</span>
          </div>
        )}
        {member.website && (
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-gold shrink-0" />
            <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline truncate">
              {member.website.replace(/https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>

      <Link href={`/${locale}/members/${member.id}`}>
        <Button variant="outline" size="sm" className="w-full">{t('members.view_profile')}</Button>
      </Link>
    </div>
  );
}
