import { query } from './db';
import { Lead, CreateLeadDTO, UpdateLeadDTO, Activity, CreateActivityDTO } from '@/types';

function formatLead(row: any): Lead {
  if (!row) return null as any;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    from: row.from,
    cityRegion: row.city_region,
    details: row.details,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export class LeadModel {
  static async findAll(filters?: { status?: string; search?: string }): Promise<Lead[]> {
    let sql = 'SELECT * FROM leads';
    const params: any[] = [];
    const conditions: string[] = [];

    if (filters?.status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(filters.status);
    }

    if (filters?.search) {
      conditions.push(`(name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1} OR phone ILIKE $${params.length + 1})`);
      params.push(`%${filters.search}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    return result.rows.map(formatLead);
  }

  static async findById(id: number): Promise<Lead | null> {
    const result = await query('SELECT * FROM leads WHERE id = $1', [id]);
    return formatLead(result.rows[0]);
  }

  static async findByEmail(email?: string | null, excludeId?: number): Promise<Lead | null> {
    if (!email) {
      return null;
    }

    const params: any[] = [email];
    let sql = 'SELECT * FROM leads WHERE email = $1';
    if (excludeId !== undefined) {
      sql += ' AND id != $2';
      params.push(excludeId);
    }

    const result = await query(sql, params);
    return formatLead(result.rows[0]);
  }

  static async create(data: CreateLeadDTO): Promise<Lead> {
    const {
      name,
      email,
      phone,
      from,
      cityRegion,
      details,
      status = 'first_dm',
    } = data;

    const normalizedEmail = email?.toString().trim() || null;

    const result = await query(
      `INSERT INTO leads (name, email, phone, "from", city_region, details, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name || null, normalizedEmail, phone || null, from || null, cityRegion || null, details || null, status]
    );

    return formatLead(result.rows[0]);
  }

  static async update(id: number, data: UpdateLeadDTO): Promise<Lead | null> {
    const fields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Map of JS property names to SQL column names
    const columnMap: Record<string, string> = {
      cityRegion: 'city_region',
      from: '"from"',  // Quote reserved keyword
    };

    for (const [key, value] of Object.entries(data)) {
      let normalizedValue = value;

      if (typeof value === 'string') {
        normalizedValue = value.trim();
      }

      if (key === 'email' && normalizedValue === '') {
        normalizedValue = null; // Normalize empty email to null to avoid unique index collision on empty string.
      }

      if (normalizedValue !== undefined) {
        const columnName = columnMap[key] || key;
        fields.push(`${columnName} = $${paramIndex}`);
        params.push(normalizedValue);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const result = await query(
      `UPDATE leads SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    return formatLead(result.rows[0]);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM leads WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export class ActivityModel {
  static async findByLeadId(leadId: number): Promise<Activity[]> {
    const result = await query(
      'SELECT * FROM activities WHERE lead_id = $1 ORDER BY created_at DESC',
      [leadId]
    );
    return result.rows;
  }

  static async create(data: CreateActivityDTO): Promise<Activity> {
    const { lead_id, type, description } = data;

    const result = await query(
      `INSERT INTO activities (lead_id, type, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [lead_id, type, description || null]
    );

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM activities WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
