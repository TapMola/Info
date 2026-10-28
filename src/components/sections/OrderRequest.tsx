import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import type { CardData } from '../../types/card';
import { CONTACT_EMAIL, optionalFields, pricing, themeLabels } from '../../data/config';
import { orderBody } from '../../lib/order';
import { Reveal } from '../ui/Reveal';
export function OrderRequest({ card, prepared, error }: {
    card: CardData;
    prepared: boolean;
    error: string;
}) {
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState(false);
    async function copy() { try {
        await navigator.clipboard.writeText(orderBody(card));
        setCopied(true);
        setCopyError(false);
        setTimeout(() => setCopied(false), 2000);
    }
    catch {
        setCopyError(true);
    } }
    return <section className="order-section section-shell" id="pedido"><Reveal className="order-intro"><p className="eyebrow">EL PRINCIPIO DE TU PRÓXIMA CONEXIÓN</p><h2>Todo listo.<br /><em>Casi tuya.</em></h2><p>Revisa los detalles y envíanos tu solicitud.<br />Nos pondremos en contacto contigo para<br className="desktop-break"/> dar forma al diseño final.</p><a className="text-link" href="#personalizar">Volver a editar<ArrowUpRight size={15}/></a></Reveal><div className="order-summary"><div className="summary-title"><h3>Tu tarjeta, en detalle</h3><span>HECHA PARA TI</span></div><dl><div><dt>Nombre</dt><dd>{card.name || 'Por completar'}</dd></div><div><dt>Email</dt><dd>{card.email || 'Por completar'}</dd></div>{card.business && <div><dt>Empresa o marca</dt><dd>{card.business}</dd></div>}{optionalFields.filter(f => card[f.key]).map(f => <div key={f.key}><dt>{f.label}</dt><dd>{card[f.key]}</dd></div>)}{card.links.filter(l => l.url).map(l => <div key={l.id}><dt>{l.label || 'Otro enlace'}</dt><dd>{l.url}</dd></div>)}<div><dt>Estilo digital</dt><dd>{themeLabels[card.theme]}</dd></div><div><dt>Tarjetas físicas NFC</dt><dd>{card.quantity}</dd></div>{card.logoName && <div><dt>Logo · adjuntar al email</dt><dd>{card.logoName}</dd></div>}{card.notes && <div><dt>Comentarios</dt><dd>{card.notes}</dd></div>}<div className="summary-total"><dt>Total</dt><dd>{pricing.find(p => p.quantity === card.quantity)!.price} €</dd></div></dl>
    <button className="button button-dark order-button" type="submit" form="customizer-form" name="channel" value="mailto">Solicitar mi tarjeta<ArrowUpRight size={18}/></button><button className="gmail-button" type="submit" form="customizer-form" name="channel" value="gmail"><Mail size={15}/>O preparar el email en Gmail<ArrowUpRight size={14}/></button>
    <p className="order-disclaimer">Se abrirá tu aplicación de correo con la solicitud preparada. <strong>El pedido solo se envía cuando tú mandas el email.</strong> Si has añadido un logo, adjúntalo manualmente.</p>
    {error && <p role="alert" className="field-error">{error}</p>}
    {prepared && <div className="order-prepared" role="status"><Check size={20}/><div><strong>Solicitud preparada para tu correo</strong><p>Aún no hemos recibido tu pedido. Revisa el mensaje, adjunta tu logo si lo necesitas y pulsa enviar en tu correo.</p><button type="button" className="text-link" onClick={copy}><Copy size={13}/>{copied ? 'Texto copiado' : 'Copiar detalles de la solicitud'}</button>{copyError && <p>Puedes enviarnos los detalles a {CONTACT_EMAIL}.</p>}</div></div>}
    </div></section>;
}
