'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LeadForm from '@/components/LeadForm';
import { CreateLeadDTO } from '@/types';

export default function NewLeadPage() {
  const router = useRouter();

  async function handleSubmit(data: CreateLeadDTO) {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      router.push(`/leads/${result.data.id}`);
    } else {
      throw new Error(result.error || 'Failed to create lead');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Lead</h1>
          <p className="text-gray-600 mt-1">Create a new lead in your pipeline</p>
        </div>

        <div className="card">
          <LeadForm onSubmit={handleSubmit} onCancel={() => router.back()} />
        </div>
      </main>
    </div>
  );
}
