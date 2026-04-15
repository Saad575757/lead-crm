'use client';

import { useState, useRef } from 'react';

interface CSVUploadResult {
  success: number;
  failed: number;
  errors: string[];
  importedLeads?: Array<{ name: string; phone: string }>;
}

interface CSVUploadProps {
  onImportComplete?: (result: CSVUploadResult) => void;
  onCancel?: () => void;
}

export default function CSVUpload({ onImportComplete, onCancel }: CSVUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<CSVUploadResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedLeads, setImportedLeads] = useState<Array<{ name: string; phone: string }>>([]);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  function handleFileSelect(selectedFile: File) {
    const validExtensions = ['.csv', '.xls', '.xlsx'];
    const hasValidExtension = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));
    
    if (!hasValidExtension) {
      alert('Please select a CSV, XLS, or XLSX file');
      return;
    }
    setFile(selectedFile);
    setResult(null);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }

  async function handleUpload() {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/leads/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setImportedLeads(data.data.importedLeads || []);
        onImportComplete?.(data.data);
      } else {
        alert(data.error || 'Failed to import CSV');
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert('Failed to upload CSV file');
    } finally {
      setUploading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setResult(null);
    setImportedLeads([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleSendWhatsAppToAll() {
    const leadsWithPhone = importedLeads.filter(lead => lead.phone);
    if (leadsWithPhone.length === 0) {
      alert('No phone numbers available to send WhatsApp messages');
      return;
    }

    setSendingWhatsApp(true);
    
    // Send WhatsApp messages with a small delay between each
    for (const lead of leadsWithPhone) {
      const phone = lead.phone.replace(/\D/g, '');
      const message = `Hi ${lead.name}! 👋
Your business looks amazing, and I noticed it doesn't have a website yet. A simple website can help you reach more customers and make your services easier to find online.
If you want, I can put together a small demo showing how it could look.`;
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      // Small delay between opening WhatsApp links
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setSendingWhatsApp(false);
  }

  if (result) {
    return (
      <div className="card">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Import Results</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600">Successfully Imported</p>
              <p className="text-2xl font-bold text-green-700">{result.success}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">Failed</p>
              <p className="text-2xl font-bold text-red-700">{result.failed}</p>
            </div>
          </div>
        </div>

        {result.errors.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Errors:</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
              <ul className="text-xs text-gray-600 space-y-1">
                {result.errors.map((error, index) => (
                  <li key={index} className="text-red-600">• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {importedLeads.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">
              📱 Send WhatsApp Messages
            </p>
            <p className="text-xs text-blue-700 mb-3">
              You can send WhatsApp messages to all imported leads with phone numbers.
            </p>
            <button
              onClick={handleSendWhatsAppToAll}
              disabled={sendingWhatsApp}
              className="btn-primary bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingWhatsApp ? 'Sending...' : `Send WhatsApp to ${importedLeads.length} Leads`}
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="btn-primary"
          >
            Import Another File
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Leads from File</h3>
        <p className="text-sm text-gray-600">
          Upload a CSV or Excel file with your leads. Supported columns: Name, Phone
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {file ? (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <label
                htmlFor="csv-upload"
                className="text-primary-600 hover:text-primary-500 cursor-pointer font-medium"
              >
                Click to upload
              </label>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">CSV, XLS, or XLSX file</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          id="csv-upload"
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={handleInputChange}
          className="sr-only"
        />
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 font-medium mb-1">Supported Formats: CSV, XLS, XLSX</p>
        <p className="text-xs text-blue-700">Example CSV:</p>
        <code className="text-xs text-blue-700 block mt-1">
          Name,Phone<br/>
          John Doe,+1234567890
        </code>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Importing...' : 'Import CSV'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={uploading}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
