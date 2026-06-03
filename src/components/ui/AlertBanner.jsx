/**
 * Mensaje informativo para el usuario (éxito, aviso o sin convergencia).
 */
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';

const variants = {
  info: {
    icon: Info,
    wrap: 'border-[var(--color-border)] bg-[var(--color-surface-raised)]',
    iconClass: 'text-[var(--color-accent)]',
    textClass: 'text-[var(--color-text-secondary)]',
  },
  warning: {
    icon: AlertTriangle,
    wrap: 'border-amber-500/30 bg-amber-50',
    iconClass: 'text-amber-600',
    textClass: 'text-amber-900',
  },
  error: {
    icon: AlertCircle,
    wrap: 'border-rose-500/30 bg-rose-50',
    iconClass: 'text-rose-600',
    textClass: 'text-rose-900',
  },
};

export default function AlertBanner({ variant = 'info', children }) {
  const { icon: Icon, wrap, iconClass, textClass } = variants[variant] ?? variants.info;

  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${wrap}`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} />
      <p className={`text-sm leading-relaxed ${textClass}`}>{children}</p>
    </div>
  );
}
