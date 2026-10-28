import { ArrowUpRight, ContactRound, Layers2, Smartphone } from 'lucide-react';
import { PhysicalCardMockup } from '../card/PhysicalCardMockup';
import { Reveal } from '../ui/Reveal';
export function ProductShowcase() {
    return <section className="product-section section-shell" id="producto">
    <Reveal className="product-visual"><div className="product-plinth"/><PhysicalCardMockup light name="Tu identidad, en un solo gesto."/><span className="product-image-label">FÍSICA + DIGITAL. ASÍ DE NATURAL.</span><span className="product-image-note">Representación ilustrativa del producto</span></Reveal>
    <div className="product-copy"><Reveal><p className="eyebrow">MENOS PAPEL. MÁS POSIBILIDADES.</p><h2>Mucho más<br />que <em>una tarjeta.</em></h2><p className="body-copy">Hay encuentros que merecen continuar. Tap Mola reúne tu contacto, tu marca y tus enlaces en un perfil digital que se abre con un simple gesto.</p><p className="body-copy">Una forma sencilla y elegante de compartir tu identidad profesional.</p></Reveal>
      <div className="feature-list">{[[ContactRound, 'Comparte tu contacto al instante.'], [Layers2, 'Personaliza tu perfil digital.'], [Smartphone, 'Conecta sin instalar aplicaciones.']].map(([Icon, text], i) => { const FeatureIcon = Icon as typeof ContactRound; return <Reveal delay={i * .08} key={i}><div className="feature"><FeatureIcon size={20} strokeWidth={1.2}/><span>{text as string}</span><ArrowUpRight size={14}/></div></Reveal>; })}</div>
      <p className="compatibility-note">Solo necesitas un móvil compatible con NFC y conexión a internet.</p>
    </div>
  </section>;
}
