import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
export function Reveal({ children, className = '', delay = 0 }: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    const reduced = useReducedMotion();
    return <motion.div className={className} initial={false} whileInView={reduced ? {} : { y: [18, 0], opacity: [0.55, 1] }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: .75, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
