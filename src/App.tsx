import { useState } from 'react';
import type { FormEvent } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { ProductShowcase } from './components/sections/ProductShowcase';
import { NFCDemo } from './components/sections/NFCDemo';
import { HowItWorks } from './components/sections/HowItWorks';
import { CardCustomizer } from './components/sections/CardCustomizer';
import { Pricing } from './components/sections/Pricing';
import { OrderRequest } from './components/sections/OrderRequest';
import { FinalCTA } from './components/sections/FinalCTA';
import { emptyCard } from './types/card';
import { orderBody, orderUrls, safeUrl } from './lib/order';
import { optionalFields } from './data/config';
export default function App() {
    const [card, setCard] = useState(emptyCard);
    const [preparedBody, setPreparedBody] = useState('');
    const [error, setError] = useState('');
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        if (!card.name.trim() || !card.email.trim()) {
            setError('Completa tu nombre y email en el formulario.');
            document.getElementById('name')?.focus();
            return;
        }
        if (optionalFields.some(f => f.type === 'url' && card[f.key] && !safeUrl(card[f.key])) || card.links.some(l => !safeUrl(l.url))) {
            setError('Revisa tus enlaces: deben empezar por https:// o http://.');
            return;
        }
        const channel = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value');
        const urls = orderUrls(card);
        if (channel === 'gmail')
            window.open(urls.gmail, '_blank', 'noopener,noreferrer');
        else
            window.location.href = urls.mailto;
        setPreparedBody(orderBody(card));
        document.getElementById('pedido')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    return <MotionConfig reducedMotion="user"><a className="skip-link" href="#contenido">Saltar al contenido</a><Navbar /><main id="contenido"><Hero /><ProductShowcase /><NFCDemo /><HowItWorks /><CardCustomizer card={card} setCard={setCard} onSubmit={submit}/><Pricing card={card} setCard={setCard}/><OrderRequest card={card} prepared={preparedBody === orderBody(card)} error={error}/><FinalCTA /></main><Footer /></MotionConfig>;
}
