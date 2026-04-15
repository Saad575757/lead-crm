'use client';

import { useState } from 'react';
import { sendWhatsApp } from '@/lib/whatsapp';

interface WhatsAppMessageProps {
  phone: string;
  businessName: string;
  size?: 'sm' | 'md';
}

export default function WhatsAppMessage({ phone, businessName, size = 'md' }: WhatsAppMessageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMessage = `Hi ${businessName}! 👋
Your business looks amazing, and I noticed it doesn't have a website yet. A simple website can help you reach more customers and make your services easier to find online.
If you want, I can put together a small demo showing how it could look.`;

  const [message, setMessage] = useState(defaultMessage);

  function handleSend() {
    sendWhatsApp(phone, message);
    setIsOpen(false);
  }

  const sizeClasses = size === 'sm' ? 'p-1.5' : 'p-2';

  if (!phone) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`${sizeClasses} text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors`}
        title="Send WhatsApp Message"
      >
        <svg className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
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
          <h3 className="text-lg font-semibold text-gray-900">Send WhatsApp Message</h3>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Sending to: <span className="font-medium text-gray-900">{phone}</span>
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={6}
            placeholder="Type your message here..."
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700"
          >
            Send via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
