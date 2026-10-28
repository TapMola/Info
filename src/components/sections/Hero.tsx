import { ArrowDown, ArrowUpRight, MoveUpRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { PhysicalCardMockup } from '../card/PhysicalCardMockup';
export function Hero() {
    const reduced = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(y, { stiffness: 100, damping: 25 });
    const rotateY = useSpring(x, { stiffness: 100, damping: 25 });
    const enter = (delay: number) => ({ initial: false as const, animate: reduced ? {} : { opacity: [0, 1], y: [22, 0] }, transition: { duration: 1, delay } });
    return <section className="hero" id="inicio" aria-labelledby="hero-heading">
    <div className="hero-copy">
      <motion.p className="eyebrow" {...enter(.1)}><span className="small-line"/> CONEXIONES CON IDENTIDAD</motion.p>
      <motion.h1 id="hero-heading" {...enter(.2)}>Una nueva<br />forma de<br /><em>conectar.</em><span className="heading-spark" aria-hidden="true">✳</span></motion.h1>
      <motion.p className="hero-description" {...enter(.35)}>Una tarjeta física. Infinitas posibilidades<br className="desktop-break"/> para compartir quién eres.</motion.p>
      <motion.div className="hero-actions" {...enter(.45)}><a className="button button-dark" href="#personalizar">Diseña tu tarjeta<ArrowUpRight size={18}/></a><a className="text-link" href="#experiencia">Descubre cómo funciona<MoveUpRight size={16}/></a></motion.div>
      <motion.div className="hero-note" {...enter(.55)}><span className="tiny-card" aria-hidden="true">↗</span><span>Física por fuera. Infinitas posibilidades por dentro.</span></motion.div>
    </div>
    <motion.div className="hero-visual" {...enter(.15)} onPointerMove={e => { if (reduced || e.pointerType !== 'mouse')
        return; const r = e.currentTarget.getBoundingClientRect(); x.set(((e.clientX - r.left) / r.width - .5) * 6); y.set(-((e.clientY - r.top) / r.height - .5) * 6); }} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <div className="editorial-scene" role="img" aria-label="Composición ilustrativa de tarjetas Tap Mola sobre piedra clara y una mesa de nogal">
        <div className="scene-wall"/><div className="scene-wood"/><div className="scene-light"/><div className="scene-shadow"/><div className="stone-block"/>
        <motion.div className="hero-card-group" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}><PhysicalCardMockup light className="hero-card-back"/><PhysicalCardMockup className="hero-card-front"/></motion.div>
        <div className="scene-vase"/><span className="visual-index">01 / EL PRINCIPIO DE ALGO</span><span className="visual-caption">Un pequeño gesto.<br /><em>Una gran primera impresión.</em></span>
      </div>
      <div className="hero-image-bottom"><span>DISEÑADA PARA PRESENTARTE.</span><span>HECHA PARA CONECTAR.<ArrowUpRight size={14}/></span></div>
    </motion.div>
    <a href="#producto" className="scroll-cue"><ArrowDown size={14}/><span>UN GESTO LO CAMBIA TODO</span></a>
    <span className="hero-edition">TAP MOLA — MADRID, ES</span>
  </section>;
}
