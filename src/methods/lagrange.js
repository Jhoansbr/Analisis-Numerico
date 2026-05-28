/**
 * lagrange.js
 * Implements Lagrange Interpolation.
 * Returns step-by-step data and the resulting polynomial for educational display.
 */

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

/**
 * Computes the Lagrange interpolating polynomial and its evaluation at a point.
 * @param {Array<{x: number, y: number}>} points - Array of data points
 * @param {number|null} xEval - The x value to evaluate the polynomial at (optional)
 * @returns {{ steps: Array, polynomial: string, result: number|null, points: Array }}
 */
export function solveLagrange(points, xEval = null) {
  const n = points.length;
  const steps = [];

  for (let i = 0; i < n; i++) {
    let numeratorParts = [];
    let denominatorValue = 1;
    let numeratorForDisplay = [];
    let denominatorForDisplay = [];

    for (let j = 0; j < n; j++) {
      if (i !== j) {
        numeratorParts.push({ xj: points[j].x });
        numeratorForDisplay.push(formatLinearTerm(points[j].x));
        denominatorForDisplay.push(formatDifference(points[i].x, points[j].x));
        denominatorValue *= (points[i].x - points[j].x);
      }
    }

    // Evaluate Li(xEval) if requested
    let liValue = null;
    if (xEval !== null) {
      let num = 1;
      for (const part of numeratorParts) {
        num *= (xEval - part.xj);
      }
      liValue = num / denominatorValue;
    }

    steps.push({
      index: i,
      xi: points[i].x,
      yi: points[i].y,
      numerator: numeratorForDisplay.join(' · '),
      denominator: denominatorForDisplay.join(' · '),
      denominatorValue: denominatorValue,
      liValue: liValue,
      contribution: liValue !== null ? liValue * points[i].y : null,
      latex: `L_{${i}}(x) = \\frac{${numeratorForDisplay.join(' \\cdot ')}}{${denominatorForDisplay.join(' \\cdot ')}}`,
    });
  }

  // Compute the final result
  let result = null;
  if (xEval !== null) {
    result = steps.reduce((sum, step) => sum + step.contribution, 0);
  }

  // Build a descriptive polynomial string
  const polynomial = `P(x) = \\sum_{i=0}^{${n - 1}} y_i \\cdot L_i(x)`;

  return {
    steps,
    polynomial,
    result,
    points,
    xEval,
  };
}

/**
 * Generate data points for plotting the Lagrange interpolation polynomial.
 * @param {Array<{x: number, y: number}>} points - Data points
 * @param {number} xMin - Minimum x for plot
 * @param {number} xMax - Maximum x for plot
 * @param {number} numPlotPoints - Number of plot points
 * @returns {{ xValues: number[], yValues: number[] }}
 */
export function generateLagrangePlotData(points, xMin, xMax, numPlotPoints = 300) {
  const xValues = [];
  const yValues = [];
  const step = (xMax - xMin) / (numPlotPoints - 1);

  for (let k = 0; k < numPlotPoints; k++) {
    const x = xMin + k * step;
    let y = 0;
    for (let i = 0; i < points.length; i++) {
      let li = 1;
      for (let j = 0; j < points.length; j++) {
        if (i !== j) {
          li *= (x - points[j].x) / (points[i].x - points[j].x);
        }
      }
      y += points[i].y * li;
    }
    if (isFinite(y) && Math.abs(y) < 1e8) {
      xValues.push(x);
      yValues.push(y);
    }
  }

  return { xValues, yValues };
}
