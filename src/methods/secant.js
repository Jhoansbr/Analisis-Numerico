/**
 * secant.js
 * Implements the Secant method for finding roots of equations.
 * Returns step-by-step data for educational display.
 */
import { evaluateExpression } from '../utils/mathParser';

/**
 * Solves f(x) = 0 using the Secant method.
 * @param {string} func - Mathematical expression string
 * @param {number} x0 - First initial guess
 * @param {number} x1 - Second initial guess
 * @param {number} tol - Tolerance for convergence
 * @param {number} maxIter - Maximum number of iterations
 * @returns {{ iterations: Array, root: number, converged: boolean, message: string }}
 */
export function solveSecant(func, x0, x1, tol = 1e-6, maxIter = 100) {
  const iterations = [];
  let xPrev = x0;
  let xCurr = x1;

  for (let i = 1; i <= maxIter; i++) {
    const fPrev = evaluateExpression(func, xPrev);
    const fCurr = evaluateExpression(func, xCurr);

    // Check if denominator is zero
    if (Math.abs(fCurr - fPrev) < Number.EPSILON) {
      return {
        iterations,
        root: null,
        converged: false,
        message: 'Los dos últimos valores de la función son casi iguales; el método no puede continuar. Elige otros puntos iniciales.',
      };
    }

    const xNext = xCurr - fCurr * (xCurr - xPrev) / (fCurr - fPrev);
    const error = Math.abs((xNext - xCurr) / xNext) * 100;

    iterations.push({
      iteration: i,
      xPrev: xPrev,
      xCurr: xCurr,
      fPrev: fPrev,
      fCurr: fCurr,
      xNext: xNext,
      error: error,
      formula: `x_{${i + 1}} = ${xCurr.toFixed(5)} - ${fCurr.toFixed(5)} \\cdot \\frac{${xCurr.toFixed(5)} - ${xPrev.toFixed(5)}}{${fCurr.toFixed(5)} - ${fPrev.toFixed(5)}} = ${xNext.toFixed(5)}`,
    });

    // Check convergence
    if (error < tol || Math.abs(fCurr) < Number.EPSILON) {
      return {
        iterations,
        root: xNext,
        converged: true,
        message: `Solución encontrada en ${i} ${i === 1 ? 'iteración' : 'iteraciones'}, dentro de la tolerancia indicada.`,
      };
    }

    xPrev = xCurr;
    xCurr = xNext;
  }

  return {
    iterations,
    root: xCurr,
    converged: false,
    message: `No se alcanzó la tolerancia en ${maxIter} iteraciones. Ajusta x₀, x₁ o la tolerancia.`,
  };
}
