'use client';

import { useState } from 'react';

interface SearchFilterProps {
  onSearch?: (search: string) => void;
  onStatusFilter?: (status: string) => void;
  onRefresh?: () => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'no_message', label: 'No Message' },
  { value: 'first_dm', label: 'First DM' },
  { value: 'lead', label: 'Lead' },
  { value: 'client', label: 'Client' },
];

export default function SearchFilter({ onSearch, onStatusFilter, onRefresh }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatus(value);
    onStatusFilter?.(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="input-field"
        />
      </div>
      <div>
        <select
          value={status}
          onChange={handleStatusChange}
          className="input-field w-full sm:w-48"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {onRefresh && (
        <button onClick={onRefresh} className="btn-secondary">
          Refresh
        </button>
      )}
    </div>
  );
}
