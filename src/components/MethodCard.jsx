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

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      onClick={() => navigate(method.path)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(method.path)}
      role="button"
      tabIndex={0}
      className="glass-card glass-card-hover cursor-pointer group p-5 flex flex-col gap-3 h-full"
    >
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-base font-display font-semibold text-[var(--color-text)] group-hover:text-sky-400 transition-colors">
        {method.name}
      </h3>
      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed flex-1">{method.shortDesc}</p>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 opacity-80 group-hover:opacity-100">
        Abrir
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </motion.article>
  );
}
