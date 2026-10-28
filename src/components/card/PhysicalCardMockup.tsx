import { Wifi } from 'lucide-react';
export function PhysicalCardMockup({ light = false, name = '', className = '' }: {
    light?: boolean;
    name?: string;
    className?: string;
}) {
    return <div className={`physical-card ${light ? 'light-card' : ''} ${className}`} role="img" aria-label="Representación ilustrativa de tarjeta física NFC Tap Mola">
    <div className="physical-top"><span className="wordmark">tap mola<span className="wordmark-dot">.</span></span><Wifi size={22} strokeWidth={1.2}/></div>
    <div className="physical-bottom"><span>{name || 'Una nueva forma de conectar.'}</span><span className="physical-mark">↗</span></div>
  </div>;
}
