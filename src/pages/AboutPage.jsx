/**
 * Página Acerca de y Manual de Usuario integrado.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  BookOpen,
  User,
  GraduationCap,
  Layers,
  HelpCircle,
  ChevronDown,
  Info,
  Code2,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('developers');

  return (
    <div className="page-shell max-w-5xl space-y-6">
      {/* Cabecera de la Página */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="section-card p-6 sm:p-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                <Info className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Acerca del Proyecto
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold leading-tight">
              NumLab: Laboratorio Virtual de Métodos Numéricos
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-text-muted)] max-w-prose">
              Una plataforma interactiva para el aprendizaje práctico de algoritmos de cálculo.
              Diseñada para visualizar iteraciones paso a paso, aproximar raíces, interpolar datos y calcular integrales.
            </p>
          </div>
          {/* Logo de la Universidad (pequeño arriba) */}
          <div className="shrink-0 md:self-start bg-white p-2.5 rounded-xl border border-[var(--color-border)] shadow-sm max-w-[150px] flex items-center justify-center">
            <img
              src="/image.png"
              alt="Logo Universidad Simón Bolívar"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>
        </div>

        {/* Pestañas de Navegación Interna */}
        <div className="flex border-b border-[var(--color-border)] mt-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('developers')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-0.5 ${
              activeTab === 'developers'
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Users className="w-4 h-4" /> Desarrolladores
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-0.5 ${
              activeTab === 'manual'
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Manual de Usuario
          </button>
        </div>
      </motion.div>

      {/* Contenido Dinámico de las Pestañas */}
      <AnimatePresence mode="wait">
        {activeTab === 'developers' ? (
          <motion.div
            key="developers-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Grid de Desarrolladores */}
            <div>
              <h2 className="text-lg font-display font-semibold mb-4 text-[var(--color-text)]">
                Equipo de Desarrollo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Jhoan Sebastian Blanco Rincon',
                    role: 'Estudiante de Ingeniería de Sistemas',
                    desc: 'Desarrollador enfocado en la lógica algorítmica y procesamiento de datos numéricos en NumLab.',
                  },
                  {
                    name: 'Anyul Lisbeth Martinez Gimenez',
                    role: 'Estudiante de Ingeniería de Sistemas',
                    desc: 'Encargada de la recopilación teórica, estructura didáctica y flujo educativo del laboratorio.',
                  },
                  {
                    name: 'Fernanda Beatriz Jaimes Jaimes',
                    role: 'Estudiante de Ingeniería de Sistemas',
                    desc: 'Desarrolladora enfocada en la visualización interactiva de gráficas y diseño de la interfaz web.',
                  },
                ].map((dev, i) => (
                  <motion.div
                    key={dev.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="section-card p-5 flex flex-col justify-between hover:border-[var(--color-accent)]/30 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-raised)] flex items-center justify-center text-[var(--color-accent)]">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base text-[var(--color-text)] leading-snug">
                          {dev.name}
                        </h3>
                        <p className="text-xs text-[var(--color-accent)] font-medium mt-0.5">
                          {dev.role}
                        </p>
                      </div>
                      <p className="text-xs text-[var(--color-text-subtle)] leading-relaxed">
                        {dev.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-[var(--color-text-subtle)] mt-4 pt-2.5 border-t border-[var(--color-border)] opacity-85">
                      <GraduationCap className="w-3 h-3 text-[var(--color-text-subtle)] shrink-0" /> Universidad Simón Bolívar
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div
            key="manual-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Manual de Usuario Integrado */}
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h2 className="text-lg font-display font-semibold text-[var(--color-text)]">
                  Guía de Ayuda para el Usuario
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Aprende a ingresar ecuaciones y a interpretar los resultados del sistema.
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href="/MANUAL_USUARIO.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" /> Ver Markdown
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <AccordionItem
                title="1. ¿Cómo escribir fórmulas matemáticas?"
                icon={Code2}
                defaultOpen
              >
                <div className="space-y-3 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  <p>
                    NumLab procesa las fórmulas ingresadas utilizando un analizador matemático flexible.
                    A continuación se listan las expresiones y su formato sugerido:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left border border-[var(--color-border)] rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-[var(--color-surface-raised)] border-b border-[var(--color-border)]">
                          <th className="p-2.5 font-semibold text-xs text-[var(--color-text)]">Operación</th>
                          <th className="p-2.5 font-semibold text-xs text-[var(--color-text)]">Escribir en NumLab</th>
                          <th className="p-2.5 font-semibold text-xs text-[var(--color-text)]">Ejemplo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)]">
                        <tr>
                          <td className="p-2.5">Suma / Resta</td>
                          <td className="p-2.5"><code>+</code> , <code>-</code></td>
                          <td className="p-2.5"><code>x^2 - 4x + 3</code></td>
                        </tr>
                        <tr>
                          <td className="p-2.5">Multiplicación implícita</td>
                          <td className="p-2.5">Espacio o pegado (autodetectado)</td>
                          <td className="p-2.5"><code>3x</code> se interpreta como <code>3 * x</code></td>
                        </tr>
                        <tr>
                          <td className="p-2.5">División y Potencias</td>
                          <td className="p-2.5"><code>/</code> , <code>^</code></td>
                          <td className="p-2.5"><code>x^3 / 2</code></td>
                        </tr>
                        <tr>
                          <td className="p-2.5">Raíz Cuadrada</td>
                          <td className="p-2.5"><code>sqrt(x)</code></td>
                          <td className="p-2.5"><code>sqrt(x + 2)</code></td>
                        </tr>
                        <tr>
                          <td className="p-2.5">Función Exponencial</td>
                          <td className="p-2.5"><code>exp(x)</code> o <code>exp^(x)</code></td>
                          <td className="p-2.5"><code>exp(-x)</code></td>
                        </tr>
                        <tr>
                          <td className="p-2.5">Funciones Trigonométricas</td>
                          <td className="p-2.5"><code>sin(x)</code> o <code>sen(x)</code>, <code>cos(x)</code></td>
                          <td className="p-2.5"><code>cos(x) - sin(x)</code></td>
                        </tr>
                        <tr>
                          <td className="p-2.5">Logaritmo Natural</td>
                          <td className="p-2.5"><code>ln(x)</code> o <code>log(x)</code></td>
                          <td className="p-2.5"><code>ln(x^2 + 1)</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-800 flex gap-2">
                    <span className="font-semibold shrink-0">Nota:</span> Use siempre la variable de control <code>x</code> en minúscula.
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem
                title="2. Métodos de Raíces (Bisección, Newton, Secante, Punto Fijo)"
                icon={Layers}
              >
                <div className="space-y-4 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--color-text)] mb-1">Método de Bisección</h4>
                    <p className="text-xs">
                      Requiere un intervalo [a, b] donde haya un cambio de signo (f(a) * f(b) &lt; 0). El sistema dividirá el intervalo sucesivamente a la mitad hasta converger a la raíz.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--color-text)] mb-1">Método de Newton-Raphson</h4>
                    <p className="text-xs">
                      Utiliza la derivada analítica calculada simbólicamente por el software. Requiere un punto inicial x₀ cercano a la raíz. Es extremadamente rápido pero puede divergir si la pendiente en xₙ es cero.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--color-text)] mb-1">Método de la Secante</h4>
                    <p className="text-xs">
                      Similar a Newton pero aproxima la derivada mediante dos valores iniciales x₀ y x₁. No requiere cálculo de derivadas y es ideal para funciones complejas.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--color-text)] mb-1">Método de Punto Fijo</h4>
                    <p className="text-xs">
                      Requiere definir una función iterativa despejada x = g(x). El software calcula iterativamente xₙ₊₁ = g(xₙ) y converge si la derivada |g'(x)| &lt; 1 en el vecindario de la raíz.
                    </p>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem
                title="3. Interpolación de Lagrange e Integración Simpson 3/8"
                icon={CheckCircle2}
              >
                <div className="space-y-4 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--color-text)] mb-1">Interpolación de Lagrange</h4>
                    <p className="text-xs">
                      Te permite ingresar múltiples puntos ordenados en coordenadas (x, y). Al presionar calcular, el sistema genera el polinomio único simplificado que cruza por todos esos puntos. Puedes proveer un valor x_eval para calcular su proyección estimada en y.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--color-text)] mb-1">Regla de Simpson 3/8 Compuesta</h4>
                    <p className="text-xs">
                      Calcula integrales definidas aproximando el área bajo la curva con segmentos cúbicos. Es indispensable que el número de subintervalos n sea un **múltiplo de 3** (ej. 3, 6, 9, etc.). La aplicación coloreará visualmente el área calculada.
                    </p>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem
                title="4. Visualización de Resultados y Gráficas Interactivas"
                icon={HelpCircle}
              >
                <div className="space-y-2 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  <p>
                    Cada resultado de cálculo se presenta estructurado en pestañas interactivas:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li><strong>Resultado:</strong> Muestra un resumen del valor final calculado, el error relativo y el estado de convergencia.</li>
                    <li><strong>Paso a paso:</strong> Muestra detalladamente los desarrollos algebraicos y aritméticos aplicados para cada iteración.</li>
                    <li><strong>Tabla:</strong> Proporciona la tabla de iteraciones clásica con los valores de las variables y errores acumulados.</li>
                    <li><strong>Gráfica:</strong> Un gráfico de Plotly interactivo que te permite acercar (zoom), mover (pan), ver coordenadas al pasar el cursor y descargar la imagen del gráfico.</li>
                  </ul>
                </div>
              </AccordionItem>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AccordionItem({ title, icon: Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="section-card overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[var(--color-surface)] hover:bg-[var(--color-surface-raised)] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-xs sm:text-sm text-[var(--color-text)]">
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-[var(--color-border)]"
          >
            <div className="p-4 bg-[var(--color-surface)]/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
