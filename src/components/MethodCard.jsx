/**
 * Tarjeta de método en la página de inicio.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function MethodCard({ method, index }) {
  const navigate = useNavigate();
  const Icon = method.icon;
  const iconBg = method.colorHex ?? '#2563eb';

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => navigate(method.path)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(method.path)}
      role="button"
      tabIndex={0}
      className="glass-card glass-card-hover cursor-pointer group p-4 sm:p-5 flex flex-col gap-3 h-full min-h-[140px] sm:min-h-0"
    >
      <div
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-sm sm:text-base font-display font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
        {method.name}
      </h3>
      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed flex-1 line-clamp-3 sm:line-clamp-4">
        {method.shortDesc}
      </p>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent)]">
        Abrir
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </motion.article>
  );
}
