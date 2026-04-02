import { NextRequest, NextResponse } from 'next/server';
import { LeadModel, ActivityModel } from '@/lib/models';
import { UpdateLeadDTO } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseInt(id);

    if (isNaN(leadId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid lead ID' },
        { status: 400 }
      );
    }

    const lead = await LeadModel.findById(leadId);

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    const activities = await ActivityModel.findByLeadId(leadId);

    return NextResponse.json({
      success: true,
      data: { ...lead, activities },
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseInt(id);
    const body: UpdateLeadDTO = await request.json();

    if (isNaN(leadId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid lead ID' },
        { status: 400 }
      );
    }

    const existingLead = await LeadModel.findById(leadId);
    if (!existingLead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Normalize email before checking and updating
    if (body.email !== undefined) {
      const trimmedEmail = body.email.toString().trim();
      if (trimmedEmail === '') {
        delete body.email; // don't overwrite with empty string
      } else {
        body.email = trimmedEmail;
      }
    }

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingLead.email) {
      const emailExists = await LeadModel.findByEmail(body.email, leadId);
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'A lead with this email already exists' },
          { status: 409 }
        );
      }
    }

    const lead = await LeadModel.update(leadId, body);
    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseInt(id);

    if (isNaN(leadId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid lead ID' },
        { status: 400 }
      );
    }

    const deleted = await LeadModel.delete(leadId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
