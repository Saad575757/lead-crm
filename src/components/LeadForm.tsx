'use client';

import { useState } from 'react';
import { Lead } from '@/types';

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

const statusOptions = [
  { value: 'no_message', label: 'No Message' },
  { value: 'first_dm', label: 'First DM' },
  { value: 'lead', label: 'Lead' },
  { value: 'client', label: 'Client' },
  
];

export default function LeadForm({ initialData, onSubmit, onCancel }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    from: initialData?.from || '',
    cityRegion: initialData?.cityRegion || '',
    details: initialData?.details || '',
    status: initialData?.status || 'first_dm',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <input
            type="text"
            id="from"
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g. Instagram, Facebook, Referral"
          />
        </div>

        <div>
          <label htmlFor="cityRegion" className="block text-sm font-medium text-gray-700 mb-1">
            City/Region
          </label>
          <input
            type="text"
            id="cityRegion"
            name="cityRegion"
            value={formData.cityRegion}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g. New York, NY"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
          Details
        </label>
        <textarea
          id="details"
          name="details"
          value={formData.details}
          onChange={handleChange}
          rows={6}
          className="input-field"
          placeholder="Add details about this lead..."
        />
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : initialData ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}
