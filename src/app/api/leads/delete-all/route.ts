import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(request: NextRequest) {
  try {
    // Delete all activities first (due to foreign key constraint)
    await query('DELETE FROM activities', []);
    
    // Delete all leads
    const result = await query('DELETE FROM leads RETURNING id', []);
    
    const deletedCount = result.rowCount || 0;

    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${deletedCount} leads`,
      data: { deletedCount }
    });
  } catch (error: any) {
    console.error('Error deleting all leads:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete all leads' },
      { status: 500 }
    );
  }
}
