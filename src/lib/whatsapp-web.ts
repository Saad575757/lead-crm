import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

class WhatsAppClient {
  private client: Client;
  private isReady = false;

  constructor() {
    this.client = new Client({
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    this.client.on('qr', (qr) => {
      console.log('QR Code received, scan it with WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true;
    });

    this.client.on('auth_failure', (msg) => {
      console.error('Authentication failed:', msg);
    });

    this.client.initialize();
  }

  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
  try {
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    const numberId = await this.client.getNumberId(cleanNumber);
    if (!numberId?._serialized) {
      throw new Error(`Invalid or unregistered WhatsApp number: ${cleanNumber}`);
    }

    console.log('Sending to:', numberId._serialized);
    const result = await this.client.sendMessage(numberId._serialized, message);
    console.log('Sent message id:', result.id._serialized);

    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}

  getClient() {
    return this.client;
  }

  isClientReady() {
    return this.isReady;
  }
}

// Export singleton instance
export const whatsAppClient = new WhatsAppClient();