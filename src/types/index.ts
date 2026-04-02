export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  from?: string;
  cityRegion?: string;
  details?: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 'first_dm' | 'lead' | 'client' | 'no_message';

export interface Activity {
  id: number;
  lead_id: number;
  type: ActivityType;
  description?: string;
  created_at: string;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task' | 'other';

export interface CreateLeadDTO {
  name?: string;
  email?: string;
  phone?: string;
  from?: string;
  cityRegion?: string;
  details?: string;
  status?: LeadStatus;
}

export interface UpdateLeadDTO {
  name?: string;
  email?: string;
  phone?: string;
  from?: string;
  cityRegion?: string;
  details?: string;
  status?: LeadStatus;
}

export interface CreateActivityDTO {
  lead_id: number;
  type: ActivityType;
  description?: string;
}
