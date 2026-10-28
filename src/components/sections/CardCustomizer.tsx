import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, Check, ChevronDown, Plus, Upload, X } from 'lucide-react';
import type { CardData, OptionalField, Theme } from '../../types/card';
import { optionalFields, pricing, themeLabels } from '../../data/config';
import { DigitalCardPreview } from '../card/DigitalCardPreview';
import { Reveal } from '../ui/Reveal';
export type CardSetter = Dispatch<SetStateAction<CardData>>;
export function CardCustomizer({ card, setCard, onSubmit }: {
    card: CardData;
    setCard: CardSetter;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
    const [active, setActive] = useState<OptionalField[]>([]);
    const [menu, setMenu] = useState(false);
    const [logoError, setLogoError] = useState('');
    const uploadRef = useRef<HTMLInputElement>(null);
    const generation = useRef(0);
    useEffect(() => () => { if (card.logoUrl)
        URL.revokeObjectURL(card.logoUrl); }, [card.logoUrl]);
    function update(key: keyof CardData, value: string) { setCard(c => ({ ...c, [key]: value })); }
    function addField(key: OptionalField) { setActive(a => [...a, key]); setMenu(false); window.setTimeout(() => document.getElementById(key)?.focus(), 100); }
    function removeField(key: OptionalField) { setActive(a => a.filter(k => k !== key)); update(key, ''); }
    async function upload(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file)
            return;
        const id = ++generation.current;
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
            setLogoError('Elige una imagen PNG, JPG, WebP o GIF.');
            event.target.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setLogoError('La imagen debe pesar menos de 5 MB.');
            event.target.value = '';
            return;
        }
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.src = url;
        try {
            await image.decode();
            if (id !== generation.current) {
                URL.revokeObjectURL(url);
                return;
            }
            ;
            if (image.width * image.height > 40000000)
                throw Error('too large');
            setCard(c => ({ ...c, logoUrl: url, logoName: file.name }));
            setLogoError('');
        }
        catch {
            URL.revokeObjectURL(url);
            setLogoError('No se ha podido leer esta imagen. Prueba con otra más pequeña.');
            event.target.value = '';
        }
    }
    return <section className="customizer-section section-shell" id="personalizar"><Reveal className="section-heading-row"><div><p className="eyebrow">TU IDENTIDAD, A TU MANERA</p><h2>Hazla <em>tuya.</em></h2></div><p>Cada persona es única.<br />Tu tarjeta también debería serlo.</p></Reveal>
    <div className="customizer-layout"><form id="customizer-form" className="customizer-form" onSubmit={onSubmit}>
      <div className="form-section-header"><span>01</span><h3>Empieza por lo esencial</h3><span>* Obligatorio</span></div>
      <div className="form-grid"><label className="field"><span>Nombre completo *</span><input id="name" name="name" autoComplete="name" required maxLength={100} placeholder="Tu nombre y apellidos" value={card.name} onChange={e => update('name', e.target.value)} pattern=".*\S.*" title="Escribe tu nombre"/></label><label className="field"><span>Email *</span><input id="email" name="email" autoComplete="email" type="email" required maxLength={150} placeholder="hola@tu-marca.com" value={card.email} onChange={e => update('email', e.target.value)}/></label><label className="field field-wide"><span>Empresa o marca</span><input name="organization" autoComplete="organization" maxLength={100} placeholder="El nombre de tu proyecto" value={card.business} onChange={e => update('business', e.target.value)}/></label></div>
      <div className={`upload-zone ${card.logoUrl ? 'upload-complete' : ''}`}><label htmlFor="logo-upload" className="upload-label"><span className="upload-symbol">{card.logoUrl ? <Check size={20}/> : <Upload size={20} strokeWidth={1.3}/>}</span><span><strong>{card.logoName || 'Añade tu logo'}</strong><small>{card.logoName ? 'Pulsa para reemplazar la imagen' : 'PNG, JPG, WebP o GIF · Máx. 5 MB'}</small></span><Plus size={17}/></label><input ref={uploadRef} id="logo-upload" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={upload} aria-describedby="logo-help logo-error"/>{card.logoUrl && <button className="remove-logo" type="button" onClick={() => { generation.current++; setCard(c => ({ ...c, logoUrl: '', logoName: '' })); if (uploadRef.current)
        uploadRef.current.value = ''; }} aria-label="Quitar logo"><X size={16}/></button>}</div>
      <p id="logo-help" className="field-help">La imagen solo se utiliza en tu navegador. Tendrás que adjuntarla al email.</p><p id="logo-error" className="field-error" role="alert">{logoError}</p>
      <div className="optional-fields"><AnimatePresence initial={false}>{active.map(key => { const f = optionalFields.find(f => f.key === key)!; return <motion.div key={key} className="optional-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><label className="field" htmlFor={key}><span>{f.label}</span><input id={key} type={f.type} maxLength={f.type === 'url' ? 500 : 100} placeholder={f.placeholder} value={card[key]} onChange={e => update(key, e.target.value)} pattern={f.type === 'url' ? 'https?://.+' : undefined} title={f.type === 'url' ? 'Usa un enlace completo que empiece por https:// o http://' : undefined}/></label><button type="button" className="icon-button" aria-label={`Quitar ${f.label}`} onClick={() => removeField(key)}><X size={17}/></button></motion.div>; })}</AnimatePresence>
      {card.links.map((link, index) => <div key={link.id} className="custom-link-field"><label className="field"><span>Nombre del enlace {index + 1}</span><input required value={link.label} maxLength={60} placeholder="Mi portfolio" onChange={e => setCard(c => ({ ...c, links: c.links.map(l => l.id === link.id ? { ...l, label: e.target.value } : l) }))}/></label><label className="field"><span>Enlace</span><input type="url" required pattern="https?://.+" maxLength={500} placeholder="https://…" value={link.url} onChange={e => setCard(c => ({ ...c, links: c.links.map(l => l.id === link.id ? { ...l, url: e.target.value } : l) }))}/></label><button type="button" className="icon-button" aria-label={`Quitar enlace ${index + 1}`} onClick={() => setCard(c => ({ ...c, links: c.links.filter(l => l.id !== link.id) }))}><X size={17}/></button></div>)}
      </div>
      <button type="button" className="add-information" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="field-menu"><Plus size={16}/>Añadir información<ChevronDown size={15}/></button>
      {menu && <div id="field-menu" className="field-menu"><p>¿Qué más quieres compartir?</p>{optionalFields.filter(f => !active.includes(f.key)).map(f => <button key={f.key} type="button" onClick={() => addField(f.key)}>{f.label}<Plus size={14}/></button>)}<button type="button" disabled={card.links.length >= 5} onClick={() => { setCard(c => ({ ...c, links: [...c.links, { id: crypto.randomUUID(), label: '', url: '' }] })); setMenu(false); }}>Otro enlace {card.links.length >= 5 ? '(máx. 5)' : ''}<Plus size={14}/></button></div>}
      <div className="theme-picker"><div className="form-section-header"><span>02</span><h3>Elige tu estilo digital</h3></div><div className="theme-options" role="group" aria-label="Estilo del perfil digital">{(Object.keys(themeLabels) as Theme[]).map(theme => <button type="button" key={theme} aria-pressed={card.theme === theme} onClick={() => update('theme', theme)} className={card.theme === theme ? 'selected' : ''}><span className={`theme-swatch swatch-${theme}`}>{card.theme === theme && <Check size={15}/>}</span>{themeLabels[theme]}</button>)}</div></div>
      <label className="field notes-field"><span>¿Algo más que debamos saber?</span><textarea maxLength={1000} rows={3} value={card.notes} placeholder="Preferencias de diseño, detalles, ideas…" onChange={e => update('notes', e.target.value)}/></label>
      <p className="form-selection" aria-live="polite">Tu selección: {card.quantity} {card.quantity === 1 ? 'tarjeta' : 'tarjetas'} · {pricing.find(p => p.quantity === card.quantity)!.price} €</p><a className="text-link continue-link" href="#precios">Continúa y elige tus tarjetas<ArrowDown size={15}/></a>
    </form>
    <aside className="preview-column"><div className="preview-topline"><span className="eyebrow">TU PERFIL, EN TIEMPO REAL</span><span className="live-dot"/></div><div className="preview-phone"><div className="preview-camera"/><DigitalCardPreview card={card}/></div><p className="preview-footnote">Así empieza tu próxima conexión.<br /><span>Vista orientativa. Confirmaremos el diseño final contigo.</span></p></aside>
    </div>
  </section>;
}
