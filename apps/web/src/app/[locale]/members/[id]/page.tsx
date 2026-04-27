import React from 'react';
import { api } from '@/lib/api';
import { MemberProfile } from '@/types';
import { MapPin, Phone, Globe, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface MemberDetailProps {
  params: { locale: string; id: string };
}

export default async function MemberDetailPage({ params: { locale, id } }: MemberDetailProps) {
  const member = await api.get<MemberProfile>(`/members/${id}`).catch(() => null);
  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy mb-2">Member Not Found</h1>
          <Link href={`/${locale}/members`} className="text-gold hover:underline">← Back to Directory</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href={`/${locale}/members`} className="text-gray-400 hover:text-gold flex items-center gap-1 mb-6 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Directory
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
              {member.logoUrl ? (
                <img src={member.logoUrl} alt={member.businessName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-navy font-black text-3xl">{member.businessName[0]}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">{member.businessName}</h1>
              <Badge variant="default" className="mt-2">{member.category.replace('_', ' ')}</Badge>
              {member.stars > 0 && (
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < member.stars ? 'text-gold fill-gold' : 'text-gray-600 fill-gray-600'}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {member.bio && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h2 className="font-bold text-navy mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-navy mb-4">Contact</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gold mt-0.5" />
                  <span className="text-sm text-gray-600">{member.location}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gold" />
                    <a href={`tel:${member.phone}`} className="text-sm text-gold hover:underline">{member.phone}</a>
                  </div>
                )}
                {member.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gold" />
                    <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:underline">
                      {member.website.replace(/https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">JRA Member since {new Date(member.createdAt).getFullYear()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
