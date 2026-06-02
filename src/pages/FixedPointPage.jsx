/**
 * Página del método de punto fijo.
 */
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, RefreshCw, CheckCircle2, ListOrdered, Table, LineChart } from 'lucide-react';
import methodsData from '../data/methodsData';
import { solveFixedPoint } from '../methods/fixedPoint';
import { generatePlotData } from '../utils/mathParser';
import TheorySection from '../components/TheorySection';
import StepByStep from '../components/StepByStep';
import IterativeTable from '../components/IterativeTable';
import InteractivePlot from '../components/InteractivePlot';
import ResultCard from '../components/ResultCard';
import ResultsTabs from '../components/ResultsTabs';
import InputField from '../components/ui/InputField';
import AlertBanner from '../components/ui/AlertBanner';
import MethodPageHeader from '../components/MethodPageHeader';
import { parseNumberInput } from '../utils/numberFormat';

const methodInfo = methodsData.find((m) => m.id === 'fixed-point');

const columns = [
  { key: 'iteration', label: 'Iteración' },
  { key: 'xn', label: 'xₙ' },
  { key: 'gx', label: 'g(xₙ)' },
  { key: 'xn1', label: 'xₙ₊₁' },
  { key: 'error', label: 'E_a (%)' },
];

export default function FixedPointPage() {
  const defaults = methodInfo.defaultValues;
  const [gFunc, setGFunc] = useState(defaults.g);
  const [x0, setX0] = useState(defaults.x0);
  const [tol, setTol] = useState(defaults.tol);
  const [maxIter, setMaxIter] = useState(defaults.maxIter);
  const [result, setResult] = useState(null);
  const [plotData, setPlotData] = useState(null);

  const handleSolve = useCallback(() => {
    const tolNum = parseNumberInput(tol);
    const maxIterNum = parseNumberInput(maxIter);
    const res = solveFixedPoint(
      gFunc,
      parseNumberInput(x0),
      Number.isFinite(tolNum) ? tolNum : undefined,
      Number.isFinite(maxIterNum) ? maxIterNum : undefined,
    );
    setResult(res);

    if (res.iterations.length > 0) {
      const plotExpr = res.gFuncUsed ?? gFunc;
      const allX = res.iterations.flatMap((it) => [it.xn, it.xn1]);
      const minX = Math.min(...allX) - 2;
      const maxX = Math.max(...allX) + 2;
      const plot = generatePlotData(plotExpr, minX, maxX);
      setPlotData([
        { x: plot.xValues, y: plot.yValues, type: 'scatter', mode: 'lines', name: 'g(x)', line: { color: '#f43f5e', width: 2 } },
        { x: res.iterations.map((it) => it.xn1), y: res.iterations.map((it) => it.xn1), type: 'scatter', mode: 'markers', name: 'Iteraciones (x, g(x))', marker: { color: '#38bdf8', size: 8 } },
      ]);
    } else {
      setPlotData(null);
    }
  }, [gFunc, x0, tol, maxIter]);

  const handleReset = () => {
    setGFunc(defaults.g);
    setX0(defaults.x0);
    setTol(defaults.tol);
    setMaxIter(defaults.maxIter);
    setResult(null);
    setPlotData(null);
  };

  return (
    <div className="page-shell max-w-5xl space-y-5 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <MethodPageHeader methodInfo={methodInfo} />
      </motion.div>

      <TheorySection theory={methodInfo.theory} />

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-card p-6">
        <h2 className="text-lg font-display font-semibold mb-5">Datos del problema</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField label="f(x)=0 o g(x)" value={gFunc} onChange={setGFunc} mono />
          <InputField label="Valor inicial x₀" value={x0} onChange={setX0} type="number" />
          <InputField label="Tolerancia (%)" value={tol} onChange={setTol} type="number" />
          <InputField label="Número de iteraciones" value={maxIter} onChange={setMaxIter} type="number" />
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

      {result && !result.converged && (
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
              content: (
                <div className="p-5 space-y-3">
                  {result.conversionNote && (
                    <p className="text-sm text-[var(--color-text-muted)]">{result.conversionNote}</p>
                  )}
                  <ResultCard result={result} />
                </div>
              ),
            },
            {
              id: 'steps',
              label: 'Paso a paso',
              icon: ListOrdered,
              content: (
                <div className="p-5">
                  <StepByStep steps={result.iterations} methodType="fixed-point" embedded />
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
                <InteractivePlot data={plotData} title="Método de punto fijo" embedded />
              ) : null,
            },
          ]}
        />
      )}
    </div>
  );
}
