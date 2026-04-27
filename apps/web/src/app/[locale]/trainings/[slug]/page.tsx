'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Training } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { formatDate, formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function TrainingDetailPage() {
  const { locale, slug } = useParams<{ locale: string; slug: string }>();
  const { user } = useAuth();
  const [training, setTraining] = useState<Training | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Training>(`/trainings/${slug}`).then(setTraining).catch(() => {});
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) return;
    setEnrolling(true);
    setError('');
    try {
      await api.post(`/trainings/${training!.id}/register`, {});
      setEnrolled(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (!training) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-navy border-t-gold rounded-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href={`/${locale}/trainings`} className="text-gray-400 hover:text-gold flex items-center gap-1 mb-6 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Trainings
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="text-3xl font-black text-white">{training.title}</h1>
            <Badge variant="default" className="text-base px-4 py-2">{formatPrice(training.price)}</Badge>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300 mt-4">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gold" />{formatDate(training.date, locale)}</div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-gold" />{training.seats} seats available</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <p className="text-gray-700 leading-relaxed">{training.description}</p>
        </div>

        {user ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {enrolled ? (
              <div className="text-center">
                <div className="text-green-600 font-bold text-lg mb-1">Successfully Enrolled!</div>
                <p className="text-gray-500 text-sm">You'll find this training in your dashboard.</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-navy mb-2">Enroll in this Training</h3>
                <p className="text-sm text-gray-500 mb-4">Price: <span className="font-semibold text-navy">{formatPrice(training.price)}</span></p>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <Button onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? 'Enrolling...' : 'Confirm Enrollment'}
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-gray-500 mb-3">Sign in to enroll in this training program.</p>
            <Link href={`/${locale}/login`}><Button>Sign In to Enroll</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
