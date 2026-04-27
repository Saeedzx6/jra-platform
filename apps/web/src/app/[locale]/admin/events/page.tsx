'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Event, PaginatedResponse } from '@/types';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { slugify, formatDate } from '@/lib/utils';

interface AdminEventsPageProps {
  params: { locale: string };
}

export default function AdminEventsPage({ params: { locale } }: AdminEventsPageProps) {
  const [data, setData] = useState<PaginatedResponse<Event>>({ data: [], total: 0, page: 1, limit: 10 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', description: '', date: '', location: '' });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse<Event>>(`/events?limit=10&page=${page}`);
      setData(res);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const openCreate = () => {
    setEditEvent(null);
    setForm({ title: '', slug: '', description: '', date: '', location: '' });
    setModalOpen(true);
  };

  const openEdit = (event: Event) => {
    setEditEvent(event);
    setForm({
      title: event.title,
      slug: event.slug,
      description: event.description,
      date: event.date.slice(0, 16),
      location: event.location,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editEvent) {
        await api.put(`/events/${editEvent.slug}`, form);
      } else {
        await api.post('/events', form);
      }
      setModalOpen(false);
      fetchEvents();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/events/${deleteTarget.slug}`);
    setDeleteTarget(null);
    fetchEvents();
  };

  const columns = [
    { key: 'title', header: 'Title', render: (e: Event) => <span className="font-medium text-navy">{e.title}</span> },
    { key: 'date', header: 'Date', render: (e: Event) => formatDate(e.date, locale) },
    { key: 'location', header: 'Location' },
    {
      key: 'actions',
      header: 'Actions',
      render: (e: Event) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(e)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(e)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-navy">Events</h1>
        <Button onClick={openCreate}>+ New Event</Button>
      </div>

      <DataTable columns={columns} data={data.data} total={data.total} page={page} limit={10} onPageChange={setPage} loading={loading} />

      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editEvent ? 'Edit Event' : 'New Event'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editEvent ? form.slug : slugify(e.target.value) })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Slug</label>
            <Input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Date & Time</label>
            <Input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <Input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1">{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Delete Event" description={`Delete "${deleteTarget?.title}"?`} onConfirm={handleDelete} confirmLabel="Delete" confirmVariant="destructive" />
    </div>
  );
}
