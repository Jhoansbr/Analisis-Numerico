/**
 * Método de punto fijo: xₙ₊₁ = g(xₙ).
 * Acepta g(x) o f(x)=0 en forma -x² + bx + c (se despeja g(x)=√(bx+c) automáticamente).
 */
import { evaluateExpression, sanitizeExpression } from '../utils/mathParser';
import { formatNumber, roundNumber } from '../utils/numberFormat';

const DEFAULT_MAX_ITER_TOLERANCE = 100;

/**
 * Error aproximado relativo porcentual (punto fijo):
 * E_a = |(x_i − x_{i−1}) / x_i| × 100
 * @param {number} xPrev - x_{i−1}
 * @param {number} xi - x_i (valor actual de la iteración)
 */
export function fixedPointErrorEa(xPrev, xi) {
  if (!Number.isFinite(xPrev) || !Number.isFinite(xi) || Math.abs(xi) < Number.EPSILON) {
    return null;
  }
  return Math.abs((xi - xPrev) / xi) * 100;
}

function resolveStopConfig(tol, maxIter) {
  const hasTol = Number.isFinite(tol) && tol > 0;
  const hasMaxIter = Number.isFinite(maxIter) && maxIter >= 1;

  if (!hasTol && !hasMaxIter) {
    return { ok: false, message: 'Indica la tolerancia (%) o el número de iteraciones.' };
  }

  if (hasTol && !hasMaxIter) {
    return { ok: true, stopMode: 'tolerance', tol, maxIter: DEFAULT_MAX_ITER_TOLERANCE };
  }

  if (!hasTol && hasMaxIter) {
    return { ok: true, stopMode: 'iterations', maxIter: Math.floor(maxIter) };
  }

  return { ok: true, stopMode: 'tolerance', tol, maxIter: Math.floor(maxIter) };
}

/**
 * Detecta f(x) = -x² + bx + c y propone g(x) = √(bx + c).
 */
export function analyzeQuadraticF(expr) {
  const s = sanitizeExpression(expr).replace(/\s/g, '');
  const m = s.match(/^-(?:x\^2|x\*\*2)\+([0-9.]+)\*x([+-])([0-9.]+)$/);
  if (!m) return null;

  const b = parseFloat(m[1]);
  const c = (m[2] === '+' ? 1 : -1) * parseFloat(m[3]);
  const discriminant = b * b + 4 * c;
  const suggestedG = `sqrt(${b}*x ${c >= 0 ? '+' : '-'} ${Math.abs(c)})`;
  const fLabel = `-x² + ${b}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`;

  return { b, c, discriminant, suggestedG, fLabel };
}

function resolveIterationFunction(expr) {
  const analysis = analyzeQuadraticF(expr);
  if (!analysis) {
    return { ok: true, gFunc: expr, convertedFromF: false };
  }

  if (analysis.discriminant < 0) {
    return {
      ok: false,
      message: `f(x) = ${analysis.fLabel} = 0 no tiene raíces reales (Δ = ${roundNumber(analysis.discriminant)}). Revisa los coeficientes.`,
    };
  }

  return {
    ok: true,
    gFunc: analysis.suggestedG,
    convertedFromF: true,
    fLabel: analysis.fLabel,
    gLabel: analysis.suggestedG,
  };
}

/**
 * @param {string} expr - g(x) o f(x)=0 en forma -x² + bx + c
 * @param {number} x0
 * @param {number} [tol] - Tolerancia en % (0.05 = 0.05 %)
 * @param {number} [maxIter]
 */
export function solveFixedPoint(expr, x0, tol, maxIter) {
  const baseFail = { stopMode: null, convertedFromF: false };

  if (!Number.isFinite(x0)) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      message: 'Indica el valor inicial x₀.',
    };
  }

  const stop = resolveStopConfig(tol, maxIter);
  if (!stop.ok) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      message: stop.message,
    };
  }

  const resolved = resolveIterationFunction(expr);
  if (!resolved.ok) {
    return {
      ...baseFail,
      iterations: [],
      root: null,
      converged: false,
      message: resolved.message,
    };
  }

  const { gFunc, convertedFromF, fLabel, gLabel } = resolved;
  const { stopMode, maxIter: maxIterations } = stop;
  const tolPercent = stop.tol;

  const conversionNote = convertedFromF
    ? `Se tomó f(x) = ${fLabel} = 0 y se iteró con g(x) = ${gLabel}.`
    : null;

  const gAtX0 = evaluateExpression(gFunc, x0);
  if (!Number.isFinite(gAtX0)) {
    return {
      ...baseFail,
      convertedFromF,
      gFuncUsed: gFunc,
      conversionNote,
      iterations: [],
      root: null,
      converged: false,
      message: `g(${formatNumber(x0)}) no es un número real. Comprueba que x₀ = ${formatNumber(x0)} esté en el dominio de g(x) (por ejemplo, bajo la raíz debe ser ≥ 0).`,
    };
  }

  const iterations = [];
  let xn = x0;

  for (let i = 1; i <= maxIterations; i++) {
    const xn1 = evaluateExpression(gFunc, xn);

    if (!Number.isFinite(xn1)) {
      return {
        ...baseFail,
        convertedFromF,
        gFuncUsed: gFunc,
        conversionNote,
        iterations,
        root: null,
        converged: false,
        stopMode,
        message: `En la iteración ${i}, g(${formatNumber(xn)}) no es un número real. Prueba otro x₀ más cercano a la raíz.`,
      };
    }

    const xi = xn1;
    const xPrev = xn;
    const errorEa = fixedPointErrorEa(xPrev, xi);
    const errorRounded = errorEa !== null ? roundNumber(errorEa) : null;

    iterations.push({
      iteration: i,
      xn: roundNumber(xPrev),
      gx: roundNumber(xi),
      xn1: roundNumber(xi),
      xi: roundNumber(xi),
      xPrev: roundNumber(xPrev),
      error: errorRounded,
      errorEa: errorRounded,
      formula: `x_{${i + 1}} = g(${formatNumber(xPrev)}) = ${formatNumber(xi)}`,
    });

    if (stopMode === 'tolerance' && errorEa !== null && errorEa < tolPercent) {
      return {
        iterations,
        root: roundNumber(xn1),
        converged: true,
        stoppedBy: 'tolerance',
        stopMode,
        convertedFromF,
        gFuncUsed: gFunc,
        conversionNote,
        message: `Solución encontrada en ${i} ${i === 1 ? 'iteración' : 'iteraciones'} (E_a < ${tolPercent}%).${conversionNote ? ` ${conversionNote}` : ''}`,
      };
    }

    xn = xn1;

    if (stopMode === 'iterations' && i === maxIterations) {
      return {
        iterations,
        root: roundNumber(xn),
        converged: true,
        stoppedBy: 'iterations',
        stopMode,
        convertedFromF,
        gFuncUsed: gFunc,
        conversionNote,
        message: `Se completaron las ${maxIterations} iteraciones solicitadas. Última aproximación: x ≈ ${roundNumber(xn)}.${conversionNote ? ` ${conversionNote}` : ''}`,
      };
    }
  }

  return {
    iterations,
    root: roundNumber(xn),
    converged: false,
    stoppedBy: 'maxIter',
    stopMode,
    convertedFromF,
    gFuncUsed: gFunc,
    conversionNote,
    message:
      stopMode === 'tolerance'
        ? `No se alcanzó E_a < ${tolPercent}% en ${maxIterations} iteraciones.${conversionNote ? ` ${conversionNote}` : ''}`
        : `No se pudo completar el proceso en ${maxIterations} iteraciones.`,
  };
}
