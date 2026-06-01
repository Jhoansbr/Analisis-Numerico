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

  const baseFail = {
    errorMetric: 'absolute',
    stopMode,
  };

  if (stopMode === 'tolerance' && (!Number.isFinite(tol) || tol <= 0)) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      stoppedBy: null,
      message: 'Indica la tolerancia ε.',
    };
  }

  const maxIter = resolveMaxIter(stopMode, options.maxIter);
  if (maxIter === null) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      stoppedBy: null,
      message: 'Indica el número de iteraciones.',
    };
  }

  let fa = evaluateExpression(func, a);
  let fb = evaluateExpression(func, b);

  if (!Number.isFinite(fa) || !Number.isFinite(fb)) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      stoppedBy: null,
      message:
        'No se pudo evaluar la función en los extremos del intervalo. Revisa la expresión (por ejemplo: e^(3*x) - 4 o exp(3*x) - 4).',
    };
  }

  if (fa * fb > 0) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      stoppedBy: null,
      message:
        'En el intervalo elegido, f(a) y f(b) deben tener signos opuestos. Prueba con otros valores de a y b.',
    };
  }

  if (Math.abs(fa) < Number.EPSILON) {
    return {
      ...baseFail,
      iterations: [],
      root: roundNumber(a),
      converged: true,
      stoppedBy: 'exact',
      message: 'El valor a ya es una raíz exacta de la función.',
    };
  }

  if (Math.abs(fb) < Number.EPSILON) {
    return {
      ...baseFail,
      iterations: [],
      root: roundNumber(b),
      converged: true,
      stoppedBy: 'exact',
      message: 'El valor b ya es una raíz exacta de la función.',
    };
  }

  const iterations = [];
  let prevXr = null;

  for (let i = 1; i <= maxIter; i++) {
    const xr = (a + b) / 2;
    const error = prevXr !== null ? Math.abs(xr - prevXr) / 2 : null;
    const fxr = evaluateExpression(func, xr);
    const faTimesFxr = fa * fxr;

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
      a: roundNumber(a),
      b: roundNumber(b),
      xr: roundNumber(xr),
      fa: roundNumber(fa),
      fb: roundNumber(fb),
      fxr: roundNumber(fxr),
      error: error !== null ? roundNumber(error) : null,
      assignment,
      sign,
    });

    if (Math.abs(fxr) < Number.EPSILON) {
      return {
        ...baseFail,
        iterations,
        root: roundNumber(xr),
        converged: true,
        stoppedBy: 'exact',
        message: 'Se encontró una raíz exacta en xᵣ.',
      };
    }

    if (stopMode === 'tolerance' && error !== null && error < tol) {
      return {
        ...baseFail,
        iterations,
        root: roundNumber(xr),
        converged: true,
        stoppedBy: 'tolerance',
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
        ...baseFail,
        iterations,
        root: roundNumber(xr),
        converged: true,
        stoppedBy: 'iterations',
        message: `Se completaron las ${maxIter} iteraciones solicitadas. Última aproximación: xᵣ ≈ ${roundNumber(xr)}.`,
      };
    }
  }

  const lastXr = iterations[iterations.length - 1]?.xr ?? null;
  return {
    ...baseFail,
    iterations,
    root: lastXr !== null ? roundNumber(lastXr) : null,
    converged: false,
    stoppedBy: 'maxIter',
    message:
      stopMode === 'tolerance'
        ? `No se alcanzó ε < ${tol} en ${maxIter} iteraciones. Aumenta el máximo de iteraciones o ajusta la tolerancia.`
        : `No se pudo completar el proceso en ${maxIter} iteraciones.`,
  };
}
