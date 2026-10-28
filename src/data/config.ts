export const CONTACT_EMAIL = 'tapmolanfc@gmail.com';
export const pricing = [{ quantity: 1, price: 25, title: 'Tu primera conexión', description: 'Una tarjeta para llevar tu identidad contigo.' }, { quantity: 2, price: 30, title: 'Mejor, por duplicado', description: 'Dos tarjetas físicas con tu perfil personalizado.' }] as const;
export const themeLabels = { minimal: 'Minimal', natural: 'Natural', contrast: 'Contraste' };
export const optionalFields = [
    { key: 'role', label: 'Profesión o cargo', type: 'text', placeholder: 'Diseñadora de interiores' },
    { key: 'phone', label: 'Teléfono', type: 'tel', placeholder: '+34 600 000 000' },
    { key: 'location', label: 'Ubicación', type: 'text', placeholder: 'Madrid, España' },
    { key: 'instagram', label: 'Instagram', type: 'url', placeholder: 'https://instagram.com/tu-perfil' },
    { key: 'linkedin', label: 'LinkedIn', type: 'url', placeholder: 'https://linkedin.com/in/tu-perfil' },
    { key: 'maps', label: 'Google Maps', type: 'url', placeholder: 'https://maps.google.com/…' },
    { key: 'reviews', label: 'Reseñas de Google', type: 'url', placeholder: 'https://g.page/…' },
    { key: 'website', label: 'Página web', type: 'url', placeholder: 'https://tu-web.com' },
] as const;
