# NumLab — Documentación del proyecto

Este documento describe **cómo está construida** la aplicación web de métodos numéricos, para que puedas explicarla en una presentación, defensa de proyecto o revisión técnica.

---

## 1. ¿Qué es esta aplicación?

**NumLab** es una aplicación web educativa que permite:

- Resolver problemas con **bisección**, **Newton-Raphson**, **secante** e **interpolación de Lagrange**.
- Ver la **teoría** de cada método (definición, fórmulas, ventajas/desventajas).
- Seguir el **cálculo paso a paso** de cada iteración.
- Consultar una **tabla** con todos los valores intermedios.
- Visualizar **gráficas** de la función o del polinomio interpolante.

Todo el cálculo se ejecuta **en el navegador del usuario** (no hay servidor de aplicación ni API). Los archivos estáticos generados (`dist/`) se pueden publicar en cualquier hosting web.

---

## 2. Tecnologías utilizadas

| Tecnología | Rol en el proyecto |
|------------|-------------------|
| **React 19** | Interfaz de usuario por componentes |
| **Vite 8** | Herramienta de desarrollo y empaquetado (build) |
| **React Router 7** | Navegación entre páginas (Inicio, Bisección, Newton, etc.) |
| **Tailwind CSS 4** | Estilos y sistema de diseño (colores, espaciado, tipografía) |
| **mathjs** | Evaluar expresiones `f(x)`, derivadas simbólicas y conversión a LaTeX |
| **KaTeX** | Renderizar fórmulas matemáticas como ecuaciones visuales |
| **Plotly.js** | Gráficas interactivas (zoom, hover, leyenda) |
| **Framer Motion** | Animaciones suaves al mostrar resultados y menús |
| **Lucide React** | Iconos (navegación, estados de convergencia, etc.) |

---

## 3. Estructura de carpetas

```
Metodo Numerico/
├── index.html              # Página HTML base y carga de fuentes
├── package.json            # Dependencias y scripts (dev, build, lint)
├── vite.config.js          # Configuración de Vite + React + Tailwind
├── DOCUMENTACION.md        # Este archivo
├── .github/workflows/
│   └── deploy.yml          # Despliegue automático al hacer push a master
│
└── src/
    ├── main.jsx            # Punto de entrada: monta React en #root
    ├── App.jsx             # Rutas de la aplicación
    ├── index.css           # Tema global, variables CSS, utilidades (cards, botones)
    │
    ├── layouts/
    │   └── MainLayout.jsx  # Barra lateral, cabecera, pie y <Outlet /> de páginas
    │
    ├── pages/              # Una página por método + inicio
    │   ├── Home.jsx
    │   ├── BisectionPage.jsx
    │   ├── NewtonPage.jsx
    │   ├── SecantPage.jsx
    │   └── LagrangePage.jsx
    │
    ├── components/         # Piezas reutilizables de la UI
    │   ├── MathFormula.jsx
    │   ├── TheorySection.jsx
    │   ├── ResultCard.jsx
    │   ├── StepByStep.jsx
    │   ├── IterativeTable.jsx
    │   ├── InteractivePlot.jsx
    │   ├── ResultsTabs.jsx
    │   ├── MethodCard.jsx
    │   └── ui/
    │       ├── InputField.jsx
    │       └── AlertBanner.jsx
    │
    ├── methods/            # Lógica numérica (algoritmos)
    │   ├── bisection.js
    │   ├── newton.js
    │   ├── secant.js
    │   └── lagrange.js
    │
    ├── utils/
    │   └── mathParser.js   # Evaluación de f(x), derivadas, datos para gráficas
    │
    └── data/
        └── methodsData.js  # Textos de teoría, valores por defecto, rutas, iconos
```

Tras `npm run build`, Vite genera la carpeta **`dist/`** con HTML, CSS y JavaScript listos para producción.

---

## 4. Flujo general de la aplicación

```
Usuario abre la web
       ↓
main.jsx carga App.jsx
       ↓
App.jsx define rutas con React Router
       ↓
MainLayout envuelve todas las páginas (menú lateral + contenido)
       ↓
El usuario elige un método → entra a una Page (ej. BisectionPage)
       ↓
Completa el formulario y pulsa "Calcular"
       ↓
La Page llama a solveBisection(...) en methods/bisection.js
       ↓
El solver usa mathParser para evaluar f(x) en cada paso
       ↓
Devuelve un objeto: { iterations, root, converged, message, ... }
       ↓
La Page guarda el resultado en useState y muestra:
   - ResultsTabs → ResultCard, StepByStep, IterativeTable, InteractivePlot
```

**Idea clave:** las páginas **no calculan** directamente; delegan en los archivos de `src/methods/`. La interfaz solo muestra lo que esos módulos devuelven.

---

## 5. Capas del proyecto (explicación por responsabilidad)

### 5.1 Entrada y rutas

- **`main.jsx`**: importa estilos globales y renderiza `<App />` dentro de `#root`.
- **`App.jsx`**: configura `BrowserRouter` y asocia cada URL con un componente de página. Todas las rutas hijas usan `MainLayout` como contenedor común.

| Ruta | Página |
|------|--------|
| `/` | Home |
| `/bisection` | BisectionPage |
| `/newton` | NewtonPage |
| `/secant` | SecantPage |
| `/lagrange` | LagrangePage |

### 5.2 Layout (`MainLayout.jsx`)

- Barra lateral con enlaces (`NavLink` de React Router).
- En móvil: menú desplegable con overlay.
- Cabecera con el nombre de la sección actual.
- `<Outlet />`: aquí React Router inserta la página activa.

### 5.3 Datos estáticos (`methodsData.js`)

Centraliza información que **no cambia** en tiempo de ejecución:

- Nombre y descripción corta de cada método.
- Ruta (`path`), color del gradiente, icono (Lucide).
- Bloque `theory`: definición, objetivo, cuándo usarlo, fórmulas en LaTeX, ventajas y desventajas.
- `defaultValues`: valores iniciales del formulario (función de ejemplo, intervalo, tolerancia, etc.).

Las páginas hacen `methodsData.find((m) => m.id === 'bisection')` para obtener su configuración.

### 5.4 Lógica numérica (`src/methods/`)

Cada archivo exporta una función principal:

| Archivo | Función | Qué hace |
|---------|---------|----------|
| `bisection.js` | `solveBisection(func, a, b, options)` | Bisección con **ε = \|xᵣ − xᵣ₋₁\|/2**; parada por **tolerancia** o por **número fijo de iteraciones** (`stopMode`) |
| `newton.js` | `solveNewton(func, x0, tol, maxIter)` | Itera con tangentes; devuelve también `derivativeStr` en LaTeX |
| `secant.js` | `solveSecant(func, x0, x1, tol, maxIter)` | Aproxima la derivada con dos puntos |
| `lagrange.js` | `solveLagrange(points, xEval)` | Construye polinomios base Lᵢ(x) y evalúa P(x) |

**Formato típico de respuesta** (métodos de raíces):

```javascript
{
  iterations: [ /* un objeto por iteración con todos los números */ ],
  root: 2.056...,           // raíz aproximada (o null si falló)
  converged: true,          // ¿llegó a la tolerancia?
  message: '...'            // texto amigable para el usuario
}
```

Cada iteración incluye campos extra para la UI, por ejemplo:

- Bisección: `a`, `b`, `xr`, `prevXr`, `fa`, `fxr`, `fb`, `error` (ε = \|xᵣ−xᵣ₋₁\|/2), `sign`, `stoppedBy` (`tolerance` \| `iterations`).
- Newton / Secante: `error` en **porcentaje**; la tolerancia `tol` es el error relativo en decimal (ej. `0.01` → 1 %).
- Newton: `xn`, `fxn`, `fpxn`, `xn1`, `error`, `formula` (cadena LaTeX del paso).
- Secante: similar con `xPrev`, `xCurr`, `xNext`, etc.
- Lagrange: `steps` con `latex` del polinomio base, `liValue`, `contribution`.

### 5.5 Utilidades matemáticas (`mathParser.js`)

| Función | Uso |
|---------|-----|
| `evaluateExpression(expr, x)` | Calcula f(x) a partir de un string (`"x^3 - 4*x - 9"`) |
| `getDerivative(expr)` | Derivada simbólica convertida a **LaTeX** (para mostrar f′(x)) |
| `evaluateDerivative(expr, x)` | Valor numérico de f′(x) en un punto |
| `expressionToLatex(expr)` | Convierte una expresión a LaTeX |
| `generatePlotData(expr, xMin, xMax)` | Arrays de puntos para dibujar f(x) con Plotly |
| `sanitizeExpression(expr)` | Normaliza entrada (ej. `sen` → `sin`) |

**mathjs** interpreta la expresión que escribe el usuario; no hace falta escribir JavaScript.

### 5.6 Páginas (`src/pages/`)

Todas las páginas de métodos siguen el **mismo patrón**:

1. **Cabecera** con icono, título y descripción (desde `methodsData`).
2. **`TheorySection`**: teoría colapsable con fórmulas KaTeX.
3. **Formulario** (`InputField` + botones Calcular / Reiniciar).
4. Al calcular: llamar al `solve*` correspondiente y guardar resultado en `useState`.
5. Si hay error sin iteraciones → **`AlertBanner`**.
6. Si hay datos → **`ResultsTabs`** con cuatro pestañas:
   - **Resultado** → `ResultCard` (+ derivada en Newton, o tarjeta propia en Lagrange).
   - **Paso a paso** → `StepByStep` (modo `embedded` dentro de la pestaña).
   - **Tabla** → `IterativeTable`.
   - **Gráfica** → `InteractivePlot` (carga Plotly dinámicamente).

**Lagrange** es ligeramente distinta: en lugar de `f(x)` e intervalo, el usuario define una lista de puntos `(x, y)` y un valor `x` donde evaluar P(x).

### 5.7 Componentes de interfaz

| Componente | Función |
|------------|---------|
| `MathFormula` | Renderiza strings LaTeX con KaTeX (`inline` o `block`) |
| `TheorySection` | Acordeón con definición, fórmulas, ventajas/desventajas |
| `ResultCard` | Estado de convergencia, raíz, número de iteraciones, error final |
| `StepByStep` | Stepper vertical; un panel por iteración con detalle según `methodType` |
| `IterativeTable` | Tabla HTML con colores según magnitud del error |
| `InteractivePlot` | Contenedor Plotly; importa la librería solo cuando hace falta |
| `ResultsTabs` | Pestañas para organizar resultado / pasos / tabla / gráfica |
| `MethodCard` | Tarjeta en Home que navega al método |
| `InputField` | Campo de formulario con estilos del diseño |
| `AlertBanner` | Mensaje de aviso o error en lenguaje claro |

### 5.8 Estilos (`index.css`)

- Define variables CSS (`--color-bg`, `--color-accent`, etc.).
- Clases reutilizables: `section-card`, `btn-primary`, `btn-secondary`, `input-field`, `gradient-text`.
- Ajustes de KaTeX y Plotly para el tema oscuro.
- Tailwind se importa con `@import "tailwindcss"` (v4 integrado en Vite).

---

## 6. Cómo se muestran las fórmulas

1. Las fórmulas **teóricas** viven en `methodsData.js` como strings LaTeX, por ejemplo:  
   `'x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}'`

2. En cada iteración, los solvers generan cadenas LaTeX con números sustituidos (ej. en `newton.js`: campo `formula`).

3. La derivada simbólica se obtiene con mathjs y se convierte con `.toTex()` para que KaTeX la entienda.

4. `MathFormula` llama a `katex.renderToString(...)` y muestra el HTML resultante.

Si una fórmula falla al renderizar, se muestra un texto discreto (“Fórmula no disponible”) en lugar de código LaTeX crudo o mensajes técnicos.

---

## 7. Gráficas (Plotly)

- `InteractivePlot` recibe un array de **trazas** (traces) en formato Plotly.
- Cada página construye esas trazas después de calcular:
  - Curva de `f(x)` o `P(x)`.
  - Puntos de aproximación o puntos dados.
  - Línea horizontal y = 0 (en métodos de raíces).
- Plotly se importa con `import('plotly.js/dist/plotly.js')` solo en el cliente, para no romper el build y reducir carga inicial.

---

## 8. Scripts npm

```bash
npm run dev      # Servidor local de desarrollo (recarga al guardar)
npm run build    # Genera carpeta dist/ para producción
npm run preview  # Previsualiza el build localmente
npm run lint     # Revisa el código con ESLint
```

---

## 9. Despliegue (GitHub Actions)

El archivo `.github/workflows/deploy.yml`:

1. Se ejecuta al hacer **push a la rama `master`**.
2. Instala Node 22, dependencias y ejecuta `npm run build`.
3. Por SSH limpia `/var/www/react-app/` en el servidor.
4. Copia el contenido de `dist/` al servidor con SCP.

Secrets necesarios en GitHub: `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY`.

La app en producción es **solo archivos estáticos** (HTML/JS/CSS); el servidor web (nginx, Apache, etc.) solo los sirve.

---

## 10. Cómo añadir o modificar algo (guía rápida)

### Cambiar textos de teoría o valores por defecto
→ Editar `src/data/methodsData.js`.

### Cambiar el algoritmo o las fórmulas de un paso
→ Editar el archivo correspondiente en `src/methods/`.

### Cambiar cómo se ve una tabla o un paso
→ Editar `IterativeTable.jsx` o el bloque `*Detail` dentro de `StepByStep.jsx`.

### Añadir un método nuevo
1. Crear `src/methods/nuevoMetodo.js` con función `solveNuevoMetodo`.
2. Añadir entrada en `methodsData.js`.
3. Crear `src/pages/NuevoMetodoPage.jsx` (copiar patrón de BisectionPage).
4. Registrar ruta en `App.jsx` y enlace en `MainLayout.jsx` y `Home.jsx`.

### Cambiar colores o tipografía
→ `src/index.css` (variables y clases) y fuentes en `index.html`.

---

## 11. Resumen para explicar en una frase

> *“Es una SPA en React que implementa los algoritmos numéricos en JavaScript puro con mathjs, muestra la teoría y los pasos con KaTeX, y grafica con Plotly; todo corre en el cliente y se despliega como sitio estático.”*

---

## 12. Dependencias principales (referencia)

```json
"react", "react-dom", "react-router-dom",
"mathjs", "katex",
"plotly.js", "framer-motion", "lucide-react",
"tailwindcss", "clsx", "tailwind-merge"
```

Si necesitas ampliar esta documentación (diagramas, capturas o guión de exposición oral), se puede añadir una sección aparte en el mismo archivo.
