/**
 * Página del método Newton-Raphson.
 */
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Target, CheckCircle2, ListOrdered, Table, LineChart } from 'lucide-react';
import methodsData from '../data/methodsData';
import { solveNewton } from '../methods/newton';
import { generatePlotData } from '../utils/mathParser';
import TheorySection from '../components/TheorySection';
import StepByStep from '../components/StepByStep';
import IterativeTable from '../components/IterativeTable';
import InteractivePlot from '../components/InteractivePlot';
import ResultCard from '../components/ResultCard';
import ResultsTabs from '../components/ResultsTabs';
import InputField from '../components/ui/InputField';
import AlertBanner from '../components/ui/AlertBanner';
import MathFormula from '../components/MathFormula';

const methodInfo = methodsData.find((m) => m.id === 'newton');

const columns = [
  { key: 'iteration', label: 'Iteración' },
  { key: 'xn', label: 'xₙ' },
  { key: 'fxn', label: 'f(xₙ)' },
  { key: 'fpxn', label: "f′(xₙ)" },
  { key: 'xn1', label: 'xₙ₊₁' },
  { key: 'error', label: 'Error (%)' },
];

export default function NewtonPage() {
  const defaults = methodInfo.defaultValues;
  const [func, setFunc] = useState(defaults.func);
  const [x0, setX0] = useState(defaults.x0);
  const [tol, setTol] = useState(defaults.tol);
  const [maxIter, setMaxIter] = useState(defaults.maxIter);
  const [result, setResult] = useState(null);
  const [plotData, setPlotData] = useState(null);

  const handleSolve = useCallback(() => {
    const res = solveNewton(func, Number(x0), Number(tol), Number(maxIter));
    setResult(res);

    if (res.iterations.length > 0) {
      const allX = res.iterations.flatMap((it) => [it.xn, it.xn1]);
      const minX = Math.min(...allX) - 2;
      const maxX = Math.max(...allX) + 2;
      const plot = generatePlotData(func, minX, maxX);
      setPlotData([
        { x: plot.xValues, y: plot.yValues, type: 'scatter', mode: 'lines', name: 'f(x)', line: { color: '#a78bfa', width: 2 } },
        { x: res.iterations.map((it) => it.xn1), y: res.iterations.map(() => 0), type: 'scatter', mode: 'markers', name: 'Aproximaciones', marker: { color: '#38bdf8', size: 9 } },
        { x: [plot.xValues[0], plot.xValues.at(-1)], y: [0, 0], type: 'scatter', mode: 'lines', line: { color: 'rgba(255,255,255,0.15)', dash: 'dash', width: 1 }, showlegend: false },
      ]);
    } else {
      setPlotData(null);
    }
  }, [func, x0, tol, maxIter]);

  const handleReset = () => {
    setFunc(defaults.func);
    setX0(defaults.x0);
    setTol(defaults.tol);
    setMaxIter(defaults.maxIter);
    setResult(null);
    setPlotData(null);
  };

  const resultTabContent = (
    <div className="p-5 space-y-4">
      {result?.derivativeStr && (
        <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)] mb-2">Derivada de la función</p>
          <MathFormula tex={`f'(x) = ${result.derivativeStr}`} block />
        </div>
      )}
      <ResultCard result={result} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${methodInfo.color} flex items-center justify-center shadow-lg`}>
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">{methodInfo.name}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{methodInfo.shortDesc}</p>
        </div>
      </motion.header>

      <TheorySection theory={methodInfo.theory} />

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-card p-6">
        <h2 className="text-lg font-display font-semibold mb-1">Datos del problema</h2>
        <p className="text-xs text-[var(--color-text-subtle)] mb-5">Indica f(x) y una estimación inicial cercana a la raíz.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField label="Función f(x)" value={func} onChange={setFunc} placeholder="x^3 - 4*x - 9" mono hint="Usa ^ para potencias y * para multiplicar" />
          <InputField label="Valor inicial x₀" value={x0} onChange={setX0} type="number" placeholder="2.5" />
          <InputField label="Tolerancia (%)" value={tol} onChange={setTol} type="number" placeholder="0.001" />
          <InputField label="Máximo de iteraciones" value={maxIter} onChange={setMaxIter} type="number" placeholder="50" />
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <button type="button" onClick={handleSolve} className="btn-primary">
            <Play className="w-4 h-4" /> Calcular
          </button>
          <button type="button" onClick={handleReset} className="btn-secondary">
            <RotateCcw className="w-4 h-4" /> Reiniciar
          </button>
        </div>
      </motion.section>

      {result && !result.converged && result.iterations.length === 0 && (
        <AlertBanner variant="warning">{result.message}</AlertBanner>
      )}

      {result && (result.iterations.length > 0 || result.converged) && (
        <ResultsTabs
          defaultTab="result"
          tabs={[
            { id: 'result', label: 'Resultado', icon: CheckCircle2, content: resultTabContent },
            {
              id: 'steps',
              label: 'Paso a paso',
              icon: ListOrdered,
              content: (
                <div className="p-5">
                  <StepByStep steps={result.iterations} methodType="newton" embedded />
                </div>
              ),
            },
            {
              id: 'table',
              label: 'Tabla',
              icon: Table,
              content: <IterativeTable columns={columns} data={result.iterations} embedded />,
            },
            {
              id: 'chart',
              label: 'Gráfica',
              icon: LineChart,
              content: plotData ? (
                <InteractivePlot data={plotData} title="Newton-Raphson" embedded />
              ) : (
                <p className="p-6 text-sm text-[var(--color-text-muted)]">No hay datos para graficar.</p>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
