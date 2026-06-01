/**
 * Página del método de bisección.
 */
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, GitBranch, CheckCircle2, ListOrdered, Table, LineChart } from 'lucide-react';
import methodsData from '../data/methodsData';
import { solveBisection } from '../methods/bisection';
import { generatePlotData } from '../utils/mathParser';
import { parseNumberInput } from '../utils/numberFormat';
import TheorySection from '../components/TheorySection';
import StepByStep from '../components/StepByStep';
import IterativeTable from '../components/IterativeTable';
import InteractivePlot from '../components/InteractivePlot';
import ResultCard from '../components/ResultCard';
import ResultsTabs from '../components/ResultsTabs';
import InputField from '../components/ui/InputField';
import AlertBanner from '../components/ui/AlertBanner';

const methodInfo = methodsData.find((m) => m.id === 'bisection');

const columns = [
  { key: 'iteration', label: 'Iteración' },
  { key: 'a', label: 'a' },
  { key: 'b', label: 'b' },
  { key: 'xr', label: 'xᵣ' },
  { key: 'fxr', label: 'f(xᵣ)' },
  { key: 'error', label: 'ε = |xᵣ−xᵣ₋₁|/2' },
  { key: 'assignment', label: 'Actualización' },
];

export default function BisectionPage() {
  const defaults = methodInfo.defaultValues;
  const [func, setFunc] = useState(defaults.func);
  const [a, setA] = useState(defaults.a);
  const [b, setB] = useState(defaults.b);
  const [stopMode, setStopMode] = useState(defaults.stopMode);
  const [tol, setTol] = useState(defaults.tol);
  const [maxIter, setMaxIter] = useState(defaults.maxIter);
  const [result, setResult] = useState(null);
  const [plotData, setPlotData] = useState(null);

  const handleSolve = useCallback(() => {
    const aNum = parseNumberInput(a);
    const bNum = parseNumberInput(b);
    const maxIterNum = parseNumberInput(maxIter);
    const tolNum = parseNumberInput(tol);

    const res = solveBisection(
      func,
      aNum,
      bNum,
      stopMode === 'tolerance'
        ? { stopMode, tol: tolNum }
        : { stopMode, maxIter: maxIterNum },
    );
    setResult(res);

    if (res.iterations.length > 0 && Number.isFinite(aNum) && Number.isFinite(bNum)) {
      const margin = (bNum - aNum) * 0.5;
      const plot = generatePlotData(func, aNum - margin, bNum + margin);
      const approxPoints = res.iterations.map((it) => ({ x: it.xr, y: it.fxr }));
      setPlotData([
        { x: plot.xValues, y: plot.yValues, type: 'scatter', mode: 'lines', name: 'f(x)', line: { color: '#38bdf8', width: 2 } },
        { x: approxPoints.map((p) => p.x), y: approxPoints.map((p) => p.y), type: 'scatter', mode: 'markers', name: 'Aproximaciones', marker: { color: '#fbbf24', size: 9, symbol: 'diamond' } },
        { x: [plot.xValues[0], plot.xValues[plot.xValues.length - 1]], y: [0, 0], type: 'scatter', mode: 'lines', line: { color: 'rgba(255,255,255,0.15)', dash: 'dash', width: 1 }, showlegend: false },
      ]);
    } else {
      setPlotData(null);
    }
  }, [func, a, b, stopMode, tol, maxIter]);

  const handleReset = () => {
    setFunc(defaults.func);
    setA(defaults.a);
    setB(defaults.b);
    setStopMode(defaults.stopMode);
    setTol(defaults.tol);
    setMaxIter(defaults.maxIter);
    setResult(null);
    setPlotData(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${methodInfo.color} flex items-center justify-center shadow-lg`}>
          <GitBranch className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">{methodInfo.name}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{methodInfo.shortDesc}</p>
        </div>
      </motion.header>

      <TheorySection theory={methodInfo.theory} />

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-card p-6">
        <h2 className="text-lg font-display font-semibold mb-5">Datos del problema</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField label="Función f(x)" value={func} onChange={setFunc} mono />
          <InputField label="Límite a" value={a} onChange={setA} type="number" />
          <InputField label="Límite b" value={b} onChange={setB} type="number" />
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => setStopMode('tolerance')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                stopMode === 'tolerance'
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-white/[0.03]'
              }`}
            >
              Por tolerancia ε
            </button>
            <button
              type="button"
              onClick={() => setStopMode('iterations')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                stopMode === 'iterations'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-white/[0.03]'
              }`}
            >
              Por número de iteraciones
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stopMode === 'tolerance' ? (
              <InputField label="Tolerancia ε" value={tol} onChange={setTol} type="number" />
            ) : (
              <InputField label="Número de iteraciones" value={maxIter} onChange={setMaxIter} type="number" />
            )}
          </div>
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
            {
              id: 'result',
              label: 'Resultado',
              icon: CheckCircle2,
              content: <ResultCard result={result} errorFormat="absolute" />,
            },
            {
              id: 'steps',
              label: 'Paso a paso',
              icon: ListOrdered,
              content: (
                <div className="p-5">
                  <StepByStep steps={result.iterations} methodType="bisection" embedded errorFormat="absolute" />
                </div>
              ),
            },
            {
              id: 'table',
              label: 'Tabla',
              icon: Table,
              content: <IterativeTable columns={columns} data={result.iterations} embedded errorFormat="absolute" />,
            },
            {
              id: 'chart',
              label: 'Gráfica',
              icon: LineChart,
              content: plotData ? (
                <InteractivePlot data={plotData} title="Bisección" embedded />
              ) : null,
            },
          ]}
        />
      )}
    </div>
  );
}
