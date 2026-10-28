import { ArrowUpRight, Check } from 'lucide-react';
import { pricing } from '../../data/config';
import type { CardData } from '../../types/card';
import type { CardSetter } from './CardCustomizer';
import { Reveal } from '../ui/Reveal';
export function Pricing({ card, setCard }: {
    card: CardData;
    setCard: CardSetter;
}) {
    return <section className="pricing-section section-shell" id="precios"><Reveal className="pricing-heading"><p className="eyebrow">UN PEQUEÑO OBJETO. MUCHAS CONEXIONES.</p><h2>Simple, como<br /><em>debería ser.</em></h2><p>Tu tarjeta física NFC y tu perfil digital personalizado.</p></Reveal><div className="pricing-options">{pricing.map(p => <Reveal key={p.quantity}><article className={`price-option ${card.quantity === p.quantity ? 'price-selected' : ''}`}><div className="price-topline"><span>0{p.quantity} / {p.quantity === 1 ? 'ESENCIAL' : 'POR DUPLICADO'}</span>{p.quantity === 2 && <span>Más por muy poco</span>}</div><h3>{p.quantity} {p.quantity === 1 ? 'tarjeta' : 'tarjetas'} NFC</h3><div className="price-amount">{p.price}<span>€</span></div><p>{p.description}</p><a href="#pedido" className="price-choice" aria-label={`Elegir ${p.quantity} ${p.quantity === 1 ? 'tarjeta' : 'tarjetas'} por ${p.price} euros`} onClick={() => setCard(c => ({ ...c, quantity: p.quantity }))}>{card.quantity === p.quantity ? 'Opción seleccionada' : 'Elegir esta opción'}{card.quantity === p.quantity ? <Check size={17}/> : <ArrowUpRight size={17}/>}</a></article></Reveal>)}</div><p className="pricing-note">Confirmamos contigo el diseño, la entrega y el pago por email antes de preparar tu tarjeta.</p></section>;
}
