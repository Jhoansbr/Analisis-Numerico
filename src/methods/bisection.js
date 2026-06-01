/**
 * Método de bisección.
 * Error entre iteraciones: ε = |xᵣ⁽ᵏ⁾ − xᵣ⁽ᵏ⁻¹⁾| / 2
 * Modos de parada: por tolerancia ε o por número fijo de iteraciones.
 */
import { evaluateExpression } from '../utils/mathParser';
import { roundNumber } from '../utils/numberFormat';

/** Tope interno al parar por ε (el usuario no tiene que indicarlo). */
const DEFAULT_MAX_ITER_TOLERANCE = 100;

function resolveMaxIter(stopMode, maxIter) {
  if (stopMode === 'iterations') {
    if (!Number.isFinite(maxIter) || maxIter < 1) return null;
    return Math.floor(maxIter);
  }
  if (Number.isFinite(maxIter) && maxIter >= 1) return Math.floor(maxIter);
  return DEFAULT_MAX_ITER_TOLERANCE;
}

/**
 * @param {string} func
 * @param {number} a
 * @param {number} b
 * @param {object} options
 * @param {'tolerance'|'iterations'} options.stopMode - Criterio de parada
 * @param {number} [options.tol] - Tolerancia ε (solo si stopMode === 'tolerance')
 * @param {number} [options.maxIter] - Obligatorio si stopMode === 'iterations'
 */
export function solveBisection(func, a, b, options = {}) {
  const stopMode = options.stopMode ?? 'tolerance';
  const tol = options.tol;

  if (stopMode === 'tolerance' && (!Number.isFinite(tol) || tol <= 0)) {
    return {
      iterations: [],
      root: null,
      converged: false,
      stoppedBy: null,
      stopMode,
      errorMetric: 'absolute',
      message: 'Indica la tolerancia ε.',
    };
  }

  const maxIter = resolveMaxIter(stopMode, options.maxIter);
  if (maxIter === null) {
    return {
      iterations: [],
      root: null,
      converged: false,
      stoppedBy: null,
      stopMode,
      errorMetric: 'absolute',
      message: 'Indica el número de iteraciones.',
    };
  }

  const iterations = [];
  let fa = evaluateExpression(func, a);
  let fb = evaluateExpression(func, b);

  const baseFail = {
    errorMetric: 'absolute',
    stopMode,
  };

  if (!Number.isFinite(fa) || !Number.isFinite(fb)) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      stoppedBy: null,
      message:
        'No se pudo evaluar la función en los extremos del intervalo. Revisa la expresión (por ejemplo: 5*x^3 - 5*x^2 + 6*x - 2).',
    };
  }

  if (fa * fb > 0) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      stoppedBy: null,
      message: 'En el intervalo elegido, f(a) y f(b) deben tener signos opuestos. Prueba con otros valores de a y b.',
    };
  }

  if (Math.abs(fa) < Number.EPSILON) {
    return { iterations: [], root: roundNumber(a), converged: true, message: 'El valor a ya es una raíz exacta de la función.' };
  }
  if (Math.abs(fb) < Number.EPSILON) {
    return { iterations: [], root: roundNumber(b), converged: true, message: 'El valor b ya es una raíz exacta de la función.' };
    return {
      ...baseFail,
      iterations: [],
      root: a,
      converged: true,
      stoppedBy: 'exact',
      message: 'El valor a ya es una raíz exacta de la función.',
    };
  }
  if (Math.abs(fb) < Number.EPSILON) {
    return {
      ...baseFail,
      iterations: [],
      root: b,
      converged: true,
      stoppedBy: 'exact',
      message: 'El valor b ya es una raíz exacta de la función.',
    };
  }

  let prevXr = null;

  for (let i = 1; i <= maxIter; i++) {
    const xr = (a + b) / 2;
    const error = prevXr !== null ? Math.abs(xr - prevXr) / 2 : null;
    const faVal = evaluateExpression(func, a);
    const fbVal = evaluateExpression(func, b);
    const fxr = evaluateExpression(func, xr);
    const faTimesFxr = faVal * fxr;

    iterations.push({
      iteration: i,
      a: roundNumber(a),
      b: roundNumber(b),
      xr: roundNumber(xr),
      fa: roundNumber(evaluateExpression(func, a)),
      fb: roundNumber(evaluateExpression(func, b)),
      fxr: roundNumber(fxr),
      error: error !== null ? roundNumber(error) : null,
      sign: fa * fxr < 0 ? 'f(a)·f(xr) < 0 → raíz en [a, xr]' : 'f(xr)·f(b) < 0 → raíz en [xr, b]',
    });

    // Check convergence
    if (Math.abs(fxr) < Number.EPSILON || (error !== null && error < tol)) {
    if (Math.abs(fxr) < Number.EPSILON) {
      iterations.push({
        iteration: i,
        a,
        b,
        xr,
        prevXr,
        fa: faVal,
        fb: fbVal,
        fxr,
        faTimesFxr,
        error,
        assignment: 'f(xᵣ) = 0',
        sign: 'Raíz en xᵣ',
      });
      return {
        iterations,
        root: roundNumber(xr),
        converged: true,
        stoppedBy: 'exact',
        stopMode,
        errorMetric: 'absolute',
        message: 'Se encontró una raíz exacta en xᵣ.',
      };
    }

    let assignment;
    let sign;

    if (faTimesFxr > 0) {
      assignment = 'a = xᵣ';
      sign = 'f(a)·f(xᵣ) > 0 → a = xᵣ';
    } else if (faTimesFxr < 0) {
      assignment = 'b = xᵣ';
      sign = 'f(a)·f(xᵣ) < 0 → b = xᵣ';
    } else {
      assignment = 'a = xᵣ';
      sign = 'f(a)·f(xᵣ) = 0';
    }

    iterations.push({
      iteration: i,
      a,
      b,
      xr,
      prevXr,
      fa: faVal,
      fb: fbVal,
      fxr,
      faTimesFxr,
      error,
      assignment,
      sign,
    });

    if (stopMode === 'tolerance' && error !== null && error < tol) {
      return {
        iterations,
        root: xr,
        converged: true,
        stoppedBy: 'tolerance',
        stopMode,
        errorMetric: 'absolute',
        message: `Solución encontrada en ${i} ${i === 1 ? 'iteración' : 'iteraciones'} (ε = |xᵣ − xᵣ₋₁|/2 < ${tol}).`,
      };
    }

    if (faTimesFxr > 0) {
      a = xr;
      fa = fxr;
    } else {
      b = xr;
      fb = fxr;
    }

    prevXr = xr;

    if (stopMode === 'iterations' && i === maxIter) {
      return {
        iterations,
        root: xr,
        converged: true,
        stoppedBy: 'iterations',
        stopMode,
        errorMetric: 'absolute',
        message: `Se completaron las ${maxIter} iteraciones solicitadas. Última aproximación: xᵣ ≈ ${xr}.`,
      };
    }
  }

  const lastXr = iterations[iterations.length - 1].xr;
  return {
    iterations,
    root: roundNumber(lastXr),
    converged: false,
    stoppedBy: 'maxIter',
    stopMode,
    errorMetric: 'absolute',
    message:
      stopMode === 'tolerance'
        ? `No se alcanzó ε < ${tol} en ${maxIter} iteraciones. Aumenta el máximo de iteraciones o ajusta la tolerancia.`
        : `No se pudo completar el proceso en ${maxIter} iteraciones.`,
  };
  }
}

