import React from 'react';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedSection } from '@/components/sections/FeaturedSection';
import { api } from '@/lib/api';
import { MemberCard } from '@/components/members/MemberCard';
import { EventCard } from '@/components/events/EventCard';
import { Post, MemberProfile, Event, PaginatedResponse } from '@/types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JRA - Jordan Restaurants Association',
  description: 'The official representative body of Jordan\'s restaurant and hospitality industry. Representing 1,200+ establishments.',
};

interface HomeProps {
  params: { locale: string };
}

export default async function HomePage({ params: { locale } }: HomeProps) {
  const [membersRes, eventsRes, postsRes] = await Promise.allSettled([
    api.get<PaginatedResponse<MemberProfile>>('/members?limit=3'),
    api.get<PaginatedResponse<Event>>('/events?limit=3'),
    api.get<PaginatedResponse<Post>>('/posts?limit=3'),
  ]);

  const members = membersRes.status === 'fulfilled' ? membersRes.value.data : [];
  const events = eventsRes.status === 'fulfilled' ? eventsRes.value.data : [];
  const posts = postsRes.status === 'fulfilled' ? postsRes.value.data : [];

  return (
    <>
      <HeroSection locale={locale} />
      <FeaturedSection locale={locale} />

      {/* Featured Members */}
      {members.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-gold text-sm font-semibold uppercase tracking-wider">Our Members</span>
                <h2 className="text-3xl font-black text-navy mt-1">Featured Restaurants</h2>
              </div>
              <Link href={`/${locale}/members`} className="flex items-center gap-1 text-gold font-medium hover:gap-2 transition-all">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((m) => <MemberCard key={m.id} member={m} locale={locale} />)}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-gold text-sm font-semibold uppercase tracking-wider">Upcoming</span>
                <h2 className="text-3xl font-black text-navy mt-1">Events & Gatherings</h2>
              </div>
              <Link href={`/${locale}/events`} className="flex items-center gap-1 text-gold font-medium hover:gap-2 transition-all">
                All Events <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => <EventCard key={e.id} event={e} locale={locale} />)}
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      {posts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-gold text-sm font-semibold uppercase tracking-wider">Latest</span>
                <h2 className="text-3xl font-black text-navy mt-1">News & Updates</h2>
              </div>
              <Link href={`/${locale}/news`} className="flex items-center gap-1 text-gold font-medium hover:gap-2 transition-all">
                All News <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/${locale}/news/${post.slug}`} className="group">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gold hover:shadow-md transition-all">
                    <div className="h-40 bg-gradient-to-br from-navy to-navy-700" />
                    <div className="p-5">
                      <p className="text-xs text-gray-400 mb-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                      <h3 className="font-bold text-navy mb-2 group-hover:text-gold transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20 bg-navy">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Join Jordan's Leading Restaurant Community?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Connect with 1,200+ establishments, access exclusive trainings, and let JRA represent your interests.
          </p>
          <Link href={`/${locale}/register`}>
            <button className="bg-gold hover:bg-gold-600 text-navy font-bold px-10 py-4 rounded-lg text-lg transition-colors">
              Apply for Membership
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
