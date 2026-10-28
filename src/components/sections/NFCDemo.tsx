import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, BatteryFull, Check, MoveUpRight, RotateCcw, SignalHigh, Wifi } from 'lucide-react';
import { PhysicalCardMockup } from '../card/PhysicalCardMockup';
import { DigitalCardPreview } from '../card/DigitalCardPreview';
import { Reveal } from '../ui/Reveal';
import { emptyCard } from '../../types/card';
const sample = { ...emptyCard, name: 'Laura Martínez', business: 'Studio Norte', role: 'Diseñadora de interiores', location: 'Madrid, España', email: 'laura@example.com', linkedin: 'https://example.com/linkedin', instagram: 'https://example.com/instagram', theme: 'natural' as const };
export function NFCDemo() {
    const [stage, setStage] = useState<'idle' | 'notification' | 'profile'>('idle');
    const [run, setRun] = useState(0);
    const phone = useRef<HTMLDivElement>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const reduced = useReducedMotion();
    useEffect(() => () => clearTimeout(timer.current), []);
    function activate() { if (stage !== 'idle')
        return; setStage('notification'); timer.current = setTimeout(() => setStage('profile'), reduced ? 200 : 1600); }
    function reset() { clearTimeout(timer.current); setStage('idle'); setRun(r => r + 1); }
    return <section className="demo-section" id="experiencia"><div className="demo-layout section-shell">
    <Reveal className="demo-copy"><p className="eyebrow">DESCUBRE LA EXPERIENCIA</p><h2>Acerca.<br />Abre.<br /><em>Conecta.</em></h2><p className="body-copy">Tu próxima conexión está a un gesto.<br />Acerca la tarjeta al teléfono y descubre<br className="desktop-break"/> todo lo que puedes compartir.</p><button className="button button-dark" type="button" onClick={activate} disabled={stage !== 'idle'}>{stage === 'idle' ? 'Probar demostración' : stage === 'notification' ? 'Conectando…' : 'Así de sencillo'}{stage === 'profile' ? <Check size={17}/> : <ArrowUpRight size={17}/>}</button><p className="demo-disclaimer">Demostración simulada. Sin acceso al NFC de tu dispositivo.<br />El perfil de Laura es ficticio.</p></Reveal>
    <div className="demo-stage"><span className="demo-step">{stage === 'idle' ? '01 — ACERCA TU TARJETA' : stage === 'notification' ? '02 — TOCA LA NOTIFICACIÓN' : '03 — TU IDENTIDAD, AL INSTANTE'}</span>
      <div className={`phone ${stage === 'profile' ? 'phone-active' : ''}`} ref={phone}><div className="phone-island"/><div className="phone-status"><span>9:41</span><span className="phone-indicators" aria-hidden="true"><SignalHigh size={12} strokeWidth={1.5} /><BatteryFull size={12} strokeWidth={1.5} /></span></div><AnimatePresence mode="wait">{stage === 'profile' ? <motion.div key="profile" className="demo-profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><DigitalCardPreview card={sample} demo/></motion.div> : <motion.div key="lock" className="phone-lock" exit={{ opacity: 0 }}><p className="lock-date">Lunes, 12 de mayo</p><span className="lock-clock">9:41</span><div className="lock-art"/><AnimatePresence>{stage === 'notification' && <motion.button type="button" className="nfc-notification" initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={() => { clearTimeout(timer.current); setStage('profile'); }}><span><Wifi size={19}/></span><span><strong>Tarjeta NFC detectada</strong><small>Abrir el perfil de Laura Martínez</small></span><ArrowUpRight size={14}/></motion.button>}</AnimatePresence><span className="lock-bottom">Un gesto. Una nueva conexión.</span></motion.div>}</AnimatePresence>{stage === 'notification' && <span className="nfc-pulse" aria-hidden="true"/>}</div>
      {stage === 'idle' && <motion.div key={run} className="draggable-card" drag={!reduced} dragSnapToOrigin dragMomentum={false} whileDrag={{ scale: 1.03, cursor: 'grabbing' }} onDragEnd={(_, info) => { const r = phone.current?.getBoundingClientRect(); const x = info.point.x - window.scrollX; const y = info.point.y - window.scrollY; if (r && x >= r.left - 110 && x <= r.right + 110 && y >= r.top - 70 && y <= r.top + r.height * .55)
        activate(); }}><PhysicalCardMockup name="Laura Martínez"/><span className="drag-label"><MoveUpRight size={17}/>Arrastra hacia la parte superior del móvil</span></motion.div>}
      {stage !== 'idle' && <button className="reset-demo text-link" type="button" onClick={reset}><RotateCcw size={14}/>Volver a probar</button>}
      <span className="demo-live sr-only" role="status">{stage === 'profile' ? 'Perfil digital de Laura Martínez abierto.' : stage === 'notification' ? 'Tarjeta NFC detectada.' : 'Demostración preparada.'}</span>
    </div>
  </div></section>;
}
