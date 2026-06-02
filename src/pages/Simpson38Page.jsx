/**
 * Página de la regla de Simpson 3/8.
 */
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, AreaChart, CheckCircle2, ListOrdered, Table, LineChart } from 'lucide-react';
import methodsData from '../data/methodsData';
import { solveSimpson38 } from '../methods/simpson38';
import { generatePlotData } from '../utils/mathParser';
import TheorySection from '../components/TheorySection';
import StepByStep from '../components/StepByStep';
import IterativeTable from '../components/IterativeTable';
import InteractivePlot from '../components/InteractivePlot';
import ResultsTabs from '../components/ResultsTabs';
import InputField from '../components/ui/InputField';
import AlertBanner from '../components/ui/AlertBanner';
import MethodPageHeader from '../components/MethodPageHeader';
import MathFormula from '../components/MathFormula';
import { formatNumber, formatPercent } from '../utils/numberFormat';

const methodInfo = methodsData.find((m) => m.id === 'simpson38');

const columns = [
  { key: 'iteration', label: 'Iteración' },
  { key: 'n', label: 'n' },
  { key: 'h', label: 'h' },
  { key: 'integral', label: 'Integral I' },
  { key: 'error', label: 'Error (%)' },
];

function Simpson38Result({ result }) {
  if (result.integral === null) return null;

  return (
    <div className={result.converged ? 'animated-border' : ''}>
      <div
        className={`p-4 sm:p-6 rounded-[13px] ${
          result.converged
            ? 'bg-emerald-500/10 border border-emerald-500/20'
            : 'bg-rose-500/10 border border-rose-500/20'
        }`}
      >
        <h3 className="text-lg font-display font-semibold mb-4">
          {result.converged ? 'Integral aproximada' : 'Mejor aproximación obtenida'}
        </h3>
        <div className="text-center py-2">
          <MathFormula tex={`I \\approx ${formatNumber(result.integral)}`} block />
        </div>
        <p className="text-sm text-[var(--color-text-muted)] text-center mt-4 leading-relaxed">
          {result.message}
          {result.finalN != null && (
            <span className="block mt-1 text-[var(--color-text-subtle)]">
              Subintervalos finales: n = {result.finalN}
            </span>
          )}
        </p>
        {result.iterations?.length > 0 && result.iterations[result.iterations.length - 1].error != null && (
          <p className="text-xs text-center mt-3 font-mono text-amber-400/90">
            Error relativo: {formatPercent(result.iterations[result.iterations.length - 1].error)}
          </p>
        )}
      </div>
    </div>
  );
}

function NodesTable({ nodes }) {
  if (!nodes?.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80">
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase">i</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase">xᵢ</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase">f(xᵢ)</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase">cᵢ</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase">cᵢ·f(xᵢ)</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => (
            <tr key={node.i} className="border-b border-[var(--color-border)]/50 hover:bg-white/[0.02]">
              <td className="px-4 py-3 font-mono text-xs text-sky-400">{node.i}</td>
              <td className="px-4 py-3 font-mono text-xs">{formatNumber(node.x)}</td>
              <td className="px-4 py-3 font-mono text-xs">{formatNumber(node.fx)}</td>
              <td className="px-4 py-3 font-mono text-xs text-violet-400">{node.weight}</td>
              <td className="px-4 py-3 font-mono text-xs text-emerald-400">{formatNumber(node.term)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Simpson38Page() {
  const defaults = methodInfo.defaultValues;
  const [func, setFunc] = useState(defaults.func);
  const [a, setA] = useState(defaults.a);
  const [b, setB] = useState(defaults.b);
  const [tol, setTol] = useState(defaults.tol);
  const [maxIter, setMaxIter] = useState(defaults.maxIter);
  const [result, setResult] = useState(null);
  const [plotData, setPlotData] = useState(null);

  const handleSolve = useCallback(() => {
    const res = solveSimpson38(func, Number(a), Number(b), Number(tol), Number(maxIter));
    setResult(res);

    if (res.iterations.length > 0) {
      const aNum = Number(a);
      const bNum = Number(b);
      const margin = (bNum - aNum) * 0.15;
      const plot = generatePlotData(func, aNum - margin, bNum + margin);
      const lastStep = res.iterations[res.iterations.length - 1];

      setPlotData([
        {
          x: plot.xValues,
          y: plot.yValues,
          type: 'scatter',
          mode: 'lines',
          name: 'f(x)',
          line: { color: '#38bdf8', width: 2 },
        },
        {
          x: lastStep.nodes.map((node) => node.x),
          y: lastStep.nodes.map((node) => node.fx),
          type: 'scatter',
          mode: 'markers',
          name: 'Nodos',
          marker: { color: '#fbbf24', size: 9, symbol: 'circle' },
        },
        {
          x: [plot.xValues[0], plot.xValues[plot.xValues.length - 1]],
          y: [0, 0],
          type: 'scatter',
          mode: 'lines',
          line: { color: 'rgba(255,255,255,0.15)', dash: 'dash', width: 1 },
          showlegend: false,
        },
      ]);
    } else {
      setPlotData(null);
    }
  }, [func, a, b, tol, maxIter]);

  const handleReset = () => {
    setFunc(defaults.func);
    setA(defaults.a);
    setB(defaults.b);
    setTol(defaults.tol);
    setMaxIter(defaults.maxIter);
    setResult(null);
    setPlotData(null);
  };

  const lastIteration = result?.iterations?.[result.iterations.length - 1];

  return (
    <div className="page-shell max-w-5xl space-y-5 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <MethodPageHeader methodInfo={methodInfo} />
      </motion.div>

      <TheorySection theory={methodInfo.theory} />

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-card p-6">
        <h2 className="text-lg font-display font-semibold mb-1">Datos del problema</h2>
        <p className="text-xs text-[var(--color-text-subtle)] mb-5">
          Define f(x) y el intervalo [a, b]. El número de subintervalos n crece de 3 en 3 en cada iteración.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField label="Función f(x)" value={func} onChange={setFunc} placeholder="x^2" mono hint="Usa ^ para potencias y * para multiplicar" />
          <InputField label="Límite a" value={a} onChange={setA} type="number" placeholder="0" />
          <InputField label="Límite b" value={b} onChange={setB} type="number" placeholder="1" />
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

      {result && result.iterations.length > 0 && (
        <ResultsTabs
          defaultTab="result"
          tabs={[
            {
              id: 'result',
              label: 'Resultado',
              icon: CheckCircle2,
              content: (
                <div className="p-5">
                  <Simpson38Result result={result} />
                </div>
              ),
            },
            {
              id: 'steps',
              label: 'Paso a paso',
              icon: ListOrdered,
              content: (
                <div className="p-5">
                  <StepByStep steps={result.iterations} methodType="simpson38" embedded />
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
              id: 'nodes',
              label: 'Nodos',
              icon: Table,
              content: lastIteration ? <NodesTable nodes={lastIteration.nodes} /> : null,
            },
            {
              id: 'chart',
              label: 'Gráfica',
              icon: LineChart,
              content: plotData ? (
                <InteractivePlot data={plotData} title="Simpson 3/8" embedded />
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
