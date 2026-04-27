import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { api } from '@/lib/api';
import { BoardMember } from '@/types';
import { Users, Globe, Award, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About JRA',
  description: 'Learn about the Jordan Restaurants Association — our mission, vision, and board of directors.',
};

interface AboutProps {
  params: { locale: string };
}

export default async function AboutPage({ params: { locale } }: AboutProps) {
  const t = await getTranslations('about');
  const board = await api.get<BoardMember[]>('/board').catch(() => []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-navy py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">Who We Are</span>
          <h1 className="text-5xl font-black text-white mt-2 mb-4">{t('title')}</h1>
          <p className="text-gray-300 text-lg">{t('founded')}</p>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-gold" />
            </div>
            <h2 className="text-2xl font-black text-navy mb-4">{t('mission_title')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('mission')}</p>
          </div>
          <div className="bg-navy rounded-2xl p-8">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-gold" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4">{t('vision_title')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('vision')}</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '1,200+', label: 'Member Establishments' },
            { value: '2002', label: 'Year Founded' },
            { value: '9', label: 'Board Members' },
            { value: '12', label: 'Cities Represented' },
          ].map((stat) => (
            <div key={stat.label} className="text-center bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl font-black text-gold mb-2">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Partnerships */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-navy">Our Partnerships</h2>
            <p className="text-gray-500 mt-2">JRA is connected to Jordan's leading tourism and governmental bodies.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: 'Jordan Tourism Board', desc: 'Official member, promoting restaurants as part of Jordan\'s tourism offering.' },
              { icon: Award, title: 'UN Tourism', desc: 'Member of the United Nations tourism body, recognized internationally.' },
              { icon: Shield, title: 'Ministry of Industry', desc: 'Registered and regulated under official Jordanian business regulations.' },
            ].map((p) => (
              <div key={p.title} className="text-center p-6 rounded-xl border border-gray-200 bg-white">
                <div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <p.icon className="h-6 w-6 text-navy" />
                </div>
                <h3 className="font-bold text-navy mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      {board.length > 0 && (
        <section className="py-20 bg-gray-50 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-gold text-sm font-semibold uppercase tracking-wider">Leadership</span>
              <h2 className="text-3xl font-black text-navy mt-2">{t('board_title')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {board.map((member) => (
                <div key={member.id} className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                  <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-10 w-10 text-gold" />
                    )}
                  </div>
                  <h3 className="font-bold text-navy">{member.name}</h3>
                  <p className="text-sm text-gold mt-1">{member.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
