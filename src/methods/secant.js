/**
 * Método de la secante.
 * xₙ₊₁ = xₙ − f(xₙ)(xₙ − xₙ₋₁) / (f(xₙ) − f(xₙ₋₁))
 * Error: εₐ = |xᵢ₊₁⁽ᵏ⁾ − xᵢ₊₁⁽ᵏ⁻¹⁾| / xᵢ₊₁⁽ᵏ⁾ × 100  (parada si εₐ < tolerancia %)
 */
import { evaluateExpression } from '../utils/mathParser';
import { formatNumber, roundNumber } from '../utils/numberFormat';

const DEFAULT_MAX_ITER_TOLERANCE = 100;

/**
 * Error aproximado entre dos xᵢ₊₁ consecutivos (en %).
 * @param {number} xNextCurrent - xᵢ₊₁ de la iteración actual
 * @param {number|null} xNextPrevious - xᵢ₊₁ de la iteración anterior
 */
function secantErrorPercent(xNextCurrent, xNextPrevious) {
  if (xNextPrevious === null || !Number.isFinite(xNextPrevious)) return null;
  if (!Number.isFinite(xNextCurrent) || Math.abs(xNextCurrent) < Number.EPSILON) {
    return null;
  }
  return (Math.abs(xNextCurrent - xNextPrevious) / Math.abs(xNextCurrent)) * 100;
}

function resolveStopConfig(tol, maxIter) {
  const hasTol = Number.isFinite(tol) && tol > 0;
  const hasMaxIter = Number.isFinite(maxIter) && maxIter >= 1;

  if (!hasTol && !hasMaxIter) {
    return { ok: false, message: 'Indica la tolerancia (%) o el número de iteraciones.' };
  }

  if (hasTol && !hasMaxIter) {
    return { ok: true, stopMode: 'tolerance', tol, maxIter: DEFAULT_MAX_ITER_TOLERANCE };
  }

  if (!hasTol && hasMaxIter) {
    return { ok: true, stopMode: 'iterations', maxIter: Math.floor(maxIter) };
  }

  return {
    ok: true,
    stopMode: 'either',
    tol,
    maxIter: Math.floor(maxIter),
  };
}

/**
 * @param {string} func
 * @param {number} x0
 * @param {number} x1
 * @param {number} [tol] - Tolerancia en % (0.1 = 0.1 %)
 * @param {number} [maxIter]
 */
export function solveSecant(func, x0, x1, tol, maxIter) {
  const baseFail = { stopMode: null, errorMetric: 'percent' };

  if (!Number.isFinite(x0) || !Number.isFinite(x1)) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      message: 'Indica los valores iniciales x₀ y x₁.',
    };
  }

  if (x0 === x1) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      message: 'x₀ y x₁ deben ser distintos.',
    };
  }

  const stop = resolveStopConfig(tol, maxIter);
  if (!stop.ok) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      message: stop.message,
    };
  }

  const { stopMode, maxIter: maxIterations } = stop;
  const tolPercent = stop.tol;

  const iterations = [];
  let xPrev = x0;
  let xCurr = x1;
  let previousXNext = null;

  for (let i = 1; i <= maxIterations; i++) {
    const fPrev = evaluateExpression(func, xPrev);
    const fCurr = evaluateExpression(func, xCurr);

    if (!Number.isFinite(fPrev) || !Number.isFinite(fCurr)) {
      return {
        ...baseFail,
        iterations,
        root: null,
        converged: false,
        stopMode,
        message: 'No se pudo evaluar f(x) en los puntos actuales. Revisa la expresión o los valores iniciales.',
      };
    }

    if (Math.abs(fCurr - fPrev) < Number.EPSILON) {
      return {
        ...baseFail,
        iterations,
        root: null,
        converged: false,
        stopMode,
        message:
          'f(xₙ) y f(xₙ₋₁) son casi iguales; el método no puede continuar. Elige otros puntos iniciales.',
      };
    }

    const xNext = xCurr - (fCurr * (xCurr - xPrev)) / (fCurr - fPrev);
    const fNext = evaluateExpression(func, xNext);
    const errorPercent = secantErrorPercent(xNext, previousXNext);

    iterations.push({
      iteration: i,
      xPrev: roundNumber(xPrev),
      xCurr: roundNumber(xCurr),
      fPrev: roundNumber(fPrev),
      fCurr: roundNumber(fCurr),
      xNext: roundNumber(xNext),
      xNextPrev: previousXNext !== null ? roundNumber(previousXNext) : null,
      fNext: Number.isFinite(fNext) ? roundNumber(fNext) : null,
      error: errorPercent !== null ? roundNumber(errorPercent) : null,
      formula: `x_{i+1} = ${formatNumber(xCurr)} - \\frac{${formatNumber(fCurr)} \\cdot (${formatNumber(xCurr)} - ${formatNumber(xPrev)})}{${formatNumber(fCurr)} - ${formatNumber(fPrev)}} = ${formatNumber(xNext)}`,
    });

    if (Math.abs(fCurr) < Number.EPSILON) {
      return {
        iterations,
        root: roundNumber(xCurr),
        converged: true,
        stoppedBy: 'exact',
        stopMode,
        errorMetric: 'percent',
        message: 'Se encontró una raíz exacta en xₙ.',
      };
    }

    if (
      (stopMode === 'tolerance' || stopMode === 'either') &&
      errorPercent !== null &&
      errorPercent < tolPercent
    ) {
      return {
        iterations,
        root: roundNumber(xNext),
        converged: true,
        stoppedBy: 'tolerance',
        stopMode,
        errorMetric: 'percent',
        message: `Solución encontrada en ${i} ${i === 1 ? 'iteración' : 'iteraciones'} (εₐ < ${tolPercent}%).`,
      };
    }

    previousXNext = xNext;
    xPrev = xCurr;
    xCurr = xNext;

    if (
      (stopMode === 'iterations' || stopMode === 'either') &&
      i === maxIterations
    ) {
      return {
        iterations,
        root: roundNumber(xCurr),
        converged: true,
        stoppedBy: 'iterations',
        stopMode,
        errorMetric: 'percent',
        message: `Se completaron las ${maxIterations} iteraciones solicitadas. Última aproximación: x ≈ ${roundNumber(xCurr)}.`,
      };
    }
  }

  return {
    iterations,
    root: roundNumber(xCurr),
    converged: false,
    stoppedBy: 'maxIter',
    stopMode,
    errorMetric: 'percent',
    message:
      stopMode === 'tolerance'
        ? `No se alcanzó εₐ < ${tolPercent}% en ${maxIterations} iteraciones. Ajusta x₀, x₁ o la tolerancia.`
        : `No se pudo completar el proceso en ${maxIterations} iteraciones.`,
  };
}
