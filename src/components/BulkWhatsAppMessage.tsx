'use client';

import { useState } from 'react';
import { Lead } from '@/types';

interface BulkWhatsAppMessageProps {
  selectedLeads: Lead[];
  onComplete?: () => void;
}

export default function BulkWhatsAppMessage({ selectedLeads, onComplete }: BulkWhatsAppMessageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);

  const defaultMessage = `Hi👋
Your business looks amazing, and I noticed it doesn't have a website yet. A simple website can help you reach more customers and make your services easier to find online.
If you want, I can put together a small demo showing how it could look.

Website: https://muhammad-saad-khan-dev.vercel.app/
Email: muhammadsaadprofessional@gmail.com`;

  const [message, setMessage] = useState(defaultMessage);

  async function handleSend() {
    if (selectedLeads.length === 0) return;
    
    setIsSending(true);
    setProgress(0);
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedLeads.length; i++) {
      const lead = selectedLeads[i];
      if (!lead.phone) {
        failCount++;
        setProgress(Math.round(((i + 1) / selectedLeads.length) * 100));
        continue;
      }

      const personalizedMessage = message.replace('{{name}}', lead.name || 'there');

      try {
        const response = await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: lead.phone,
            message: personalizedMessage,
          }),
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error(`Error sending to ${lead.phone}:`, error);
        failCount++;
      }
      
      setProgress(Math.round(((i + 1) / selectedLeads.length) * 100));
    }

    setIsSending(false);
    alert(`Finished! Successfully sent: ${successCount}, Failed: ${failCount}`);
    setIsOpen(false);
    if (onComplete) onComplete();
  }

  if (selectedLeads.length === 0) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Send WhatsApp ({selectedLeads.length})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Bulk WhatsApp Message</h3>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">
            Sending to: 
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedLeads.map(lead => (
                <span key={lead.id} className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-700 text-xs">
                  {lead.name || 'Unnamed'}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-2 italic">
            Use {"{{name}}"} to personalize the message with the lead's name.
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-[#333] text-sm"
            rows={5}
            placeholder="Type your message here..."
            disabled={isSending}
          />
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Preview for {selectedLeads[0]?.name || 'first lead'}:</h4>
          <div className="text-sm text-gray-800 whitespace-pre-wrap">
            {message.replace('{{name}}', selectedLeads[0]?.name || 'there')}
          </div>
        </div>

        {isSending && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Sending...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="btn-secondary"
            disabled={isSending}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700"
          >
            {isSending ? 'Sending...' : 'Send to All'}
          </button>
        </div>
      </div>
    </div>
  );
}
