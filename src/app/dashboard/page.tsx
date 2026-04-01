'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import LeadTable from '@/components/LeadTable';
import { Lead } from '@/types';

export default function DashboardPage() {
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const leadsRes = await fetch('/api/leads');
        const leadsData = await leadsRes.json();

        if (leadsData.success) {
          setRecentLeads(leadsData.data.slice(0, 5));
          setTotalLeads(leadsData.data.length);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your leads</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalLeads}</p>
              </div>
              <div className="bg-primary-500 p-4 rounded-full">
                <span className="text-white text-2xl">👥</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
            <a href="/leads" className="text-primary-600 hover:text-primary-900 text-sm font-medium">
              View All
            </a>
          </div>
          <LeadTable leads={recentLeads} />
        </div>
      </main>
    </div>
  );
}
