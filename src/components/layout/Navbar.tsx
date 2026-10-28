import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
const links = [['Inicio', '#inicio'], ['Cómo funciona', '#como-funciona'], ['Diseña tu tarjeta', '#personalizar'], ['Precios', '#precios']];
export function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const toggle = useRef<HTMLButtonElement>(null);
    useEffect(() => { const update = () => setScrolled(window.scrollY > 24); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
    useEffect(() => { if (!open)
        return; const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
    } }; document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape); }, [open]);
    return <header className={`navbar ${scrolled || open ? 'nav-solid' : ''}`}>
    <a className="wordmark" href="#inicio" onClick={() => setOpen(false)} aria-label="Tap Mola, inicio">tap mola<span className="wordmark-dot">.</span></a>
    <nav className="desktop-nav" aria-label="Navegación principal">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
    <a className="nav-cta" href="#personalizar">Crear mi tarjeta<ArrowUpRight size={16}/></a>
    <button ref={toggle} className="menu-toggle" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <AnimatePresence>{open && <motion.nav id="mobile-menu" className="mobile-nav" aria-label="Navegación móvil" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={20}/></a>)}</motion.nav>}</AnimatePresence>
  </header>;
}
