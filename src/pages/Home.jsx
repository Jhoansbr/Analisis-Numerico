/**
 * Página de inicio con acceso a cada método.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sigma, BookOpen, LineChart, ListOrdered } from 'lucide-react';
import MethodCard from '../components/MethodCard';
import methodsData from '../data/methodsData';

export default function Home() {
  return (
    <div className="page-shell space-y-8 sm:space-y-10">
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="section-card p-6 sm:p-8 lg:p-10"
      >
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-5">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              <Sigma className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Laboratorio numérico
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold leading-tight mb-3 sm:mb-4">
            Aprende métodos numéricos
            <span className="text-accent"> con claridad</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed max-w-prose">
            Resuelve problemas de raíces, interpolación e integración con fórmulas bien presentadas,
            desarrollo iterativo detallado y gráficas que puedes explorar.
          </p>
        </div>
      </motion.section>

      <section>
        <h2 className="text-lg sm:text-xl font-display font-semibold mb-3 sm:mb-4">Métodos disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {methodsData.map((method, index) => (
            <MethodCard key={method.id} method={method} index={index} />
          ))}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
        {[
          { icon: BookOpen, label: 'Teoría integrada', desc: 'Definición, fórmulas y cuándo aplicar cada método', tone: 'text-[var(--color-accent)]' },
          { icon: ListOrdered, label: 'Paso a paso', desc: 'Cada iteración con sustituciones y valores numéricos', tone: 'text-[var(--color-accent-warm)]' },
          { icon: LineChart, label: 'Gráficas', desc: 'Visualiza la función, aproximaciones y el polinomio interpolante', tone: 'text-[var(--color-success)]' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="section-card p-4 sm:p-5 flex gap-3 sm:gap-4">
              <div className={`w-10 h-10 rounded-lg bg-[var(--color-surface-raised)] flex items-center justify-center shrink-0 ${item.tone}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${item.tone} mb-1`}>{item.label}</p>
                <p className="text-xs sm:text-sm text-[var(--color-text-subtle)] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </motion.section>
    </div>
  );
}
