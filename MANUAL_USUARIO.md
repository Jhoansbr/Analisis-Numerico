# Manual de Usuario - NumLab

¡Bienvenido a **NumLab**! Esta es una plataforma educativa e interactiva diseñada para facilitar el aprendizaje y la resolución de problemas mediante **Métodos Numéricos**. La aplicación te permite visualizar paso a paso las iteraciones, consultar tablas de datos completas e interactuar con gráficas dinámicas de las funciones.

---

## Índice
1. [Introducción y Requisitos](#1-introducción-y-requisitos)
2. [Sintaxis de Fórmulas Matemáticas](#2-sintaxis-de-fórmulas-matemáticas)
3. [Guía de Métodos Disponibles](#3-guía-de-métodos-disponibles)
   - [Método de Bisección](#método-de-bisección)
   - [Método de Newton-Raphson](#método-de-newton-raphson)
   - [Método de la Secante](#método-de-la-secante)
   - [Método de Punto Fijo](#método-de-punto-fijo)
   - [Interpolación de Lagrange](#interpolación-de-lagrange)
   - [Regla de Simpson 3/8 Compuesta](#regla-de-simpson-38-compuesta)
4. [Uso de Gráficas Interactivas](#4-uso-de-gráficas-interactivas)
5. [Errores Comunes y Solución de Problemas](#5-errores-comunes-y-solución-de-problemas)

---

## 1. Introducción y Requisitos
NumLab es una aplicación web moderna construida con React, Tailwind CSS y Vite.
* **Compatibilidad**: Funciona en cualquier navegador moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) tanto en computadoras de escritorio como en dispositivos móviles.
* **Dependencias**: Utiliza la biblioteca `mathjs` para el análisis y evaluación simbólica de expresiones matemáticas, y `Plotly.js` para generar los gráficos interactivos interactuables en tiempo real.

---

## 2. Sintaxis de Fórmulas Matemáticas
Para ingresar funciones y expresiones en los campos de entrada de la aplicación, debes seguir las reglas de sintaxis de la biblioteca `mathjs`. NumLab realiza automáticamente una limpieza inteligente (sanitización) para adaptarse a las convenciones de escritura habituales:

| Operación / Función | Sintaxis en NumLab | Ejemplo de Entrada | Equivalente Matemático |
| :--- | :--- | :--- | :--- |
| **Suma / Resta** | `+`, `-` | `x + 5` | $x + 5$ |
| **Multiplicación** | `*` o implícita | `3*x` o `3x` | $3x$ |
| **División** | `/` | `x / 2` | $\frac{x}{2}$ |
| **Potencia** | `^` | `x^3 - 2x` | $x^3 - 2x$ |
| **Raíz Cuadrada** | `sqrt()` | `sqrt(x)` | $\sqrt{x}$ |
| **Exponencial** | `exp()` | `exp(-x)` o `exp^(-x)` | $e^{-x}$ |
| **Seno** | `sin()` o `sen()` | `sin(x)` o `sen(x)` | $\sin(x)$ |
| **Coseno** | `cos()` | `cos(x)` | $\cos(x)$ |
| **Tangente** | `tan()` | `tan(x)` | $\tan(x)$ |
| **Logaritmo Natural** | `log()` o `ln()` | `ln(x)` o `log(x)` | $\ln(x)$ |

> [!TIP]
> **Multiplicación implícita:** Puedes escribir `3x` en lugar de `3*x`, o `2(x+1)` en lugar de `2*(x+1)`. El sistema insertará el operador de multiplicación de forma automática.
>
> **Logaritmos:** `ln(x)` y `log(x)` son equivalentes en el parseador de NumLab y evalúan el logaritmo natural (base $e$).

---

## 3. Guía de Métodos Disponibles

### Método de Bisección
Encuentra raíces de funciones continuas dividiendo iterativamente un intervalo por la mitad.
1. **Entradas requeridas**:
   * **Función $f(x)$**: La ecuación a resolver (ej. `x^3 - 4x - 9`).
   * **Intervalo $[a, b]$**: Dos valores numéricos $a$ y $b$ tales que $f(a)$ y $f(b)$ tengan signos opuestos ($f(a) \cdot f(b) < 0$).
   * **Criterio de Parada**: Puedes elegir parar por **Tolerancia** o por **Número máximo de iteraciones**.
   * **Tolerancia ($E_a\%$) / Iteraciones**: El límite permitido para el error aproximado porcentual, o la cantidad máxima de ciclos a ejecutar.
2. **Cómo funciona**:
   * Calcula el punto medio $x_r = \frac{a+b}{2}$.
   * Evalúa el signo de $f(a) \cdot f(x_r)$. Si es positivo, la raíz está en $[x_r, b]$, por lo que $a = x_r$. Si es negativo, la raíz está en $[a, x_r]$, por lo que $b = x_r$.
   * Repite el proceso hasta que el error aproximado sea menor que la tolerancia o se alcancen las iteraciones máximas.

---

### Método de Newton-Raphson
Encuentra raíces estimando la intersección de la recta tangente de la curva con el eje $x$. Es un método abierto de convergencia muy rápida (cuadrática).
1. **Entradas requeridas**:
   * **Función $f(x)$**: La función a evaluar (ej. `cos(x) - x`).
   * **Valor Inicial $x_0$**: Estimación inicial cercana a la raíz.
   * **Tolerancia ($E_a\%$)** e **Iteraciones máximas**: Parámetros de parada.
2. **Cómo funciona**:
   * El sistema calcula la derivada analítica $f'(x)$ automáticamente usando cálculo simbólico.
   * En cada iteración, calcula la siguiente aproximación con la regla:
     $$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$
   * Requiere que la derivada $f'(x_n)$ no sea cero en ningún punto del proceso.

---

### Método de la Secante
Variación del método de Newton-Raphson que evita calcular la derivada de la función, aproximándola por medio de la secante de dos puntos previos.
1. **Entradas requeridas**:
   * **Función $f(x)$**: Expresión matemática.
   * **Estimaciones Iniciales $x_0$ y $x_1$**: Dos puntos de partida cercanos a la raíz.
   * **Tolerancia ($E_a\%$)** e **Iteraciones máximas**.
2. **Cómo funciona**:
   * Calcula la aproximación sucesiva utilizando:
     $$x_{i+1} = x_i - \frac{f(x_i)(x_i - x_{i-1})}{f(x_i) - f(x_{i-1})}$$
   * No requiere derivadas y converge más rápido que la bisección (convergencia superlineal).

---

### Método de Punto Fijo
Resuelve ecuaciones transformando $f(x) = 0$ en la forma equivalente de punto fijo $x = g(x)$ y realizando iteraciones sucesivas.
1. **Entradas requeridas**:
   * **Función $g(x)$**: La función despejada (ej. `sqrt(3x - 1)` o `cos(x)`).
   * **Valor Inicial $x_0$**: Estimación de arranque.
   * **Tolerancia ($E_a\%$)** e **Iteraciones máximas**.
2. **Cómo funciona**:
   * Ejecuta iteraciones simples: $x_{n+1} = g(x_n)$.
   * El método converge únicamente si la magnitud de la derivada $|g'(x)| < 1$ en el entorno de la raíz (condición de contracción).

---

### Interpolación de Lagrange
Construye un polinomio que pasa exactamente por un conjunto de puntos discretos, útil para estimar valores intermedios.
1. **Entradas requeridas**:
   * **Tabla de puntos $(x, y)$**: Mínimo 2 puntos. Puedes añadir filas adicionales usando el botón interactivo.
   * **Valor a evaluar $x_{\text{eval}}$** (Opcional): Punto donde deseas interpolar y estimar el valor de $y$.
2. **Cómo funciona**:
   * Construye los polinomios base de Lagrange:
     $$L_i(x) = \prod_{\substack{j=0 \\ j \neq i}}^{n} \frac{x - x_j}{x_i - x_j}$$
   * El polinomio interpolador resultante es:
     $$P(x) = \sum_{i=0}^{n} y_i \cdot L_i(x)$$
   * La aplicación te muestra el polinomio resultante simplificado paso a paso y evalúa el punto solicitado.

---

### Regla de Simpson 3/8 Compuesta
Aproxima el área bajo la curva (integral definida) de una función continua utilizando polinomios de interpolación de tercer grado (cúbicos).
1. **Entradas requeridas**:
   * **Función $f(x)$**: La curva a integrar (ej. `1 / (1 + x^2)`).
   * **Límites de Integración $a$ y $b$**: Extremo inferior y superior del intervalo.
   * **Número de subintervalos $n$**: Debe ser obligatoriamente un **múltiplo de 3** (ej. 3, 6, 9, 12...).
2. **Cómo funciona**:
   * Divide el intervalo $[a, b]$ en $n$ subintervalos de ancho $h = \frac{b-a}{n}$.
   * Aplica la fórmula compuesta:
     $$I \approx \frac{3h}{8} \left[ f(x_0) + f(x_n) + 3\sum_{i \neq \text{mult de 3}} f(x_i) + 2\sum_{i = \text{mult de 3}} f(x_i) \right]$$
   * La aplicación genera una tabla detallada con los puntos evaluados y colorea el área calculada bajo el gráfico.

---

## 4. Uso de Gráficas Interactivas
Las gráficas son generadas con `Plotly` y responden dinámicamente a tus datos.
* **Zoom**: Haz clic sostenido y arrastra un recuadro sobre la zona que deseas ampliar. Doble clic restablece el zoom predeterminado.
* **Desplazamiento (Pan)**: Selecciona el ícono de la mano ("Pan") en la barra de herramientas del gráfico (esquina superior derecha) para arrastrar la gráfica en cualquier dirección.
* **Información al Pasar el Cursor (Hover)**: Al colocar el cursor sobre la gráfica o los puntos de datos, se despliega una tarjeta de información mostrando las coordenadas exactas $(x, y)$ de las iteraciones.
* **Leyendas**: Haz clic en el nombre de una serie de datos en la leyenda para ocultarla o mostrarla (por ejemplo, ocultar la línea tangente para ver solo la función base).

---

## 5. Errores Comunes y Solución de Problemas

1. **Error: "La función contiene caracteres inválidos"**:
   * Asegúrate de utilizar la variable de control **`x`** en minúscula.
   * Revisa que los paréntesis estén correctamente balanceados.
2. **Error de divergencia o no convergencia**:
   * En Newton-Raphson o Punto Fijo, una estimación inicial $x_0$ muy lejana a la raíz puede provocar que los valores crezcan indefinidamente. Intenta cambiar el punto de arranque.
   * En Punto Fijo, asegúrate de que la función elegida $g(x)$ cumpla que $|g'(x)| < 1$.
3. **El cálculo no termina o da error de división por cero**:
   * Sucede cuando la derivada $f'(x_n)$ se hace cero en Newton-Raphson, o cuando se divide por diferencias nulas en el método de la Secante. Modifica el punto inicial.
4. **Simpson 3/8 da error sobre el número de intervalos**:
   * Asegúrate de ingresar un valor de $n$ múltiplo de 3 (como 3, 6, 12, etc.). Si no es múltiplo de 3, el sistema arrojará un error de validación.
