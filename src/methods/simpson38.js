/**
 * simpson38.js
 * Regla compuesta de Simpson 3/8 para integración numérica.
 */
import { evaluateExpression } from '../utils/mathParser';
import { formatNumber, roundNumber } from '../utils/numberFormat';

function simpson38Weight(index, n) {
  if (index === 0 || index === n) return 1;
  if (index % 3 === 0) return 2;
  return 3;
}

function buildIntegralFormula(h, nodes) {
  const terms = nodes.map(
    (node) => `${node.weight} \\cdot f(${formatNumber(node.x)})`
  );
  return `I \\approx \\frac{3 \\cdot ${formatNumber(h)}}{8} \\left( ${terms.join(' + ')} \\right)`;
}

function computeSimpson38(func, a, b, n) {
  const h = (b - a) / n;
  const nodes = [];
  let weightedSum = 0;

  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    const fx = evaluateExpression(func, x);
    const weight = simpson38Weight(i, n);
    const term = weight * fx;
    weightedSum += term;
    nodes.push({
      i,
      x: roundNumber(x),
      fx: roundNumber(fx),
      weight,
      term: roundNumber(term),
    });
  }

  const integral = roundNumber((3 * h / 8) * weightedSum);

  return {
    h: roundNumber(h),
    n,
    nodes,
    weightedSum: roundNumber(weightedSum),
    integral,
    formula: buildIntegralFormula(roundNumber(h), nodes),
  };
}

/**
 * Aproxima ∫ₐᵇ f(x) dx con la regla compuesta de Simpson 3/8,
 * aumentando n de 3 en 3 hasta cumplir la tolerancia.
 */
export function solveSimpson38(func, a, b, tol = 0.001, maxIter = 50) {
  if (a >= b) {
    return {
      iterations: [],
      integral: null,
      converged: false,
      message: 'El límite inferior a debe ser menor que el superior b.',
    };
  }

  let n = 3;
  let prevIntegral = null;
  const iterations = [];

  for (let iter = 1; iter <= maxIter; iter++) {
    const calc = computeSimpson38(func, a, b, n);

    if (calc.nodes.some((node) => !Number.isFinite(node.fx))) {
      return {
        iterations,
        integral: null,
        converged: false,
        message: 'La función f(x) produjo valores no válidos. Revisa la expresión o los límites de integración.',
      };
    }

    const error =
      prevIntegral !== null && calc.integral !== 0
        ? roundNumber(Math.abs((calc.integral - prevIntegral) / calc.integral) * 100)
        : null;

    iterations.push({
      iteration: iter,
      n: calc.n,
      h: calc.h,
      nodes: calc.nodes,
      weightedSum: calc.weightedSum,
      integral: calc.integral,
      error,
      formula: calc.formula,
      detail: `n = ${calc.n} subintervalos, h = ${formatNumber(calc.h)}`,
    });

    if (error !== null && error < tol) {
      return {
        iterations,
        integral: calc.integral,
        converged: true,
        message: `Integral aproximada en ${iter} ${iter === 1 ? 'iteración' : 'iteraciones'}, dentro de la tolerancia indicada.`,
        finalN: calc.n,
      };
    }

    prevIntegral = calc.integral;
    n += 3;
  }

  const last = iterations[iterations.length - 1];
  return {
    iterations,
    integral: last?.integral ?? null,
    converged: false,
    message: `No se alcanzó la tolerancia en ${maxIter} iteraciones. Aumenta el máximo de iteraciones o ajusta la tolerancia.`,
    finalN: last?.n,
  };
}
