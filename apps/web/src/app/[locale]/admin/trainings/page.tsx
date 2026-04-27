'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Training, PaginatedResponse } from '@/types';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { slugify, formatDate, formatPrice } from '@/lib/utils';

interface AdminTrainingsPageProps {
  params: { locale: string };
}

export default function AdminTrainingsPage({ params: { locale } }: AdminTrainingsPageProps) {
  const [data, setData] = useState<PaginatedResponse<Training>>({ data: [], total: 0, page: 1, limit: 10 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTraining, setEditTraining] = useState<Training | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Training | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', description: '', date: '', price: '', seats: '' });

  const fetchTrainings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse<Training>>(`/trainings?limit=10&page=${page}`);
      setData(res);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchTrainings(); }, [fetchTrainings]);

  const openCreate = () => {
    setEditTraining(null);
    setForm({ title: '', slug: '', description: '', date: '', price: '', seats: '' });
    setModalOpen(true);
  };

  const openEdit = (t: Training) => {
    setEditTraining(t);
    setForm({ title: t.title, slug: t.slug, description: t.description, date: t.date.slice(0, 16), price: String(t.price), seats: String(t.seats) });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTraining) {
        await api.put(`/trainings/${editTraining.slug}`, form);
      } else {
        await api.post('/trainings', form);
      }
      setModalOpen(false);
      fetchTrainings();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/trainings/${deleteTarget.slug}`);
    setDeleteTarget(null);
    fetchTrainings();
  };

  const columns = [
    { key: 'title', header: 'Title', render: (t: Training) => <span className="font-medium text-navy">{t.title}</span> },
    { key: 'date', header: 'Date', render: (t: Training) => formatDate(t.date, locale) },
    { key: 'price', header: 'Price', render: (t: Training) => formatPrice(t.price) },
    { key: 'seats', header: 'Seats' },
    {
      key: 'actions',
      header: 'Actions',
      render: (t: Training) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(t)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(t)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-navy">Training Programs</h1>
        <Button onClick={openCreate}>+ New Training</Button>
      </div>

      <DataTable columns={columns} data={data.data} total={data.total} page={page} limit={10} onPageChange={setPage} loading={loading} />

      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editTraining ? 'Edit Training' : 'New Training'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editTraining ? form.slug : slugify(e.target.value) })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Slug</label>
            <Input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Price (JOD)</label>
              <Input type="number" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Seats</label>
            <Input type="number" min="1" required value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1">{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Delete Training" description={`Delete "${deleteTarget?.title}"?`} onConfirm={handleDelete} confirmLabel="Delete" confirmVariant="destructive" />
    </div>
  );
}
