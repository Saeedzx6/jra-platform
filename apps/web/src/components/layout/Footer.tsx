import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="bg-navy text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                <span className="text-navy font-black text-lg">JRA</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">Jordan Restaurants</div>
                <div className="text-gold text-xs">Association</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The official representative body of Jordan's restaurant and hospitality industry since 2002.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: `/${locale}/about`, label: 'About JRA' },
                { href: `/${locale}/members`, label: 'Member Directory' },
                { href: `/${locale}/events`, label: 'Events' },
                { href: `/${locale}/trainings`, label: 'Trainings' },
                { href: `/${locale}/news`, label: 'News' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Membership */}
          <div>
            <h3 className="text-white font-semibold mb-4">Membership</h3>
            <ul className="space-y-2">
              {[
                { href: `/${locale}/register`, label: 'Join JRA' },
                { href: `/${locale}/login`, label: 'Member Login' },
                { href: `/${locale}/dashboard`, label: 'Member Dashboard' },
                { href: `/${locale}/contact`, label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">2nd Circle, Jabal Amman, Jordan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <a href="tel:+96264621558" className="text-sm text-gray-400 hover:text-gold transition-colors">
                  +962 6 4621558
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <a href="mailto:info@jra.jo" className="text-sm text-gray-400 hover:text-gold transition-colors">
                  info@jra.jo
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Jordan Restaurants Association. All rights reserved.</p>
          <p className="text-xs text-gray-500">Registered under Jordanian Regulations No. 47 of 2002</p>
        </div>
      </div>
    </footer>
  );
}
