import Link from 'next/link';
import { Lead } from '@/types';

interface LeadTableProps {
  leads: Lead[];
  onDelete?: (id: number) => void;
}

function getStatusBadgeClass(status: string): string {
  const statusMap: Record<string, string> = {
    first_dm: 'bg-blue-100 text-blue-800',
    lead: 'bg-yellow-100 text-yellow-800',
    client: 'bg-green-100 text-green-800',
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
}

function getStatusLabel(status: string): string {
  const labelMap: Record<string, string> = {
    first_dm: 'First DM',
    lead: 'Lead',
    client: 'Client',
  };
  return labelMap[status] || status;
}

export default function LeadTable({ leads, onDelete }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No leads found</p>
        <Link href="/leads/new" className="btn-primary mt-4 inline-block">
          Add Your First Lead
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              From
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              City/Region
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{lead.name || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{lead.email || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{lead.phone || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{lead.from || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{lead.cityRegion || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`status-badge ${getStatusBadgeClass(lead.status)}`}>
                  {getStatusLabel(lead.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/leads/${lead.id}`}
                  className="text-primary-600 hover:text-primary-900 mr-3"
                >
                  View
                </Link>
                {onDelete && (
                  <button
                    onClick={() => onDelete(lead.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
