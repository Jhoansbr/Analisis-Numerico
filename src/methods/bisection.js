/**
 * bisection.js
 * Implements the Bisection method for finding roots of equations.
 * Returns step-by-step data for educational display.
 */
import { evaluateExpression } from '../utils/mathParser';
import { roundNumber } from '../utils/numberFormat';

/**
 * Solves f(x) = 0 using the Bisection method.
 * @param {string} func - Mathematical expression string
 * @param {number} a - Left bound of the interval
 * @param {number} b - Right bound of the interval
 * @param {number} tol - Tolerance for convergence
 * @param {number} maxIter - Maximum number of iterations
 * @returns {{ iterations: Array, root: number, converged: boolean, message: string }}
 */
export function solveBisection(func, a, b, tol = 1e-6, maxIter = 100) {
  const iterations = [];
  let fa = evaluateExpression(func, a);
  let fb = evaluateExpression(func, b);

  // Check if initial interval is valid
  if (fa * fb > 0) {
    return {
      iterations: [],
      root: null,
      converged: false,
      message: 'En el intervalo elegido, f(a) y f(b) deben tener signos opuestos. Prueba con otros valores de a y b.',
    };
  }

  // Check if one of the endpoints is already a root
  if (Math.abs(fa) < Number.EPSILON) {
    return { iterations: [], root: roundNumber(a), converged: true, message: 'El valor a ya es una raíz exacta de la función.' };
  }
  if (Math.abs(fb) < Number.EPSILON) {
    return { iterations: [], root: roundNumber(b), converged: true, message: 'El valor b ya es una raíz exacta de la función.' };
  }

  let prevXr = null;

  for (let i = 1; i <= maxIter; i++) {
    const xr = (a + b) / 2;
    const fxr = evaluateExpression(func, xr);
    const error = prevXr !== null ? Math.abs((xr - prevXr) / xr) * 100 : null;

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
      return {
        iterations,
        root: roundNumber(xr),
        converged: true,
        message: `Solución encontrada en ${i} ${i === 1 ? 'iteración' : 'iteraciones'}, dentro de la tolerancia indicada.`,
      };
    }

    // Update interval
    if (fa * fxr < 0) {
      b = xr;
      fb = fxr;
    } else {
      a = xr;
      fa = fxr;
    }

    prevXr = xr;
  }

  const lastXr = iterations[iterations.length - 1].xr;
  return {
    iterations,
    root: roundNumber(lastXr),
    converged: false,
    message: `No se alcanzó la tolerancia en ${maxIter} iteraciones. Puedes aumentar el máximo de iteraciones o ajustar la tolerancia.`,
  };
}
