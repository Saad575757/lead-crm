'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import LeadTable from '@/components/LeadTable';
import SearchFilter from '@/components/SearchFilter';
import CSVUpload from '@/components/CSVUpload';
import BulkWhatsAppMessage from '@/components/BulkWhatsAppMessage';
import { Lead } from '@/types';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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
        // Clear selection when filters change as the visible leads change
        setSelectedIds([]);
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
        setSelectedIds(selectedIds.filter(sid => sid !== id));
      } else {
        alert('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    }
  }

  async function handleDeleteSelected() {
    if (selectedIds.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected leads?`)) return;

    try {
      // We could add a bulk delete API, but for now we'll delete them one by one or 
      // check if there's a bulk delete route. The existing delete-all is for ALL.
      // Let's assume we might need a new API or just loop for now.
      // Better to check if we have a bulk delete API.
      
      const results = await Promise.all(
        selectedIds.map(id => fetch(`/api/leads/${id}`, { method: 'DELETE' }).then(r => r.json()))
      );

      const successCount = results.filter(r => r.success).length;
      
      if (successCount > 0) {
        setLeads(leads.filter(lead => !selectedIds.includes(lead.id)));
        setSelectedIds([]);
        if (successCount < selectedIds.length) {
          alert(`Deleted ${successCount} out of ${selectedIds.length} leads. Some failed.`);
        }
      } else {
        alert('Failed to delete selected leads');
      }
    } catch (error) {
      console.error('Error deleting selected leads:', error);
      alert('Failed to delete selected leads');
    }
  }

  function handleImportComplete(result: { success: number }) {
    if (result.success > 0) {
      fetchLeads();
    }
  }

  async function handleDeleteAll() {
    if (leads.length === 0) {
      alert('No leads to delete');
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete ALL ${leads.length} leads? This action cannot be undone!`
    );

    if (!confirmed) return;

    try {
      const response = await fetch('/api/leads/delete-all', { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        setLeads([]);
        setSelectedIds([]);
        alert(`Successfully deleted ${data.data.deletedCount} leads`);
      } else {
        alert('Failed to delete all leads');
      }
    } catch (error) {
      console.error('Error deleting all leads:', error);
      alert('Failed to delete all leads');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600 mt-1">Manage and track your leads</p>
          </div>
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <>
                <BulkWhatsAppMessage 
                  selectedLeads={leads.filter(lead => selectedIds.includes(lead.id))} 
                  onComplete={() => setSelectedIds([])}
                />
                <button
                  onClick={handleDeleteSelected}
                  className="btn-danger bg-red-100 !text-red-700 hover:bg-red-200 border-none"
                >
                  Delete Selected ({selectedIds.length})
                </button>
              </>
            )}
            <button
              onClick={() => setShowImport(!showImport)}
              className="btn-secondary"
            >
              {showImport ? 'Cancel Import' : 'Import CSV'}
            </button>
            <button
              onClick={handleDeleteAll}
              className="btn-danger"
              disabled={leads.length === 0}
            >
              Delete All
            </button>
          </div>
        </div>

        {showImport && (
          <div className="mb-8">
            <CSVUpload
              onImportComplete={handleImportComplete}
              onCancel={() => setShowImport(false)}
            />
          </div>
        )}

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
            <LeadTable 
              leads={leads} 
              onDelete={handleDelete}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          </div>
        )}
      </main>
    </div>
  );
}
