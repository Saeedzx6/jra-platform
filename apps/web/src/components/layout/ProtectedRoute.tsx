'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
  locale: string;
}

export function ProtectedRoute({ children, requiredRole, locale }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/${locale}/login`);
      return;
    }
    if (requiredRole && user.role !== requiredRole) {
      router.replace(`/${locale}/dashboard`);
    }
  }, [user, loading, router, locale, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-navy border-t-gold" />
      </div>
    );
  }

  if (!user) return null;
  if (requiredRole && user.role !== requiredRole) return null;

  return <>{children}</>;
}
