'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import LeadTable from '@/components/LeadTable';
import SearchFilter from '@/components/SearchFilter';
import { Lead } from '@/types';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter) params.set('status', statusFilter);
      if (dateFilter) params.set('date', dateFilter);

      const response = await fetch(`/api/leads?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleDateFilter(date: string) {
    setDateFilter(date);
    fetchLeadsWithFilters(searchTerm, statusFilter, date);
  }

  async function fetchLeadsWithFilters(search: string, status: string, date: string) {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (date) params.set('date', date);

      const response = await fetch(`/api/leads?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        setLeads(leads.filter((lead) => lead.id !== id));
      } else {
        alert('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">Manage and track your leads</p>
        </div>

        <SearchFilter
          onSearch={(search) => {
            setSearchTerm(search);
            fetchLeadsWithFilters(search, statusFilter, dateFilter);
          }}
          onStatusFilter={(status) => {
            setStatusFilter(status);
            fetchLeadsWithFilters(searchTerm, status, dateFilter);
          }}
          onDateFilter={handleDateFilter}
          onRefresh={fetchLeads}
        />

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leads...</p>
          </div>
        ) : (
          <div className="card">
            <LeadTable leads={leads} onDelete={handleDelete} />
          </div>
        )}
      </main>
    </div>
  );
}
