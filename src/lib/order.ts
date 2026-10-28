import type { CardData } from '../types/card.ts';
import { CONTACT_EMAIL, optionalFields, pricing, themeLabels } from '../data/config.ts';
export function safeUrl(value: string): string | undefined {
    try {
        const url = new URL(value);
        return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
    }
    catch {
        return undefined;
    }
}
export function orderBody(card: CardData) {
    return ['Hola, Tap Mola:', '', 'Me gustaría solicitar mi tarjeta NFC con estos datos:', '',
        `Nombre: ${card.name.trim()}`, `Email: ${card.email.trim()}`, card.business && `Empresa o marca: ${card.business.trim()}`,
        ...optionalFields.map(({ key, label }) => card[key] && `${label}: ${card[key].trim()}`),
        ...card.links.filter(l => l.url).map(l => `${l.label || 'Otro enlace'}: ${l.url}`), '',
        `Diseño digital: ${themeLabels[card.theme]}`, `Cantidad: ${card.quantity} ${card.quantity === 1 ? 'tarjeta' : 'tarjetas'}`,
        `Total: ${pricing.find(p => p.quantity === card.quantity)!.price} €`,
        card.logoName ? `Logo: ${card.logoName} (debo adjuntar el archivo manualmente a este email).` : 'Sin logo adjunto.',
        card.notes && `Comentarios: ${card.notes.trim()}`, '', 'Quedo pendiente de confirmar el diseño final y los detalles de entrega y pago.', 'Gracias.'
    ].filter(line => line !== undefined).join('\n');
}
export function orderUrls(card: CardData) {
    const subject = `Solicitud Tap Mola — ${card.quantity} ${card.quantity === 1 ? 'tarjeta' : 'tarjetas'} — ${card.name.trim()}`;
    const body = orderBody(card);
    return { mailto: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
const vEscape = (v: string) => v.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
export function vCard(card: CardData) {
    return ['BEGIN:VCARD', 'VERSION:3.0', `FN:${vEscape(card.name || 'Tu nombre')}`, `ORG:${vEscape(card.business)}`, `TITLE:${vEscape(card.role)}`, `EMAIL:${vEscape(card.email)}`, `TEL:${vEscape(card.phone)}`, card.website && `URL:${safeUrl(card.website) || ''}`, 'END:VCARD'].filter(Boolean).join('\r\n');
}
export function downloadContact(card: CardData) {
    const url = URL.createObjectURL(new Blob([vCard(card)], { type: 'text/vcard;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.name || 'contacto'}.vcf`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
