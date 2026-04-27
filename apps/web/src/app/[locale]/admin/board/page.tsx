'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BoardMember } from '@/types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Users } from 'lucide-react';

interface AdminBoardPageProps {
  params: { locale: string };
}

export default function AdminBoardPage({ params: { locale } }: AdminBoardPageProps) {
  const [board, setBoard] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<BoardMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BoardMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', title: '', photoUrl: '', order: '0' });

  const fetchBoard = async () => {
    setLoading(true);
    try {
      const res = await api.get<BoardMember[]>('/board');
      setBoard(res);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBoard(); }, []);

  const openCreate = () => {
    setEditMember(null);
    setForm({ name: '', title: '', photoUrl: '', order: String(board.length + 1) });
    setModalOpen(true);
  };

  const openEdit = (m: BoardMember) => {
    setEditMember(m);
    setForm({ name: m.name, title: m.title, photoUrl: m.photoUrl ?? '', order: String(m.order) });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, order: parseInt(form.order) };
      if (editMember) {
        await api.put(`/board/${editMember.id}`, payload);
      } else {
        await api.post('/board', payload);
      }
      setModalOpen(false);
      fetchBoard();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/board/${deleteTarget.id}`);
    setDeleteTarget(null);
    fetchBoard();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-navy">Board of Directors</h1>
        <Button onClick={openCreate}>+ Add Member</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {board.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center shrink-0">
                {m.photoUrl ? (
                  <img src={m.photoUrl} alt={m.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <Users className="h-7 w-7 text-gold" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-navy truncate">{m.name}</p>
                <p className="text-xs text-gold">{m.title}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="outline" onClick={() => openEdit(m)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(m)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editMember ? 'Edit Board Member' : 'Add Board Member'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Full Name</label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Title / Position</label>
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Photo URL (optional)</label>
            <Input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Display Order</label>
            <Input type="number" min="0" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1">{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Remove Board Member" description={`Remove ${deleteTarget?.name} from the board?`} onConfirm={handleDelete} confirmLabel="Remove" confirmVariant="destructive" />
    </div>
  );
}
