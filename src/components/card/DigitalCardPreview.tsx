import { ArrowUpRight, Download, Mail, MapPin, Phone, Instagram, Linkedin, Globe, Star } from 'lucide-react';
import type { CardData } from '../../types/card';
import { safeUrl, downloadContact } from '../../lib/order';
import { useState } from 'react';
export function DigitalCardPreview({ card, demo = false }: {
    card: CardData;
    demo?: boolean;
}) {
    const [notice, setNotice] = useState('');
    const links = [{ label: 'LinkedIn', url: card.linkedin, icon: Linkedin }, { label: 'Instagram', url: card.instagram, icon: Instagram }, { label: 'Página web', url: card.website, icon: Globe }, { label: 'Google Maps', url: card.maps, icon: MapPin }, { label: 'Reseñas de Google', url: card.reviews, icon: Star }, ...card.links.map(l => ({ label: l.label || 'Otro enlace', url: l.url, icon: Globe }))].filter(l => l.url);
    return <article className={`digital-card theme-${card.theme}`} aria-label="Vista previa del perfil digital">
    <div className="digital-cover"><span>{card.business || 'Tu identidad. Tu esencia.'}</span><span className="cover-lines" aria-hidden="true"/></div>
    <div className="digital-inner">
      <div className="profile-logo">{card.logoUrl ? <img src={card.logoUrl} alt={`Logo de ${card.business || card.name || 'tu marca'}`}/> : <span>{card.name ? card.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('') : 'tm'}</span>}</div>
      {card.location && <p className="profile-location"><MapPin size={11}/>{card.location}</p>}
      <h3>{card.name || 'Tu nombre'}</h3>
      {card.role && <p className="profile-role">{card.role}</p>}
      {card.business && <p className="profile-business">{card.business}</p>}
      <button type="button" className="save-contact" onClick={() => { downloadContact(card); setNotice(demo ? 'Contacto ficticio descargado.' : 'Contacto descargado.'); }}><Download size={15}/>Guardar contacto<ArrowUpRight size={14}/></button>
      <div className="profile-contact">
        {card.email && (demo ? <button type="button" onClick={() => setNotice('Ejemplo: aquí se abriría el correo de Laura.')}><Mail size={15}/>Contactar<ArrowUpRight size={13}/></button> : <a href={`mailto:${card.email}`}><Mail size={15}/>{card.email}<ArrowUpRight size={13}/></a>)}
        {card.phone && <a href={`tel:${card.phone.replace(/[^+\d]/g, '')}`}><Phone size={15}/>{card.phone}<ArrowUpRight size={13}/></a>}
        {links.map(({ label, url, icon: Icon }, i) => demo ? <button type="button" key={i} onClick={() => setNotice(`Ejemplo: aquí se abriría ${label}.`)}><Icon size={15}/>{label}<ArrowUpRight size={13}/></button> : safeUrl(url) ? <a key={i} href={safeUrl(url)} target="_blank" rel="noopener noreferrer"><Icon size={15}/>{label}<ArrowUpRight size={13}/></a> : <span key={i} className="preview-invalid"><Icon size={15}/>{label} · completa el enlace</span>)}
      </div>
      <p className="preview-notice" role="status">{notice}</p>
      <div className="digital-footer">Una conexión con <span>tap mola.</span></div>
    </div>
  </article>;
}
