import { NextRequest, NextResponse } from 'next/server';
import { whatsAppClient } from '@/lib/whatsapp-web';

export async function POST(request: NextRequest) {
  try {
    const { phone, message } = await request.json();

    if (!phone || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    if (!whatsAppClient.isClientReady()) {
      return NextResponse.json(
        { error: 'WhatsApp client is not ready. Please scan QR code first.' },
        { status: 503 }
      );
    }

    const success = await whatsAppClient.sendMessage(phone, message);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in WhatsApp send API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}