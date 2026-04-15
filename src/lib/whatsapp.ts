// WhatsApp message utility

export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digit characters
  return phone.replace(/\D/g, '');
}

export function getWhatsAppLink(phone: string, message: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

export function sendWhatsApp(phone: string, message: string): void {
  const link = getWhatsAppLink(phone, message);
  window.open(link, '_blank');
}
