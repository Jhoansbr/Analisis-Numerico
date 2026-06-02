/**
 * Método de Newton-Raphson.
 * Error relativo (%): ε = |xₙ₊₁ − xₙ| / |xₙ₊₁| × 100
 * Parada: por tolerancia (%) o por número fijo de iteraciones (si falta uno, se infiere el otro).
 */
import { evaluateExpression, evaluateDerivative, getDerivative } from '../utils/mathParser';
import { formatNumber, roundNumber } from '../utils/numberFormat';

const DEFAULT_MAX_ITER_TOLERANCE = 100;

function relativeErrorPercent(xn, xn1) {
  const denom = Math.abs(xn1) > Number.EPSILON ? Math.abs(xn1) : Math.abs(xn);
  if (denom < Number.EPSILON) return 0;
  return (Math.abs(xn1 - xn) / denom) * 100;
}

function resolveStopConfig(tol, maxIter) {
  const hasTol = Number.isFinite(tol) && tol > 0;
  const hasMaxIter = Number.isFinite(maxIter) && maxIter >= 1;

  if (!hasTol && !hasMaxIter) {
    return {
      ok: false,
      message: 'Indica la tolerancia (%) o el número de iteraciones.',
    };
  }

  if (hasTol && !hasMaxIter) {
    return {
      ok: true,
      stopMode: 'tolerance',
      tol,
      maxIter: DEFAULT_MAX_ITER_TOLERANCE,
    };
  }

  if (!hasTol && hasMaxIter) {
    return {
      ok: true,
      stopMode: 'iterations',
      maxIter: Math.floor(maxIter),
    };
  }

  return {
    ok: true,
    stopMode: 'tolerance',
    tol,
    maxIter: Math.floor(maxIter),
  };
}

/**
 * @param {string} func
 * @param {number} x0
 * @param {number} [tol] - Tolerancia en porcentaje (p. ej. 0.01 = 0.01 %)
 * @param {number} [maxIter]
 */
export function solveNewton(func, x0, tol, maxIter) {
  const baseFail = { derivativeStr: '', stopMode: null };

  if (!Number.isFinite(x0)) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      message: 'Indica el valor inicial x₀.',
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

  const derivativeStr = getDerivative(func);
  if (!derivativeStr) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      stopMode,
      message:
        'No pudimos interpretar la función. Revisa la expresión (por ejemplo: -1 + 5.5*x - 4*x^2 + 0.5*x^3).',
    };
  }

  const iterations = [];
  let xn = x0;

  for (let i = 1; i <= maxIterations; i++) {
    const fxn = evaluateExpression(func, xn);
    const fpxn = evaluateDerivative(func, xn);

    if (!Number.isFinite(fxn) || !Number.isFinite(fpxn)) {
      return {
        iterations,
        root: null,
        converged: false,
        stopMode,
        message: 'No se pudo evaluar f(x) o f′(x) en este punto. Revisa la expresión o prueba otro x₀.',
        derivativeStr,
      };
    }

    if (Math.abs(fpxn) < Number.EPSILON) {
      return {
        iterations,
        root: null,
        converged: false,
        stopMode,
        message:
          'La derivada se anula en este punto: la tangente es horizontal y el método no puede avanzar. Prueba otro valor inicial.',
        derivativeStr,
      };
    }

    const xn1 = xn - fxn / fpxn;
    const errorPercent = relativeErrorPercent(xn, xn1);

    iterations.push({
      iteration: i,
      xn: roundNumber(xn),
      fxn: roundNumber(fxn),
      fpxn: roundNumber(fpxn),
      xn1: roundNumber(xn1),
      error: roundNumber(errorPercent),
      formula: `x_{${i}} = ${formatNumber(xn)} - \\frac{${formatNumber(fxn)}}{${formatNumber(fpxn)}} = ${formatNumber(xn1)}`,
    });

    if (Math.abs(fxn) < Number.EPSILON) {
      return {
        iterations,
        root: roundNumber(xn1),
        converged: true,
        stoppedBy: 'exact',
        stopMode,
        message: 'Se encontró una raíz exacta en xₙ.',
        derivativeStr,
      };
    }

    if (stopMode === 'tolerance' && errorPercent < tolPercent) {
      return {
        iterations,
        root: roundNumber(xn1),
        converged: true,
        stoppedBy: 'tolerance',
        stopMode,
        message: `Solución encontrada en ${i} ${i === 1 ? 'iteración' : 'iteraciones'} (error < ${tolPercent}%).`,
        derivativeStr,
      };
    }

    xn = xn1;

    if (stopMode === 'iterations' && i === maxIterations) {
      return {
        iterations,
        root: roundNumber(xn),
        converged: true,
        stoppedBy: 'iterations',
        stopMode,
        message: `Se completaron las ${maxIterations} iteraciones solicitadas. Última aproximación: x ≈ ${roundNumber(xn)}.`,
        derivativeStr,
      };
    }
  }

  return {
    iterations,
    root: roundNumber(xn),
    converged: false,
    stoppedBy: 'maxIter',
    stopMode,
    message:
      stopMode === 'tolerance'
        ? `No se alcanzó error < ${tolPercent}% en ${maxIterations} iteraciones. Prueba otro x₀ o relaja la tolerancia.`
        : `No se pudo completar el proceso en ${maxIterations} iteraciones.`,
    derivativeStr,
  };
}
