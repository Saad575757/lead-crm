import { NextRequest, NextResponse } from 'next/server';
import { LeadModel } from '@/lib/models';
import { CreateLeadDTO } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    const filters = { search, status };
    const leads = await LeadModel.findAll(filters);

    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateLeadDTO = await request.json();

    if (body.email !== undefined) {
      const normalizedEmail = body.email.toString().trim();
      if (normalizedEmail === '') {
        delete body.email;
      } else {
        body.email = normalizedEmail;
      }

      if (body.email) {
        const emailExists = await LeadModel.findByEmail(body.email);
        if (emailExists) {
          return NextResponse.json(
            { success: false, error: 'A lead with this email already exists' },
            { status: 409 }
          );
        }
      }
    }

    const lead = await LeadModel.create(body);
    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
