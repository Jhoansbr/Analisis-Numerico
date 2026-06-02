/**
 * Interpolación de Lagrange.
 * P(x) = Σ yᵢ · Lᵢ(x),  Lᵢ(x) = Π (x − xⱼ)/(xᵢ − xⱼ), j ≠ i
 */
import { formatNumber, roundNumber } from '../utils/numberFormat';

function formatLinearTerm(xj) {
  if (xj === 0) return 'x';
  if (xj < 0) return `(x + ${Math.abs(xj)})`;
  return `(x - ${xj})`;
}

function formatDifference(xi, xj) {
  const diff = xi - xj;
  if (diff < 0) return `(${xi} + ${Math.abs(diff)})`;
  return `(${xi} - ${xj})`;
}

/** Multiplica un polinomio (coeficientes en x⁰, x¹, …) por (x − root). */
function multiplyByLinear(coeffs, root) {
  const next = new Array(coeffs.length + 1).fill(0);
  for (let i = 0; i < coeffs.length; i++) {
    next[i] -= coeffs[i] * root;
    next[i + 1] += coeffs[i];
  }
  return next;
}

/** Coeficientes de Lᵢ(x) (grado n−1). */
function lagrangeBasisCoefficients(points, i) {
  let coeffs = [1];
  let denominator = 1;

  for (let j = 0; j < points.length; j++) {
    if (i === j) continue;
    coeffs = multiplyByLinear(coeffs, points[j].x);
    denominator *= points[i].x - points[j].x;
  }

  return coeffs.map((c) => c / denominator);
}

/** Suma de yᵢ·Lᵢ(x) en coeficientes. */
function buildPolynomialCoefficients(points) {
  const n = points.length;
  const total = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    const basis = lagrangeBasisCoefficients(points, i);
    for (let k = 0; k < basis.length; k++) {
      total[k] += points[i].y * basis[k];
    }
  }

  return total;
}

function trimNearZero(value, eps = 1e-10) {
  return Math.abs(value) < eps ? 0 : value;
}

function formatPolynomialText(coeffs) {
  const terms = [];
  for (let power = coeffs.length - 1; power >= 0; power--) {
    const raw = trimNearZero(coeffs[power]);
    if (raw === 0) continue;

    const coeff = roundNumber(raw);
    const abs = Math.abs(coeff);
    let term;

    if (power === 0) {
      term = `${abs}`;
    } else if (power === 1) {
      term = abs === 1 ? 'x' : `${abs}x`;
    } else {
      term = abs === 1 ? `x^${power}` : `${abs}x^${power}`;
    }

    if (terms.length === 0) {
      terms.push(coeff < 0 ? `-${term}` : term);
    } else {
      terms.push(coeff < 0 ? ` - ${term}` : ` + ${term}`);
    }
  }

  return terms.length ? terms.join('') : '0';
}

function formatPolynomialLatex(coeffs) {
  const terms = [];
  for (let power = coeffs.length - 1; power >= 0; power--) {
    const raw = trimNearZero(coeffs[power]);
    if (raw === 0) continue;

    const coeff = roundNumber(raw);
    const abs = Math.abs(coeff);
    let term;

    if (power === 0) {
      term = `${abs}`;
    } else if (power === 1) {
      term = abs === 1 ? 'x' : `${abs}x`;
    } else {
      term = abs === 1 ? `x^{${power}}` : `${abs}x^{${power}}`;
    }

    if (terms.length === 0) {
      terms.push(coeff < 0 ? `-${term}` : term);
    } else {
      terms.push(coeff < 0 ? ` - ${term}` : ` + ${term}`);
    }
  }

  return terms.length ? terms.join('') : '0';
}

function evaluatePolynomial(coeffs, x) {
  let value = 0;
  for (let i = 0; i < coeffs.length; i++) {
    value += coeffs[i] * x ** i;
  }
  return value;
}

/**
 * @param {Array<{x: number, y: number}>} points
 * @param {number|null|undefined} xEval - Si es null/undefined, solo devuelve el polinomio
 */
export function solveLagrange(points, xEval = null) {
  const baseFail = { converged: false, steps: [], points: [] };

  if (!Array.isArray(points) || points.length < 2) {
    return {
      ...baseFail,
      polynomial: '',
      polynomialLatex: '',
      result: null,
      xEval: null,
      message: 'Ingresa al menos dos puntos (x, y).',
    };
  }

  const numericPoints = points.map((p) => ({
    x: Number(p.x),
    y: Number(p.y),
  }));

  if (numericPoints.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))) {
    return {
      ...baseFail,
      polynomial: '',
      polynomialLatex: '',
      result: null,
      xEval: null,
      message: 'Todos los puntos deben tener valores numéricos en x e y.',
    };
  }

  const xs = numericPoints.map((p) => p.x);
  if (new Set(xs).size !== xs.length) {
    return {
      ...baseFail,
      polynomial: '',
      polynomialLatex: '',
      result: null,
      xEval: null,
      message: 'Los valores de x deben ser distintos entre sí.',
    };
  }

  const n = numericPoints.length;
  const steps = [];

  for (let i = 0; i < n; i++) {
    const numeratorForDisplay = [];
    const denominatorForDisplay = [];
    let denominatorValue = 1;

    for (let j = 0; j < n; j++) {
      if (i !== j) {
        numeratorForDisplay.push(formatLinearTerm(numericPoints[j].x));
        denominatorForDisplay.push(formatDifference(numericPoints[i].x, numericPoints[j].x));
        denominatorValue *= numericPoints[i].x - numericPoints[j].x;
      }
    }

    let liValue = null;
    let contribution = null;
    if (xEval !== null && xEval !== undefined && Number.isFinite(xEval)) {
      liValue = 1;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          liValue *= (xEval - numericPoints[j].x) / (numericPoints[i].x - numericPoints[j].x);
        }
      }
      contribution = liValue * numericPoints[i].y;
    }

    steps.push({
      index: i,
      xi: roundNumber(numericPoints[i].x),
      yi: roundNumber(numericPoints[i].y),
      numerator: numeratorForDisplay.join(' · '),
      denominator: denominatorForDisplay.join(' · '),
      denominatorValue: roundNumber(denominatorValue),
      liValue: liValue !== null ? roundNumber(liValue) : null,
      contribution: contribution !== null ? roundNumber(contribution) : null,
      latex: `L_{${i}}(x) = \\frac{${numeratorForDisplay.join(' \\cdot ')}}{${denominatorForDisplay.join(' \\cdot ')}} = \\frac{${numeratorForDisplay.join(' \\cdot ')}}{${formatNumber(roundNumber(denominatorValue))}}`,
    });
  }

  const polyCoeffs = buildPolynomialCoefficients(numericPoints);
  const polynomialText = formatPolynomialText(polyCoeffs);
  const polynomialLatex = formatPolynomialLatex(polyCoeffs);
  const polynomial = `P(x) = ${polynomialText}`;
  const polynomialLatexFull = `P(x) = ${polynomialLatex}`;

  const hasEval = xEval !== null && xEval !== undefined && Number.isFinite(xEval);
  let result = null;
  if (hasEval) {
    result = roundNumber(evaluatePolynomial(polyCoeffs, xEval));
  }

  const roundedPoints = numericPoints.map((p) => ({
    x: roundNumber(p.x),
    y: roundNumber(p.y),
  }));

  return {
    steps,
    polynomial,
    polynomialLatex: polynomialLatexFull,
    polynomialCoeffs: polyCoeffs.map((c) => roundNumber(c)),
    result,
    points: roundedPoints,
    xEval: hasEval ? roundNumber(xEval) : null,
    converged: true,
    message: hasEval
      ? `Polinomio interpolante obtenido. P(${formatNumber(roundNumber(xEval))}) = ${formatNumber(result)}.`
      : 'Polinomio interpolante obtenido.',
  };
}

/**
 * Genera puntos para graficar P(x).
 */
export function generateLagrangePlotData(points, xMin, xMax, numPlotPoints = 300) {
  const coeffs = buildPolynomialCoefficients(points);
  const xValues = [];
  const yValues = [];
  const step = (xMax - xMin) / (numPlotPoints - 1);

  for (let k = 0; k < numPlotPoints; k++) {
    const x = xMin + k * step;
    const y = evaluatePolynomial(coeffs, x);
    if (Number.isFinite(y) && Math.abs(y) < 1e8) {
      xValues.push(x);
      yValues.push(y);
    }
  }

  return { xValues, yValues };
}
