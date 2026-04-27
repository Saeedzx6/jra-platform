'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, ChevronDown, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/layout/NotificationBell';

interface NavbarProps {
  locale: string;
}

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav');
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const otherLocale = locale === 'en' ? 'ar' : 'en';
  const localePath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/members`, label: t('members') },
    { href: `/${locale}/events`, label: t('events') },
    { href: `/${locale}/trainings`, label: t('trainings') },
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled ? 'bg-navy shadow-lg py-3' : 'bg-navy/95 py-4'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
              <span className="text-navy font-black text-lg">JRA</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-tight">Jordan Restaurants</div>
              <div className="text-gold text-xs">Association</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-gold bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <Link
              href={localePath}
              className="text-xs font-medium text-gray-300 hover:text-gold border border-gray-600 hover:border-gold rounded-md px-2 py-1 transition-colors"
            >
              {otherLocale === 'ar' ? 'عربي' : 'EN'}
            </Link>

            {user ? (
              <>
                <NotificationBell locale={locale} />
                {user.role === 'ADMIN' ? (
                  <Link href={`/${locale}/admin`}>
                    <Button size="sm" variant="outline">{t('admin')}</Button>
                  </Link>
                ) : (
                  <Link href={`/${locale}/dashboard`}>
                    <Button size="sm" variant="outline">{t('dashboard')}</Button>
                  </Link>
                )}
                <Button size="sm" variant="ghost" onClick={logout} className="text-gray-300 hover:text-white">
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/login`}>
                  <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white hidden sm:flex">
                    {t('login')}
                  </Button>
                </Link>
                <Link href={`/${locale}/register`}>
                  <Button size="sm">{t('register')}</Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block px-3 py-2 rounded-md text-sm font-medium mb-1 transition-colors',
                pathname === link.href ? 'text-gold bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
