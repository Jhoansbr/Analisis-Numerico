/**
 * newton.js
 * Implements the Newton-Raphson method for finding roots of equations.
 * Returns step-by-step data for educational display.
 */
import { evaluateExpression, evaluateDerivative, getDerivative } from '../utils/mathParser';
import { formatNumber, roundNumber } from '../utils/numberFormat';

/**
 * Solves f(x) = 0 using the Newton-Raphson method.
 * @param {string} func - Mathematical expression string
 * @param {number} x0 - Initial guess
 * @param {number} tol - Tolerance for convergence
 * @param {number} maxIter - Maximum number of iterations
 * @returns {{ iterations: Array, root: number, converged: boolean, message: string, derivativeStr: string }}
 */
export function solveNewton(func, x0, tol = 1e-6, maxIter = 100) {
  const iterations = [];
  let xn = x0;
  const derivativeStr = getDerivative(func);

  if (!derivativeStr) {
    return {
      iterations: [],
      root: null,
      converged: false,
      message: 'No pudimos interpretar la función. Revisa la expresión (usa x como variable, por ejemplo: x^3 - 4*x - 9).',
      derivativeStr: '',
    };
  }

  for (let i = 1; i <= maxIter; i++) {
    const fxn = evaluateExpression(func, xn);
    const fpxn = evaluateDerivative(func, xn);

    // Check if derivative is zero (tangent is horizontal)
    if (Math.abs(fpxn) < Number.EPSILON) {
      return {
        iterations,
        root: null,
        converged: false,
        message: 'La derivada se anula en este punto: la tangente es horizontal y el método no puede avanzar. Prueba otro valor inicial.',
        derivativeStr,
      };
    }

    const xn1 = xn - fxn / fpxn;
    const error = Math.abs((xn1 - xn) / xn1) * 100;

    const xnR = roundNumber(xn);
    const fxnR = roundNumber(fxn);
    const fpxnR = roundNumber(fpxn);
    const xn1R = roundNumber(xn1);
    const errorR = roundNumber(error);

    iterations.push({
      iteration: i,
      xn: xnR,
      fxn: fxnR,
      fpxn: fpxnR,
      xn1: xn1R,
      error: errorR,
      formula: `x_{${i}} = ${formatNumber(xnR)} - \\frac{${formatNumber(fxnR)}}{${formatNumber(fpxnR)}} = ${formatNumber(xn1R)}`,
    });

    // Check convergence
    if (error < tol || Math.abs(fxn) < Number.EPSILON) {
      return {
        iterations,
        root: xn1R,
        converged: true,
        message: `Solución encontrada en ${i} ${i === 1 ? 'iteración' : 'iteraciones'}, dentro de la tolerancia indicada.`,
        derivativeStr,
      };
    }

    xn = xn1;
  }

  return {
    iterations,
    root: roundNumber(xn),
    converged: false,
    message: `No se alcanzó la tolerancia en ${maxIter} iteraciones. Prueba otro valor inicial o relaja la tolerancia.`,
    derivativeStr,
  };
}
