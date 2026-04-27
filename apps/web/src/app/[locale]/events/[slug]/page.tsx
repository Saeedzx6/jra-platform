'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Event } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export default function EventDetailPage() {
  const { locale, slug } = useParams<{ locale: string; slug: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Event>(`/events/${slug}`).then(setEvent).catch(() => {});
  }, [slug]);

  const handleRegister = async () => {
    if (!user) return;
    setRegistering(true);
    setError('');
    try {
      await api.post(`/events/${event!.id}/register`, {});
      setRegistered(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-navy border-t-gold rounded-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href={`/${locale}/events`} className="text-gray-400 hover:text-gold flex items-center gap-1 mb-6 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </Link>
          <h1 className="text-3xl font-black text-white mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gold" />{formatDate(event.date, locale)}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" />{event.location}</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>

        {user ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {registered ? (
              <div className="text-center">
                <div className="text-green-600 font-bold text-lg mb-1">You are registered!</div>
                <p className="text-gray-500 text-sm">A notification has been sent to your account.</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-navy mb-2">Register for this Event</h3>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <Button onClick={handleRegister} disabled={registering}>
                  {registering ? 'Registering...' : 'Confirm Registration'}
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-gray-500 mb-3">Sign in to register for this event.</p>
            <Link href={`/${locale}/login`}><Button>Sign In to Register</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
