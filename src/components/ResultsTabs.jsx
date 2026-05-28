/**
 * Pestañas para agrupar resultado, pasos, tabla y gráfica.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ResultsTabs({ tabs, defaultTab }) {
  const available = tabs.filter((t) => t.content);
  const [active, setActive] = useState(defaultTab ?? available[0]?.id);

  if (available.length === 0) return null;

  const current = available.find((t) => t.id === active) ?? available[0];

  return (
    <div className="section-card overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]/60">
        {available.map((tab) => {
          const Icon = tab.icon;
          const isActive = current.id === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30 shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {tab.label}
            </button>
          );
        })}
      </div>
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-0"
      >
        {current.content}
      </motion.div>
    </div>
  );
}
