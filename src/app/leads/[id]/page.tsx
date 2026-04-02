'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LeadForm from '@/components/LeadForm';
import ActivityFeed from '@/components/ActivityFeed';
import { Lead, UpdateLeadDTO, CreateActivityDTO } from '@/types';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [activityType, setActivityType] = useState('note');

  useEffect(() => {
    async function fetchLead() {
      try {
        const response = await fetch(`/api/leads/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setLead(data.data);
          setActivities(data.data.activities || []);
        } else {
          router.push('/leads');
        }
      } catch (error) {
        console.error('Error fetching lead:', error);
        router.push('/leads');
      } finally {
        setLoading(false);
      }
    }

    fetchLead();
  }, [params.id, router]);

  async function handleUpdate(data: UpdateLeadDTO) {
    const response = await fetch(`/api/leads/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      setLead(result.data);
      setEditing(false);
    } else {
      throw new Error(result.error || 'Failed to update lead');
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`/api/leads/${params.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        router.push('/leads');
      } else {
        alert('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    }
  }

  async function handleAddActivity() {
    if (!newActivity.trim()) return;

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: parseInt(params.id as string),
          type: activityType as any,
          description: newActivity,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setActivities([result.data, ...activities]);
        setNewActivity('');
      }
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
            </div>
            <div className="flex space-x-3">
              {!editing ? (
                <button onClick={() => setEditing(true)} className="btn-primary">
                  Edit
                </button>
              ) : (
                <button onClick={() => setEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              )}
              <button onClick={handleDelete} className="btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {editing ? (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Lead</h2>
                <LeadForm
                  initialData={lead}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditing(false)}
                />
              </div>
            ) : (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.name || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.email || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.phone || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">From</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.from || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">City/Region</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.cityRegion || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`status-badge ${
                        lead.status === 'first_dm' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'client' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status === 'first_dm' ? 'First DM' :
                         lead.status === 'lead' ? 'Lead' :
                         lead.status === 'client' ? 'Client' :
                         lead.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
                {lead.details && (
                  <div className="mt-6 pt-6 border-t">
                    <dt className="text-sm font-medium text-gray-500">Details</dt>
                    <dd className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">{lead.details}</dd>
                  </div>
                )}
              </div>
            )}

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h2>
              <ActivityFeed activities={activities} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Activity</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Type
                  </label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="input-field"
                  >
                    <option value="note">Note</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="task">Task</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    rows={4}
                    className="input-field"
                    placeholder="Add details about this activity..."
                  />
                </div>
                <button onClick={handleAddActivity} className="btn-primary w-full">
                  Add Activity
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setEditing(true)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  ✏️ Edit Lead Details
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(lead.email);
                    alert('Email copied to clipboard');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  📋 Copy Email
                </button>
                {lead.phone && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(lead.phone!);
                      alert('Phone copied to clipboard');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    📋 Copy Phone
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
