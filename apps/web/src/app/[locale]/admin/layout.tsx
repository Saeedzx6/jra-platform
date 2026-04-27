'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Users, Calendar, BookOpen, FileText, LayoutDashboard, UserCheck, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function AdminLayout({ children, params: { locale } }: AdminLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: `/${locale}/admin`, icon: LayoutDashboard, label: 'Overview' },
    { href: `/${locale}/admin/members`, icon: Users, label: 'Members' },
    { href: `/${locale}/admin/events`, icon: Calendar, label: 'Events' },
    { href: `/${locale}/admin/trainings`, icon: BookOpen, label: 'Trainings' },
    { href: `/${locale}/admin/posts`, icon: FileText, label: 'Blog Posts' },
    { href: `/${locale}/admin/board`, icon: UserCheck, label: 'Board' },
  ];

  return (
    <ProtectedRoute locale={locale} requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="w-56 bg-navy text-white fixed top-16 bottom-0 left-0 overflow-y-auto z-30">
          <div className="p-4 border-b border-white/10">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Admin Panel</p>
          </div>
          <nav className="p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors',
                  pathname === item.href
                    ? 'bg-gold text-navy'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 ml-56">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
