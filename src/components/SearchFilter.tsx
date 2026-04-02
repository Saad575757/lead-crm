'use client';

import { useState } from 'react';

interface SearchFilterProps {
  onSearch?: (search: string) => void;
  onStatusFilter?: (status: string) => void;
  onDateFilter?: (date: string) => void;
  onRefresh?: () => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'no_message', label: 'No Message' },
  { value: 'first_dm', label: 'First DM' },
  { value: 'lead', label: 'Lead' },
  { value: 'client', label: 'Client' },
];

export default function SearchFilter({ onSearch, onStatusFilter, onDateFilter, onRefresh }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
    onDateFilter?.(value);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
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
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="input-field w-full sm:w-48"
          />
        </div>
      </div>
    </div>
  );
}
