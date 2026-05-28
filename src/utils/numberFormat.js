/**
 * Helpers to format numeric output for UI display.
 */
export function formatNumber(value, maxDecimals = 5) {
  if (value === null || value === undefined) return '—';
  if (typeof value !== 'number' || !Number.isFinite(value)) return String(value);

  const rounded = Number(value.toFixed(maxDecimals));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

export function formatPercent(value, maxDecimals = 5) {
  if (value === null || value === undefined) return '—';
  if (typeof value !== 'number' || !Number.isFinite(value)) return String(value);
  return `${formatNumber(value, maxDecimals)}%`;
}
