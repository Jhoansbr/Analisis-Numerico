/**
 * Tabla de iteraciones con resaltado de convergencia.
 */
import React from 'react';
import { Table, TrendingDown } from 'lucide-react';
import { formatNumber, formatPercent } from '../utils/numberFormat';

export default function IterativeTable({ columns, data, highlightLast = true, embedded = false }) {
  if (!data || data.length === 0) return null;

  const lastIdx = data.length - 1;
  const lastError = data[lastIdx]?.error;

  const table = (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => {
            const isLast = rowIdx === lastIdx;
            return (
              <tr
                key={rowIdx}
                className={`border-b border-[var(--color-border)]/50 transition-colors hover:bg-white/[0.02] ${
                  highlightLast && isLast ? 'bg-sky-500/[0.06]' : ''
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 whitespace-nowrap font-mono text-xs ${
                      col.key === 'iteration' ? 'text-sky-400 font-semibold' : 'text-[var(--color-text-secondary)]'
                    } ${col.key === 'error' && row[col.key] !== null ? getErrorColor(row[col.key]) : ''}`}
                  >
                    {formatValue(row[col.key], col.key)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (embedded) {
    return (
      <div>
        {lastError != null && (
          <div className="flex items-center gap-2 px-4 py-2 mb-0 text-xs border-b border-[var(--color-border)] bg-emerald-500/5">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300/90">
              Última iteración — error relativo: {formatPercent(lastError)}
            </span>
          </div>
        )}
        {table}
      </div>
    );
  }

  return (
    <div className="section-card overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-[var(--color-border)]">
        <div className="w-9 h-9 rounded-lg bg-sky-500/12 flex items-center justify-center">
          <Table className="w-5 h-5 text-sky-400" />
        </div>
        <h2 className="text-lg font-display font-semibold">Tabla de iteraciones</h2>
        <span className="ml-auto text-xs font-medium text-[var(--color-text-subtle)] bg-[var(--color-surface)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
          {data.length} filas
        </span>
      </div>
      {table}
    </div>
  );
}

function formatValue(value, key) {
  if (value === null || value === undefined) return '—';
  if (key === 'iteration') return value;
  if (key === 'error') return formatPercent(value);
  if (key === 'sign') return value;
  if (typeof value === 'number') return formatNumber(value);
  return String(value);
}

function getErrorColor(error) {
  if (error < 0.01) return 'text-emerald-400';
  if (error < 0.1) return 'text-green-400';
  if (error < 1) return 'text-amber-400';
  if (error < 10) return 'text-orange-400';
  return 'text-rose-400';
}
