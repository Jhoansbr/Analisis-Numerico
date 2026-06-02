/**
 * mathParser.js
 * Utility for parsing and evaluating mathematical expressions using mathjs.
 * Provides safe evaluation, derivative computation, and function plotting helpers.
 */
import { compile, derivative, parse } from 'mathjs';

/**
 * Converts a mathjs-compatible expression to LaTeX for KaTeX rendering.
 * @param {string} expr
 * @returns {string}
 */
export function expressionToLatex(expr) {
  try {
    const cleaned = sanitizeExpression(expr);
    return parse(cleaned).toTex({ parenthesis: 'auto' });
  } catch {
    return '';
  }
}

/**
 * Safely evaluates a mathematical expression string at a given x value.
 * @param {string} expr - The mathematical expression (e.g., "x^3 - 4*x - 9")
 * @param {number} x - The value of x to evaluate at
 * @returns {number} The result of the evaluation
 */
function toRealNumber(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : NaN;
  }
  if (value && typeof value === 'object' && 're' in value && 'im' in value) {
    const { re, im } = value;
    if (Number.isFinite(re) && Number.isFinite(im) && Math.abs(im) < 1e-12) {
      return re;
    }
    return NaN;
  }
  return NaN;
}

export function evaluateExpression(expr, x) {
  try {
    const cleaned = sanitizeExpression(expr);
    const node = compile(cleaned);
    return toRealNumber(node.evaluate({ x }));
  } catch {
    return NaN;
  }
}

/**
 * Computes the symbolic derivative of an expression with respect to x.
 * @param {string} expr - The mathematical expression
 * @returns {string} The derivative as a string
 */
export function getDerivative(expr) {
  try {
    const cleaned = sanitizeExpression(expr);
    const node = parse(cleaned);
    const d = derivative(node, 'x');
    return d.toTex({ parenthesis: 'auto' });
  } catch {
    return '';
  }
}

/** Evaluable derivative string (mathjs syntax) for numeric evaluation */
function getDerivativeEvalString(expr) {
  try {
    const cleaned = sanitizeExpression(expr);
    return derivative(parse(cleaned), 'x').toString();
  } catch {
    return '';
  }
}

/**
 * Evaluates the derivative of an expression at a given x value.
 * @param {string} expr - The mathematical expression
 * @param {number} x - The value of x
 * @returns {number} The derivative value at x
 */
export function evaluateDerivative(expr, x) {
  try {
    const derivStr = getDerivativeEvalString(expr);
    if (!derivStr) return NaN;
    return evaluateExpression(derivStr, x);
  } catch {
    return NaN;
  }
}

/**
 * Generates an array of {x, y} points for plotting a function.
 * @param {string} expr - The mathematical expression
 * @param {number} xMin - Minimum x value
 * @param {number} xMax - Maximum x value
 * @param {number} [numPoints=300] - Number of points to generate
 * @returns {{ xValues: number[], yValues: number[] }}
 */
export function generatePlotData(expr, xMin, xMax, numPoints = 300) {
  const xValues = [];
  const yValues = [];
  const step = (xMax - xMin) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * step;
    const y = evaluateExpression(expr, x);
    // Filter out extreme values for cleaner plots
    if (isFinite(y) && Math.abs(y) < 1e6) {
      xValues.push(x);
      yValues.push(y);
    }
  }

  return { xValues, yValues };
}

/**
 * Converts a user-friendly expression to mathjs-compatible format.
 * Handles common patterns like implicit multiplication.
 * @param {string} expr - User input expression
 * @returns {string} Cleaned expression
 */
export function sanitizeExpression(expr) {
  let sanitized = expr.trim();
  sanitized = sanitized.replace(/sen/gi, 'sin');
  sanitized = sanitized.replace(/ln/gi, 'log');
  // exp^(-x) → exp(-x) (notación común en apuntes)
  sanitized = sanitized.replace(/exp\s*\^\s*\(/gi, 'exp(');
  // Multiplicación implícita: 3x → 3*x, 2(x+1) → 2*(x+1)
  sanitized = sanitized.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
  return sanitized;
}
