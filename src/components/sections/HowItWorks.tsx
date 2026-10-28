import { Reveal } from '../ui/Reveal';
const steps = [{ title: 'Personaliza', copy: 'Cuéntanos quién eres y cómo quieres presentarte.' }, { title: 'Recibe', copy: 'Preparamos tu tarjeta física NFC con tu perfil digital.' }, { title: 'Comparte', copy: 'Acerca tu tarjeta a un móvil y deja que tu identidad hable por ti.' }];
export function HowItWorks() {
    return <section className="how-section section-shell" id="como-funciona"><Reveal className="section-heading-row"><div><p className="eyebrow">DE TU IDEA AL PRIMER ENCUENTRO</p><h2>Tan sencillo<br />como <em>conectar.</em></h2></div><p>Tres pasos. Una nueva forma<br />de presentarte al mundo.</p></Reveal><ol className="steps">{steps.map((s, i) => <li key={s.title}><Reveal delay={i * .1}><span className="step-number">0{i + 1}</span><div className="step-rule"/><h3>{s.title}</h3><p>{s.copy}</p></Reveal></li>)}</ol></section>;
}
