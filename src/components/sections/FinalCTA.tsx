import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
export function FinalCTA() {
    return <section className="final-cta"><div className="final-architecture" aria-hidden="true"><div /><div /><div /></div><Reveal><p className="eyebrow">LOS PEQUEÑOS GESTOS DEJAN HUELLA</p><h2>Las mejores conexiones<br />empiezan con <em>un gesto.</em></h2><p>Comparte lo que eres.<br />Deja una impresión que permanece.</p><a href="#personalizar" className="button button-cream">Crear mi tarjeta<ArrowUpRight size={17}/></a></Reveal><span className="final-signature" aria-hidden="true">tm.</span></section>;
}
