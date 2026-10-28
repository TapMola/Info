export type Theme = 'minimal' | 'natural' | 'contrast';
export type OptionalField = 'role' | 'phone' | 'location' | 'instagram' | 'linkedin' | 'maps' | 'reviews' | 'website';
export interface CustomLink {
    id: string;
    label: string;
    url: string;
}
export interface CardData {
    name: string;
    email: string;
    business: string;
    role: string;
    phone: string;
    location: string;
    instagram: string;
    linkedin: string;
    maps: string;
    reviews: string;
    website: string;
    links: CustomLink[];
    theme: Theme;
    quantity: 1 | 2;
    logoUrl: string;
    logoName: string;
    notes: string;
}
export const emptyCard: CardData = { name: '', email: '', business: '', role: '', phone: '', location: '', instagram: '', linkedin: '', maps: '', reviews: '', website: '', links: [], theme: 'minimal', quantity: 1, logoUrl: '', logoName: '', notes: '' };
