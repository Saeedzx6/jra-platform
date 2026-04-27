'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Post, PaginatedResponse } from '@/types';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { slugify } from '@/lib/utils';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface AdminPostsPageProps {
  params: { locale: string };
}

function RichTextEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="border border-gray-300 rounded-md tiptap-editor">
      {editor && (
        <div className="flex gap-1 p-2 border-b border-gray-200 flex-wrap">
          {[
            { label: 'B', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
            { label: 'I', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
            { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
            { label: 'UL', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
            { label: 'OL', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
          ].map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={btn.action}
              className={`px-2 py-1 rounded text-xs font-semibold ${btn.active ? 'bg-navy text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}

export default function AdminPostsPage({ params: { locale } }: AdminPostsPageProps) {
  const [data, setData] = useState<PaginatedResponse<Post>>({ data: [], total: 0, page: 1, limit: 10 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', content: '', excerpt: '', published: false });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse<Post>>(`/posts?limit=10&page=${page}&all=true`);
      setData(res);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openCreate = () => {
    setEditPost(null);
    setForm({ title: '', slug: '', content: '', excerpt: '', published: false });
    setModalOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditPost(post);
    setForm({ title: post.title, slug: post.slug, content: post.content ?? '', excerpt: post.excerpt ?? '', published: post.published });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editPost) {
        await api.put(`/posts/${editPost.slug}`, form);
      } else {
        await api.post('/posts', form);
      }
      setModalOpen(false);
      fetchPosts();
    } catch {
      //
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/posts/${deleteTarget.slug}`);
    setDeleteTarget(null);
    fetchPosts();
  };

  const columns = [
    { key: 'title', header: 'Title', render: (p: Post) => <span className="font-medium text-navy line-clamp-1">{p.title}</span> },
    { key: 'published', header: 'Status', render: (p: Post) => <Badge variant={p.published ? 'success' : 'warning'}>{p.published ? 'Published' : 'Draft'}</Badge> },
    { key: 'createdAt', header: 'Created', render: (p: Post) => new Date(p.createdAt).toLocaleDateString() },
    {
      key: 'actions',
      header: 'Actions',
      render: (p: Post) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(p)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(p)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-navy">Blog Posts</h1>
        <Button onClick={openCreate}>+ New Post</Button>
      </div>

      <DataTable columns={columns} data={data.data} total={data.total} page={page} limit={10} onPageChange={setPage} loading={loading} />

      {/* Create/Edit modal */}
      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editPost ? 'Edit Post' : 'New Post'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editPost ? form.slug : slugify(e.target.value) })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Slug</label>
            <Input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Excerpt</label>
            <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Content</label>
            <RichTextEditor content={form.content} onChange={(html) => setForm({ ...form, content: html })} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" />
            <span className="text-sm">Published</span>
          </label>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1">{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Post"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
}
