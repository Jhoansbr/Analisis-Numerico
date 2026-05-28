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
    <div className="max-w-6xl mx-auto space-y-10">
      <motion.section
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="section-card relative overflow-hidden p-8 lg:p-12"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-amber-500/6 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-amber-500 flex items-center justify-center">
              <Sigma className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400/90">
              Laboratorio numérico
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold leading-tight mb-4">
            Aprende métodos numéricos
            <span className="gradient-text"> con claridad</span>
          </h1>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            Resuelve problemas de raíces e interpolación con fórmulas bien presentadas,
            desarrollo iterativo detallado y gráficas que puedes explorar.
          </p>
        </div>
      </motion.section>

      <section>
        <h2 className="text-lg font-display font-semibold mb-4">Métodos disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {methodsData.map((method, index) => (
            <MethodCard key={method.id} method={method} index={index} />
          ))}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { icon: BookOpen, label: 'Teoría integrada', desc: 'Definición, fórmulas y cuándo aplicar cada método', tone: 'text-sky-400' },
          { icon: ListOrdered, label: 'Paso a paso', desc: 'Cada iteración con sustituciones y valores numéricos', tone: 'text-amber-400' },
          { icon: LineChart, label: 'Gráficas', desc: 'Visualiza la función, aproximaciones y el polinomio interpolante', tone: 'text-emerald-400' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="section-card p-5 flex gap-4">
              <div className={`w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 ${item.tone}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${item.tone} mb-1`}>{item.label}</p>
                <p className="text-xs text-[var(--color-text-subtle)] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </motion.section>
    </div>
  );
}
