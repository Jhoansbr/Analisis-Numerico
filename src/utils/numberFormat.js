/**
 * Helpers to format numeric output for UI display.
 */
export const MAX_DECIMALS = 5;

/** Redondea un número para almacenamiento y cálculo mostrado (máx. 5 decimales). */
export function roundNumber(value, maxDecimals = MAX_DECIMALS) {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'number' || !Number.isFinite(value)) return value;
  const rounded = Number(value.toFixed(maxDecimals));
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function formatNumber(value, maxDecimals = MAX_DECIMALS) {
  if (value === null || value === undefined) return '—';
  if (typeof value !== 'number' || !Number.isFinite(value)) return String(value);

  const rounded = Number(value.toFixed(maxDecimals));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

export function formatPercent(value, maxDecimals = MAX_DECIMALS) {
/** Convierte entrada de formulario; '' no se trata como 0. */}
export function parseNumberInput(value) {
  if (value === '' || value === null || value === undefined) return NaN;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

export function formatPercent(value, maxDecimals = 5) {
  if (value === null || value === undefined) return '—';
  if (typeof value !== 'number' || !Number.isFinite(value)) return String(value);
  return `${formatNumber(value, maxDecimals)}%`;
}
