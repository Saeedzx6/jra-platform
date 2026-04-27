'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { MemberProfile, PaginatedResponse } from '@/types';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AdminMembersPageProps {
  params: { locale: string };
}

export default function AdminMembersPage({ params: { locale } }: AdminMembersPageProps) {
  const [data, setData] = useState<PaginatedResponse<MemberProfile>>({ data: [], total: 0, page: 1, limit: 20 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get<PaginatedResponse<MemberProfile>>(`/admin/members?${params}`);
      setData(res);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, [page, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/admin/members/${id}/status`, { status });
    fetchMembers();
  };

  const columns = [
    {
      key: 'businessName',
      header: 'Business Name',
      render: (m: MemberProfile) => <span className="font-medium text-navy">{m.businessName}</span>,
    },
    { key: 'category', header: 'Category', render: (m: MemberProfile) => m.category.replace('_', ' ') },
    { key: 'location', header: 'Location' },
    {
      key: 'status',
      header: 'Status',
      render: (m: MemberProfile) => (
        <Badge variant={m.status === 'ACTIVE' ? 'success' : m.status === 'SUSPENDED' ? 'danger' : 'warning'}>
          {m.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (m: MemberProfile) => (
        <div className="flex gap-2">
          {m.status !== 'ACTIVE' && (
            <Button size="sm" variant="default" onClick={() => updateStatus(m.id, 'ACTIVE')}>Approve</Button>
          )}
          {m.status === 'ACTIVE' && (
            <Button size="sm" variant="destructive" onClick={() => updateStatus(m.id, 'SUSPENDED')}>Suspend</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-navy">Members</h1>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>
      <DataTable
        columns={columns}
        data={data.data}
        total={data.total}
        page={page}
        limit={20}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
}
