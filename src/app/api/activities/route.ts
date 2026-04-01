import { NextRequest, NextResponse } from 'next/server';
import { ActivityModel } from '@/lib/models';
import { CreateActivityDTO } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateActivityDTO = await request.json();

    if (!body.lead_id || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Lead ID and activity type are required' },
        { status: 400 }
      );
    }

    const activity = await ActivityModel.create(body);
    return NextResponse.json({ success: true, data: activity }, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}
