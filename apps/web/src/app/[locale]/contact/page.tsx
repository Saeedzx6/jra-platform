'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ContactPageProps {
  params: { locale: string };
}

export default function ContactPage({ params: { locale } }: ContactPageProps) {
  const t = useTranslations('contact');
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">Get in Touch</span>
          <h1 className="text-4xl font-black text-white mt-2 mb-2">{t('title')}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-black text-navy mb-6">Our Office</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-navy">Address</p>
                  <p className="text-gray-500 text-sm">{t('address')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-navy">Phone</p>
                  <a href={`tel:${t('phone')}`} className="text-gold hover:underline text-sm">{t('phone')}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-navy">Email</p>
                  <a href={`mailto:${t('email_address')}`} className="text-gold hover:underline text-sm">{t('email_address')}</a>
                </div>
              </div>
            </div>

            {/* Map embed placeholder */}
            <div className="h-64 bg-gray-200 rounded-xl overflow-hidden">
              <iframe
                title="JRA Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.3!2d35.9109!3d31.9522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU3JzA3LjkiTiAzNcKwNTQnMzkuMiJF!5e0!3m2!1sen!2sjo!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-xl font-bold text-navy mb-2">Message Sent!</h3>
                <p className="text-gray-500">Thank you for contacting JRA. We'll get back to you soon.</p>
                <Button className="mt-6" onClick={() => setSent(false)}>Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('name')}</label>
                  <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('email')}</label>
                  <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('subject')}</label>
                  <Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('message')}</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold resize-none"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">{t('send')}</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
