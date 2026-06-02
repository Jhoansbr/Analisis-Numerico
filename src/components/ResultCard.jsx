/**
 * Tarjeta de resultado final con indicadores de convergencia.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Hash, Gauge } from 'lucide-react';
import MathFormula from './MathFormula';
import { formatNumber, formatPercent } from '../utils/numberFormat';

export default function ResultCard({ result, errorFormat = 'percent' }) {
  if (!result) return null;

  const { root, converged, message, iterations, stoppedBy } = result;
  const iterCount = iterations?.length || 0;
  const metric = result.errorMetric ?? errorFormat;
  const finalError = iterations?.length > 0 ? iterations[iterations.length - 1].error : null;
  const isAbsolute = metric === 'absolute';
  const completedByCount = stoppedBy === 'iterations';
  const showSuccess = converged;

  const statusTitle = !showSuccess
    ? 'Sin convergencia'
    : completedByCount
      ? 'Iteraciones completadas'
      : 'Convergencia alcanzada';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className={showSuccess ? 'animated-border' : ''}
    >
      <div
        className={`p-4 sm:p-6 rounded-[13px] ${
          showSuccess
            ? completedByCount
              ? 'bg-amber-500/10 border border-amber-500/20'
              : 'bg-emerald-500/10 border border-emerald-500/20'
            : 'bg-rose-500/10 border border-rose-500/20'
        }`}
      >
        <div className="flex items-start gap-4 mb-5">
          {showSuccess ? (
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                completedByCount ? 'bg-amber-500/15' : 'bg-emerald-500/15'
              }`}
            >
              <CheckCircle2 className={`w-6 h-6 ${completedByCount ? 'text-amber-400' : 'text-emerald-400'}`} />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-rose-500/15 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6 text-rose-400" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-display font-semibold text-[var(--color-text)]">{statusTitle}</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        {root !== null && root !== undefined && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] mb-2">
                Raíz aproximada
              </p>
              <p className="font-mono text-lg font-semibold text-sky-400">
                {typeof root === 'number' ? formatNumber(root) : root}
              </p>
              {typeof root === 'number' && (
                <div className="mt-2 pt-2 border-t border-[var(--color-border)]">
                  <MathFormula tex={`x \\approx ${formatNumber(root)}`} />
                </div>
              )}
            </div>
            <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-violet-400" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  Iteraciones
                </p>
              </div>
              <p className="font-mono text-lg font-semibold text-violet-300">{iterCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-amber-400" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  {isAbsolute ? 'Último ε' : 'Error relativo'}
                </p>
              </div>
              <p className={`font-mono text-lg font-semibold ${getErrorTone(finalError, isAbsolute)}`}>
                {isAbsolute ? formatNumber(finalError) : formatPercent(finalError)}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function getErrorTone(error, isAbsolute = false) {
  if (error == null) return 'text-[var(--color-text-muted)]';
  if (isAbsolute) {
    if (error < 0.01) return 'text-emerald-400';
    if (error < 0.1) return 'text-amber-400';
    return 'text-rose-400';
  }
  if (error < 0.01) return 'text-emerald-400';
  if (error < 1) return 'text-amber-400';
  return 'text-rose-400';
}
