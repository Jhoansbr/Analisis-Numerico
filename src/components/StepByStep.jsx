/**
 * Desarrollo paso a paso con stepper vertical.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListOrdered, ChevronDown } from 'lucide-react';
import MathFormula from './MathFormula';
import { formatNumber, formatPercent } from '../utils/numberFormat';

function ValueBox({ label, value, tone, isString = false }) {
  const displayValue = isString ? value : typeof value === 'number' ? formatNumber(value) : value;
  return (
    <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)] mb-1">{label}</p>
      <p className={`font-mono text-sm font-medium ${tone}`}>{displayValue}</p>
    </div>
  );
}

function BisectionDetail({ step }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <ValueBox label="a" value={step.a} tone="text-sky-400" />
        <ValueBox label="b" value={step.b} tone="text-violet-400" />
      </div>
      <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-text-muted)] mb-2">Punto medio</p>
        <MathFormula tex={`x_r = \\frac{${formatNumber(step.a)} + ${formatNumber(step.b)}}{2} = ${formatNumber(step.xr)}`} block />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <ValueBox label="f(a)" value={step.fa} tone="text-sky-400" />
        <ValueBox label="f(xr)" value={step.fxr} tone="text-amber-400" />
        <ValueBox label="f(b)" value={step.fb} tone="text-violet-400" />
      </div>
      <div className="p-3 rounded-lg bg-emerald-500/8 border border-emerald-500/20">
        <p className="text-xs text-emerald-300/90 mb-2">{step.sign}</p>
        {step.assignment && (
          <p className="text-sm font-mono text-emerald-200">Siguiente intervalo: {step.assignment}</p>
        )}
      </div>
      {step.error !== null && step.prevXr != null && (
        <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)] mb-2">Error entre iteraciones</p>
          <MathFormula
            tex={`\\varepsilon = \\frac{|${formatNumber(step.xr)} - ${formatNumber(step.prevXr)}|}{2} = ${formatNumber(step.error)}`}
            block
          />
        </div>
      )}
    </div>
  );
}

function NewtonDetail({ step }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-3 gap-3">
        <ValueBox label="xₙ" value={step.xn} tone="text-sky-400" />
        <ValueBox label="f(xₙ)" value={step.fxn} tone="text-amber-400" />
        <ValueBox label="f′(xₙ)" value={step.fpxn} tone="text-violet-400" />
      </div>
      <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-text-muted)] mb-2">Aplicación de la fórmula</p>
        <MathFormula tex={step.formula} block />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ValueBox label="xₙ₊₁" value={step.xn1} tone="text-emerald-400" />
        <ValueBox label="Error" value={formatPercent(step.error)} tone="text-rose-400" isString />
      </div>
    </div>
  );
}

function SecantDetail({ step }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <ValueBox label="xₙ₋₁" value={step.xPrev} tone="text-sky-400" />
        <ValueBox label="xₙ" value={step.xCurr} tone="text-violet-400" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ValueBox label="f(xₙ₋₁)" value={step.fPrev} tone="text-sky-400" />
        <ValueBox label="f(xₙ)" value={step.fCurr} tone="text-amber-400" />
      </div>
      <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-text-muted)] mb-2">Aplicación de la fórmula</p>
        <MathFormula tex={step.formula} block />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ValueBox label="xₙ₊₁" value={step.xNext} tone="text-emerald-400" />
        <ValueBox label="Error" value={formatPercent(step.error)} tone="text-rose-400" isString />
      </div>
    </div>
  );
}

function FixedPointDetail({ step }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <ValueBox label="xₙ" value={step.xn} tone="text-sky-400" />
        <ValueBox label="g(xₙ)" value={step.gx} tone="text-violet-400" />
      </div>
      <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-text-muted)] mb-2">Aplicación de la fórmula</p>
        <MathFormula tex={step.formula} block />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ValueBox label="xₙ₊₁" value={step.xn1} tone="text-emerald-400" />
        <ValueBox label="Error" value={formatPercent(step.error)} tone="text-rose-400" isString />
      </div>
    </div>
  );
}

function Simpson38Detail({ step }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-3 gap-3">
        <ValueBox label="n" value={step.n} tone="text-sky-400" />
        <ValueBox label="h" value={step.h} tone="text-violet-400" />
        <ValueBox label="Integral I" value={step.integral} tone="text-emerald-400" />
      </div>
      <div className="p-3 rounded-lg bg-emerald-500/8 border border-emerald-500/20">
        <p className="text-xs text-emerald-300/90">{step.detail}</p>
      </div>
      <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-text-muted)] mb-2">Fórmula compuesta</p>
        <MathFormula tex={step.formula} block />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ValueBox label="Σ cᵢ·f(xᵢ)" value={step.weightedSum} tone="text-amber-400" />
        {step.error !== null && (
          <ValueBox label="Error" value={formatPercent(step.error)} tone="text-rose-400" isString />
        )}
      </div>
    </div>
  );
}

function LagrangeDetail({ step }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <ValueBox label={`x${step.index}`} value={step.xi} tone="text-sky-400" />
        <ValueBox label={`y${step.index}`} value={step.yi} tone="text-violet-400" />
      </div>
      <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-text-muted)] mb-2">Polinomio base</p>
        <MathFormula tex={step.latex} block />
      </div>
      {step.liValue !== null && (
        <div className="grid grid-cols-2 gap-3">
          <ValueBox label={`L${step.index}(x)`} value={step.liValue} tone="text-amber-400" />
          <ValueBox label="Contribución" value={step.contribution} tone="text-emerald-400" />
        </div>
      )}
    </div>
  );
}

function StepItem({ step, methodType, isLast, isExpanded, onToggle, stepNumber, errorFormat }) {
  const detailMap = {
    bisection: BisectionDetail,
    newton: NewtonDetail,
    secant: SecantDetail,
    'fixed-point': FixedPointDetail,
    lagrange: LagrangeDetail,
    simpson38: Simpson38Detail,
  };
  const Detail = detailMap[methodType];
  const label = step.iteration ?? step.index + 1;

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div
          className="absolute left-[15px] top-10 bottom-0 w-px bg-gradient-to-b from-sky-500/40 to-transparent"
          aria-hidden
        />
      )}
      <button
        type="button"
        onClick={onToggle}
        className={`relative z-10 w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border-2 transition-colors ${
          isExpanded
            ? 'bg-sky-500/20 border-sky-400 text-sky-300'
            : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)]'
        }`}
      >
        {stepNumber}
      </button>
      <div className="flex-1 min-w-0 pb-6">
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center gap-2 text-left group"
        >
          <span className="text-sm font-medium text-[var(--color-text)] group-hover:text-sky-300 transition-colors">
            Iteración {label}
          </span>
          {step.error != null && (
            <span className="ml-auto text-xs font-mono text-[var(--color-text-subtle)]">
              {errorFormat === 'absolute'
                ? `ε = ${formatNumber(step.error)}`
                : `ε = ${formatPercent(step.error)}`}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[var(--color-text-subtle)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-3 border-t border-[var(--color-border)]">
                {Detail && <Detail step={step} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function StepByStep({ steps, methodType, embedded = false, errorFormat = 'percent' }) {
  const [expandedStep, setExpandedStep] = useState(0);
  const [showAll, setShowAll] = useState(false);
  if (!steps || steps.length === 0) return null;

  const visible = showAll ? steps : steps.slice(0, 5);

  const inner = (
    <>
      <div className="space-y-0">
        {visible.map((step, idx) => (
          <StepItem
            key={idx}
            step={step}
            methodType={methodType}
            stepNumber={step.iteration ?? step.index + 1}
            isLast={idx === visible.length - 1}
            isExpanded={expandedStep === idx}
            onToggle={() => setExpandedStep(expandedStep === idx ? -1 : idx)}
            errorFormat={errorFormat}
          />
        ))}
      </div>
      {steps.length > 5 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-2 py-2.5 text-sm font-medium text-sky-400 hover:text-sky-300 rounded-lg hover:bg-white/[0.03] transition-colors"
        >
          {showAll ? 'Mostrar menos' : `Ver ${steps.length - 5} iteraciones más`}
        </button>
      )}
    </>
  );

  if (embedded) return inner;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="section-card overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-[var(--color-border)]">
        <div className="w-9 h-9 rounded-lg bg-amber-500/12 flex items-center justify-center">
          <ListOrdered className="w-5 h-5 text-amber-400" />
        </div>
        <h2 className="text-lg font-display font-semibold">Desarrollo paso a paso</h2>
      </div>
      <div className="p-5">{inner}</div>
    </motion.div>
  );
}
