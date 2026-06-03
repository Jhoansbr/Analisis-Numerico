/**
 * methodsData.js
 * Contains metadata for all available numerical methods.
 * Used to render the home page cards and method page headers.
 */
import {
  GitBranch,
  Target,
  TrendingDown,
  RefreshCw,
  Spline,
  AreaChart,
} from 'lucide-react';

const methodsData = [
  {
    id: 'bisection',
    name: 'Método de Bisección',
    shortDesc: 'Encuentra raíces dividiendo intervalos sucesivamente. Un método robusto y confiable basado en el Teorema del Valor Intermedio.',
    icon: GitBranch,
    color: 'from-cyan-500 to-teal-500',
    colorHex: '#06b6d4',
    path: '/bisection',
    theory: {
      definition: 'El método de bisección es un algoritmo de búsqueda de raíces que divide repetidamente un intervalo por la mitad y selecciona el subintervalo donde la función cambia de signo, garantizando convergencia hacia una raíz.',
      objective: 'Encontrar una raíz de f(x) = 0 dentro de un intervalo [a, b] donde f(a) y f(b) tienen signos opuestos.',
      when: 'Se utiliza cuando se conoce un intervalo que contiene una raíz y se requiere un método simple y convergente. Es ideal para funciones continuas.',
      advantages: [
        'Siempre converge si se elige un intervalo válido',
        'Simple de implementar y entender',
        'No requiere calcular derivadas',
        'Robusto para funciones continuas',
      ],
      disadvantages: [
        'Convergencia lenta (lineal)',
        'Solo encuentra una raíz por intervalo',
        'Requiere que f(a) · f(b) < 0',
        'No aprovecha la información de la forma de la función',
      ],
      formula: 'x_r = \\frac{a + b}{2}',
      errorFormula: '\\varepsilon = \\frac{|x_r^{(k)} - x_r^{(k-1)}|}{2} < \\varepsilon_{\\text{tol}}',
      updateRule:
        'f(a)\\cdot f(x_r) > 0 \\Rightarrow a = x_r \\quad ; \\quad f(a)\\cdot f(x_r) < 0 \\Rightarrow b = x_r',
      videos: [
        { type: 'youtube', id: 'mdG6gpzE54k', title: 'Conceptos y ejemplo práctico' },
        { type: 'youtube', id: '0WPixuL6AZU', title: 'Ejercicio resuelto paso a paso' }
      ],
    },
    defaultValues: {
      func: '',
      a: '',
      b: '',
      stopMode: 'tolerance',
      tol: '',
      maxIter: '',
    },
  },
  {
    id: 'newton',
    name: 'Newton-Raphson',
    shortDesc: 'Método iterativo que usa la derivada para convergir rápidamente hacia la raíz mediante aproximaciones tangenciales.',
    icon: Target,
    color: 'from-violet-500 to-purple-500',
    colorHex: '#8b5cf6',
    path: '/newton',
    theory: {
      definition: 'El método de Newton-Raphson utiliza la tangente de la función en un punto para aproximar la raíz. En cada iteración, se calcula la intersección de la recta tangente con el eje x.',
      objective: 'Encontrar una raíz de f(x) = 0 partiendo de una estimación inicial x₀, usando la derivada f\'(x) para guiar la convergencia.',
      when: 'Se utiliza cuando se necesita convergencia rápida y la función es diferenciable. Ideal cuando se tiene una buena estimación inicial.',
      advantages: [
        'Convergencia cuadrática (muy rápida)',
        'Eficiente para funciones suaves',
        'Pocas iteraciones necesarias',
        'Alta precisión en pocas iteraciones',
      ],
      disadvantages: [
        'Requiere calcular la derivada f\'(x)',
        'Puede divergir con mala estimación inicial',
        'Falla si f\'(x) = 0 en algún punto',
        'No garantiza convergencia global',
      ],
      formula: 'x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}',
      errorFormula: '\\varepsilon = \\left| \\frac{x_{n+1} - x_n}{x_{n+1}} \\right| \\times 100\\%',
      videos: [
        { type: 'youtube', id: '9po1Lt0_4lw', title: 'Teoría y aplicación del método' },
        { type: 'youtube', id: 'n53t8CtaLrM', title: 'Ejercicio resuelto' }
      ],
    },
    defaultValues: {
      func: '',
      x0: '',
      tol: '',
      maxIter: '',
    },
  },
  {
    id: 'secant',
    name: 'Método de la Secante',
    shortDesc: 'Variación de Newton-Raphson que aproxima la derivada usando dos puntos previos, sin necesidad de calcularla explícitamente.',
    icon: TrendingDown,
    color: 'from-amber-500 to-orange-500',
    colorHex: '#f59e0b',
    path: '/secant',
    theory: {
      definition: 'El método de la secante es similar al de Newton-Raphson, pero en lugar de usar la derivada exacta, la aproxima mediante la pendiente de la recta secante que pasa por dos puntos consecutivos de la función.',
      objective: 'Encontrar una raíz de f(x) = 0 usando dos estimaciones iniciales x₀ y x₁, sin necesidad de calcular derivadas.',
      when: 'Se utiliza cuando la derivada es difícil o costosa de calcular, pero se desea una convergencia más rápida que la bisección.',
      advantages: [
        'No requiere calcular derivadas',
        'Convergencia superlineal (orden ≈ 1.618)',
        'Más rápido que bisección',
        'Simple de implementar',
      ],
      disadvantages: [
        'No garantiza convergencia',
        'Puede fallar si f(x₀) ≈ f(x₁)',
        'Requiere dos estimaciones iniciales',
        'Menos robusto que bisección',
      ],
      formula:
        'x_{i+1} = x_i - \\frac{f(x_i)(x_i - x_{i-1})}{f(x_i) - f(x_{i-1})}',
      errorFormula:
        '\\varepsilon_a = \\left| \\frac{x_{i+1}^{(k)} - x_{i+1}^{(k-1)}}{x_{i+1}^{(k)}} \\right| \\times 100\\%',
      videos: [
        { type: 'youtube', id: 'dv6SXvX9lzw', title: 'Explicación del método de la Secante' },
        { type: 'youtube', id: 'NsCBSQQAUo0', title: 'Ejercicio resuelto paso a paso' }
      ],
    },
    defaultValues: {
      func: '',
      x0: '',
      x1: '',
      tol: '',
      maxIter: '',
    },
  },
  {
    id: 'fixed-point',
    name: 'Método de Punto Fijo',
    shortDesc: 'Resuelve ecuaciones con una función iterativa g(x), aplicando xₙ₊₁ = g(xₙ) hasta cumplir la tolerancia.',
    icon: RefreshCw,
    color: 'from-pink-500 to-rose-500',
    colorHex: '#f43f5e',
    path: '/fixed-point',
    theory: {
      definition: 'El método de punto fijo transforma la ecuación f(x)=0 en x=g(x) y genera una sucesión iterativa xₙ₊₁=g(xₙ). Si g cumple condiciones de contracción cerca de la raíz, la sucesión converge.',
      objective: 'Encontrar un valor x* tal que x* = g(x*), equivalente a una raíz de la ecuación original.',
      when: 'Se utiliza cuando es posible despejar la variable y construir una función g(x) adecuada que converja desde un valor inicial cercano.',
      advantages: [
        'Implementación sencilla',
        'No requiere derivadas',
        'Permite distintas reformulaciones de la ecuación',
        'Útil como introducción a métodos iterativos',
      ],
      disadvantages: [
        'No siempre converge',
        'Depende fuertemente de la elección de g(x)',
        'Suele converger más lento que Newton',
        'Puede divergir con malas aproximaciones iniciales',
      ],
      formula: 'x_{n+1} = g(x_n)',
      errorFormula:
        'E_a = \\left| \\frac{x_i - x_{i-1}}{x_i} \\right| \\times 100',
      videos: [
        { type: 'youtube', id: '8b75oripNyw', title: 'Fundamentos del Punto Fijo' },
        { type: 'youtube', id: 'yZGUG2yfSDI', title: 'Ejemplo de aplicación' }
      ],
    },
    defaultValues: {
      g: '',
      x0: '',
      tol: '',
      maxIter: '',
    },
  },
  {
    id: 'lagrange',
    name: 'Interpolación de Lagrange',
    shortDesc: 'Construye un polinomio que pasa exactamente por un conjunto de puntos dados, permitiendo estimar valores intermedios.',
    icon: Spline,
    color: 'from-emerald-500 to-green-500',
    colorHex: '#10b981',
    path: '/lagrange',
    theory: {
      definition: 'La interpolación de Lagrange construye un polinomio de grado n-1 que pasa exactamente por n puntos dados. Cada punto contribuye con un polinomio base L_i(x).',
      objective: 'Dado un conjunto de puntos (x₀, y₀), (x₁, y₁), ..., (xₙ, yₙ), encontrar el polinomio P(x) que pase por todos ellos y permita estimar valores intermedios.',
      when: 'Se utiliza cuando se tienen datos discretos y se desea estimar valores intermedios o construir una aproximación continua de los datos.',
      advantages: [
        'Fórmula explícita y directa',
        'No requiere resolver sistemas de ecuaciones',
        'El polinomio pasa exactamente por los puntos',
        'Útil para interpolación con pocos puntos',
      ],
      disadvantages: [
        'Fenómeno de Runge con muchos puntos',
        'Inestabilidad numérica con grados altos',
        'Recálculo completo al agregar puntos',
        'No adecuado para extrapolación',
      ],
      formula: 'P(x) = \\sum_{i=0}^{n} y_i \\cdot L_i(x), \\quad L_i(x) = \\prod_{\\substack{j=0 \\\\ j \\neq i}}^{n} \\frac{x - x_j}{x_i - x_j}',
      videos: [
        { type: 'external', url: 'https://unisimonedu-my.sharepoint.com/personal/s_jurgensen_unisimon_edu_co/_layouts/15/stream.aspx?id=%2Fpersonal%2Fs%5Fjurgensen%5Funisimon%5Fedu%5Fco%2FDocuments%2FUNISIMON%2Fanalisis%20numerico%2Flagrange%20sneider%20y%20anyul%2Emp4&ga=1&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2Ef109cf0a%2D8534%2D4e0f%2D834d%2D9fa106cb790d', title: 'Explicación Lagrange (Sneider y Anyul)' },
        { type: 'youtube', id: 'Z0n1TXe2_Dc', title: 'Ejemplo de interpolación de Lagrange' }
      ],
    },
    defaultValues: {
      points: [
        { x: '', y: '' },
        { x: '', y: '' },
      ],
      xEval: '',
    },
  },
  {
    id: 'simpson38',
    name: 'Regla de Simpson 3/8',
    shortDesc: 'Aproxima integrales definidas con polinomios cúbicos en paneles de tres subintervalos, refinando n hasta cumplir la tolerancia.',
    icon: AreaChart,
    color: 'from-indigo-500 to-blue-500',
    colorHex: '#6366f1',
    path: '/simpson38',
    theory: {
      definition:
        'La regla de Simpson 3/8 integra sobre tres subintervalos iguales usando un polinomio cúbico. En forma compuesta, el número de subintervalos n debe ser múltiplo de 3 y los coeficientes 1, 3, 3, 2 se repiten en cada panel.',
      objective:
        'Calcular una aproximación de ∫ₐᵇ f(x) dx dividiendo [a, b] en n subintervalos (n múltiplo de 3) y aplicando la fórmula compuesta de Simpson 3/8.',
      when:
        'Se utiliza cuando la función es suave en [a, b] y se busca mayor precisión que el trapecio o Simpson 1/3 con el mismo número de evaluaciones en ciertos casos.',
      advantages: [
        'Buena precisión para funciones suaves',
        'Fórmula cerrada y fácil de programar',
        'Error controlable aumentando n',
        'Adecuada para integración educativa paso a paso',
      ],
      disadvantages: [
        'Requiere que n sea múltiplo de 3',
        'No es adaptativa por sí sola',
        'Puede fallar con funciones no suaves o singulares',
        'El error depende de la cuarta derivada de f',
      ],
      formula:
        'I \\approx \\frac{3h}{8} \\left[ f(x_0) + f(x_n) + \\sum_{\\substack{i=1 \\\\ i \\not\\equiv 0 \\pmod{3}}}^{n-1} 3f(x_i) + \\sum_{\\substack{i=1 \\\\ i \\equiv 0 \\pmod{3}}}^{n-1} 2f(x_i) \\right], \\quad h = \\frac{b-a}{n}',
      errorFormula:
        '\\varepsilon = \\left| \\frac{I_{\\text{nuevo}} - I_{\\text{anterior}}}{I_{\\text{nuevo}}} \\right| \\times 100\\%',
      videos: [
        { type: 'youtube', id: 'mq9Q6aHP9ow', title: 'Introducción a Simpson 3/8' },
        { type: 'youtube', id: '_t-E6QGs4Mo', title: 'Ejemplo de integración numérica' }
      ],
    },
    defaultValues: {
      func: 'x^2',
      a: 0,
      b: 1,
      tol: 0.001,
      maxIter: 50,
    },
  },
];

export default methodsData;
