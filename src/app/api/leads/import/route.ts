import { NextRequest, NextResponse } from 'next/server';
import { LeadModel } from '@/lib/models';
import { CreateLeadDTO } from '@/types';
import * as XLSX from 'xlsx';

// Detect delimiter (comma, tab, or semicolon)
function detectDelimiter(line: string): string {
  if (line.includes('\t')) return '\t';
  if (line.includes(';')) return ';';
  return ',';
}

// Proper CSV/TSV parser that handles quoted fields
function parseCSVLine(line: string, delimiter: string = ','): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === delimiter && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xls') || fileName.endsWith('.xlsx');
    const isCSV = fileName.endsWith('.csv');

    if (!isExcel && !isCSV) {
      return NextResponse.json(
        { success: false, error: 'Only CSV, XLS, or XLSX files are allowed' },
        { status: 400 }
      );
    }

    let rows: string[][] = [];

    if (isExcel) {
      // Parse Excel file
      const buffer = Buffer.from(await file.arrayBuffer());
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to array of arrays (skipping header row for now)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
      rows = jsonData;
    } else {
      // Parse CSV file
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        return NextResponse.json(
          { success: false, error: 'CSV file is empty or has no data rows' },
          { status: 400 }
        );
      }

      const delimiter = detectDelimiter(lines[0]);
      rows = lines.map(line => parseCSVLine(line, delimiter));
    }

    if (rows.length < 2) {
      return NextResponse.json(
        { success: false, error: 'File has no data rows' },
        { status: 400 }
      );
    }

    // Extract header and map columns
    const header = rows[0].map(h => String(h).toLowerCase().trim());
    console.log('Headers detected:', header);

    // Map ONLY Name and Phone fields
    const columnMap: Record<string, keyof CreateLeadDTO> = {
      'name': 'name',
      'full name': 'name',
      'full_name': 'name',
      'fullname': 'name',
      'phone': 'phone',
      'phone number': 'phone',
      'phone_number': 'phone',
      'phonenumber': 'phone',
      'mobile': 'phone',
      'mobile number': 'phone',
      'mobile_number': 'phone',
    };

    // Map header columns to our fields
    const fieldMapping = header.map(col => columnMap[col]);
    console.log('Field mapping:', fieldMapping);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      importedLeads: [] as Array<{ name: string; phone: string }>,
    };

    // Process each data row - ONLY extract Name and Phone (skip header row at index 0)
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i];
      
      // Skip empty rows
      if (!values || values.every(v => !v || String(v).trim() === '')) {
        continue;
      }

      const leadData: CreateLeadDTO = {};

      // Map ONLY name and phone from this row
      header.forEach((_, index) => {
        const field = fieldMapping[index];
        const value = values[index] ? String(values[index]).trim() : '';

        if (field && value && value !== '') {
          if (field === 'phone') {
            // Clean phone number - remove ALL non-digit characters except +
            // This removes hidden Unicode chars, spaces, dashes, parentheses, etc.
            const cleanedPhone = value.replace(/[^\d+]/g, '');
            leadData[field] = cleanedPhone;
          } else {
            (leadData as any)[field] = value;
          }
        }
      });

      // Skip rows with no valid data
      if (Object.keys(leadData).length === 0) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: No valid data`);
        continue;
      }

      try {
        // Check for duplicate email if email is provided
        if (leadData.email) {
          const normalizedEmail = leadData.email.toString().trim();
          if (normalizedEmail === '') {
            delete leadData.email;
          } else {
            leadData.email = normalizedEmail;
            const emailExists = await LeadModel.findByEmail(leadData.email);
            if (emailExists) {
              results.failed++;
              results.errors.push(`Row ${i + 1}: Email '${leadData.email}' already exists`);
              continue;
            }
          }
        }

        // Set default status if not provided
        if (!leadData.status) {
          leadData.status = 'first_dm';
        }

        await LeadModel.create(leadData);
        results.success++;
        
        // Track imported lead for WhatsApp messaging
        if (leadData.name && leadData.phone) {
          results.importedLeads.push({
            name: leadData.name,
            phone: leadData.phone,
          });
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${error.message || 'Unknown error'}`);
        console.error(`Error importing row ${i + 1}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('Error processing CSV import:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to import CSV' },
      { status: 500 }
    );
  }
}
