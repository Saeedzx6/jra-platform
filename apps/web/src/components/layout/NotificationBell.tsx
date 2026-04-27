'use client';

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  locale: string;
}

export function NotificationBell({ locale }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get<Notification[]>('/notifications').then(setNotifications).catch(() => {});
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`, {});
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-300 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-gold rounded-full text-navy text-xs flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-navy text-sm">Notifications</span>
            {unread > 0 && (
              <button
                className="text-xs text-gold hover:underline"
                onClick={async () => {
                  await api.patch('/notifications/read-all', {});
                  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                }}
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-6">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={cn(
                    'px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors',
                    !n.read && 'bg-gold/5'
                  )}
                >
                  <p className={cn('text-sm', !n.read ? 'text-navy font-medium' : 'text-gray-600')}>{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
