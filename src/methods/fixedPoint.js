/**
 * fixedPoint.js
 * Implements the Fixed Point method for finding roots of equations.
 * Returns step-by-step data for educational display.
 */
import { evaluateExpression } from '../utils/mathParser';

/**
 * Solves x = g(x) using the Fixed Point method.
 * @param {string} gFunc - Iteration function g(x)
 * @param {number} x0 - Initial guess
 * @param {number} tol - Tolerance for convergence
 * @param {number} maxIter - Maximum number of iterations
 * @returns {{ iterations: Array, root: number, converged: boolean, message: string }}
 */
export function solveFixedPoint(gFunc, x0, tol = 1e-6, maxIter = 100) {
  const iterations = [];
  let xn = x0;

  for (let i = 1; i <= maxIter; i++) {
    const xn1 = evaluateExpression(gFunc, xn);

    if (!Number.isFinite(xn1)) {
      return {
        iterations,
        root: null,
        converged: false,
        message: 'La función g(x) produjo un valor no válido. Revisa la expresión o prueba otro valor inicial.',
      };
    }

    const error = Math.abs((xn1 - xn) / xn1) * 100;

    iterations.push({
      iteration: i,
      xn,
      gx: xn1,
      xn1,
      error,
      formula: `x_{${i + 1}} = g(${xn.toFixed(5)}) = ${xn1.toFixed(5)}`,
    });

    if (error < tol) {
      return {
        iterations,
        root: xn1,
        converged: true,
        message: `Solución encontrada en ${i} ${i === 1 ? 'iteración' : 'iteraciones'}, dentro de la tolerancia indicada.`,
      };
    }

    xn = xn1;
  }

  return {
    iterations,
    root: xn,
    converged: false,
    message: `No se alcanzó la tolerancia en ${maxIter} iteraciones. Ajusta g(x), x₀ o la tolerancia.`,
  };
}
