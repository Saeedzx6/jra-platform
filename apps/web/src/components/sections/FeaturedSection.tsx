'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Users, Calendar, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturedSectionProps {
  locale: string;
}

export function FeaturedSection({ locale }: FeaturedSectionProps) {
  const t = useTranslations();

  const features = [
    {
      icon: Users,
      title: 'Member Network',
      description: '1,200+ restaurants, cafes, and hospitality businesses connected through JRA membership.',
      href: `/${locale}/members`,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Calendar,
      title: 'Industry Events',
      description: 'Annual summits, networking evenings, and sector-wide gatherings that keep you connected.',
      href: `/${locale}/events`,
      color: 'bg-gold/10 text-gold-600',
    },
    {
      icon: BookOpen,
      title: 'Training Programs',
      description: 'Professional certifications and skill-building workshops designed for the hospitality sector.',
      href: `/${locale}/trainings`,
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Award,
      title: 'Industry Advocacy',
      description: 'JRA represents your interests with government bodies, tourism boards, and international organizations.',
      href: `/${locale}/about`,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">Why Join JRA</span>
          <h2 className="text-4xl font-black text-navy mt-2 mb-4">Everything Your Restaurant Needs</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            From membership to advocacy, JRA provides the tools and community every Jordanian restaurant needs to thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href} className="group">
              <div className="bg-white rounded-xl p-6 border border-gray-200 h-full hover:border-gold hover:shadow-lg transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-navy mb-2 group-hover:text-gold transition-colors">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                <div className="flex items-center gap-1 mt-4 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href={`/${locale}/register`}>
            <Button size="lg">Become a Member Today</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
