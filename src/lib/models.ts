import { query } from './db';
import { Lead, CreateLeadDTO, UpdateLeadDTO, Activity, CreateActivityDTO } from '@/types';

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
    return result.rows;
  }

  static async findById(id: number): Promise<Lead | null> {
    const result = await query('SELECT * FROM leads WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<Lead | null> {
    const result = await query('SELECT * FROM leads WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async create(data: CreateLeadDTO): Promise<Lead> {
    const {
      name,
      email,
      phone,
      details,
      status = 'first_dm',
    } = data;

    const result = await query(
      `INSERT INTO leads (name, email, phone, details, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name || null, email || null, phone || null, details || null, status]
    );

    return result.rows[0];
  }

  static async update(id: number, data: UpdateLeadDTO): Promise<Lead | null> {
    const fields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        fields.push(`${key} = $${paramIndex}`);
        params.push(value);
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

    return result.rows[0] || null;
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
