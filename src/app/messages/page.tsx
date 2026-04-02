'use client';

import { useState } from 'react';

interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  timing: string;
}

const messageTemplates: MessageTemplate[] = [
  {
    id: '1',
    title: 'First Message',
    content: `Hi [Business Name]! 👋\nYour business looks amazing, and I noticed it doesn't have a website yet. A simple website can help you reach more customers and make your services easier to find online.\nIf you want, I can put together a small demo showing how it could look.`,
    timing: 'Initial contact',
  },
  {
    id: '2',
    title: 'Follow-up 1 – Friendly Reminder',
    content: `Hey [Business Name]! 👋\nJust wanted to check if you got my message about creating a simple website for your business.\nEven a small site can help new customers find you online. Would you like me to put together that demo I mentioned?`,
    timing: '2–3 days after first message',
  },
  {
    id: '3',
    title: 'Follow-up 2 – Value + Question',
    content: `Hi [Business Name],\nI was thinking about your business and how a website could really highlight your services and attract more clients.\nIf it helps, I can show a couple of examples from similar businesses—would you like me to do that?`,
    timing: '4–5 days after first follow-up',
  },
  {
    id: '4',
    title: 'Follow-up 3 – Urgency + Soft Call-to-Action',
    content: `Hey [Business Name],\nI don't want you to miss out—having a simple, professional website can really help your business get noticed online.\nIf you're interested, I can quickly put together a demo so you can see how it might look. Does that sound good?`,
    timing: '1 week later',
  },
];

export default function MessagesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <a href="/" className="text-2xl font-bold text-primary-600">
                  BusinessCRM
                </a>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="/dashboard"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Dashboard
                </a>
                <a
                  href="/leads"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Leads
                </a>
                <a
                  href="/messages"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-primary-500 text-sm font-medium text-gray-900"
                >
                  Messages
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Message Templates</h1>
          <p className="text-gray-600 mt-1">DM scripts for reaching out to businesses</p>
        </div>

        <div className="space-y-6">
          {messageTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {template.title}
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                    {template.timing}
                  </span>
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {template.content}
                </p>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t">
                <button
                  onClick={() => handleCopy(template.content, template.id)}
                  className="text-sm text-primary-600 hover:text-primary-900 font-medium"
                >
                  {copiedId === template.id ? '✓ Copied!' : '📋 Copy Message'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
