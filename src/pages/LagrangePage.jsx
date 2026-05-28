/**
 * Página de interpolación de Lagrange.
 */
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Spline, Plus, Trash2, CheckCircle2, ListOrdered, Table, LineChart } from 'lucide-react';
import methodsData from '../data/methodsData';
import { solveLagrange, generateLagrangePlotData } from '../methods/lagrange';
import TheorySection from '../components/TheorySection';
import StepByStep from '../components/StepByStep';
import InteractivePlot from '../components/InteractivePlot';
import ResultsTabs from '../components/ResultsTabs';
import MathFormula from '../components/MathFormula';
import { formatNumber } from '../utils/numberFormat';

const methodInfo = methodsData.find((m) => m.id === 'lagrange');

function LagrangeResult({ result }) {
  if (result.result === null) return null;
  return (
    <div className="animated-border">
      <div className="p-6 rounded-[13px] bg-gradient-to-br from-emerald-500/10 to-sky-500/5">
        <h3 className="text-lg font-display font-semibold mb-4">Valor interpolado</h3>
        <div className="text-center py-2">
          <MathFormula tex={`P(${formatNumber(result.xEval)}) = ${formatNumber(result.result)}`} block />
        </div>
        <p className="text-sm text-[var(--color-text-muted)] text-center mt-4">
          Polinomio construido a partir de {result.points.length} puntos.
        </p>
      </div>
    </div>
  );
}

function DataTable({ points }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80">
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase">i</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase">xᵢ</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase">yᵢ</th>
          </tr>
        </thead>
        <tbody>
          {points.map((pt, i) => (
            <tr key={i} className="border-b border-[var(--color-border)]/50 hover:bg-white/[0.02]">
              <td className="px-4 py-3 font-mono text-xs text-sky-400">{i}</td>
              <td className="px-4 py-3 font-mono text-xs">{formatNumber(pt.x)}</td>
              <td className="px-4 py-3 font-mono text-xs">{formatNumber(pt.y)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LagrangePage() {
  const defaults = methodInfo.defaultValues;
  const [points, setPoints] = useState([...defaults.points]);
  const [xEval, setXEval] = useState(defaults.xEval);
  const [result, setResult] = useState(null);
  const [plotData, setPlotData] = useState(null);

  const addPoint = () => {
    const lastX = points.length > 0 ? points[points.length - 1].x + 1 : 0;
    setPoints([...points, { x: lastX, y: 0 }]);
  };

  const removePoint = (idx) => {
    if (points.length <= 2) return;
    setPoints(points.filter((_, i) => i !== idx));
  };

  const updatePoint = (idx, field, value) => {
    const next = [...points];
    next[idx] = { ...next[idx], [field]: Number(value) };
    setPoints(next);
  };

  const handleSolve = useCallback(() => {
    const res = solveLagrange(points, Number(xEval));
    setResult(res);

    const xs = points.map((p) => p.x);
    const minX = Math.min(...xs) - 1;
    const maxX = Math.max(...xs) + 1;
    const curve = generateLagrangePlotData(points, minX, maxX);

    const traces = [
      { x: curve.xValues, y: curve.yValues, type: 'scatter', mode: 'lines', name: 'P(x)', line: { color: '#34d399', width: 2 } },
      { x: points.map((p) => p.x), y: points.map((p) => p.y), type: 'scatter', mode: 'markers', name: 'Puntos', marker: { color: '#38bdf8', size: 10 } },
    ];

    if (res.result !== null) {
      traces.push({
        x: [Number(xEval)],
        y: [res.result],
        type: 'scatter',
        mode: 'markers',
        name: `P(${xEval})`,
        marker: { color: '#fbbf24', size: 12, symbol: 'star' },
      });
    }

    setPlotData(traces);
  }, [points, xEval]);

  const handleReset = () => {
    setPoints([...defaults.points]);
    setXEval(defaults.xEval);
    setResult(null);
    setPlotData(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${methodInfo.color} flex items-center justify-center shadow-lg`}>
          <Spline className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">{methodInfo.name}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{methodInfo.shortDesc}</p>
        </div>
      </motion.header>

      <TheorySection theory={methodInfo.theory} />

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-card p-6">
        <h2 className="text-lg font-display font-semibold mb-1">Puntos de datos</h2>
        <p className="text-xs text-[var(--color-text-subtle)] mb-5">Mínimo dos puntos con abscisas distintas.</p>
        <div className="space-y-3">
          {points.map((pt, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--color-text-subtle)] w-8">P{idx}</span>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-[var(--color-text-subtle)] mb-1">x</label>
                  <input
                    type="number"
                    value={pt.x}
                    onChange={(e) => updatePoint(idx, 'x', e.target.value)}
                    className="input-field font-mono py-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[var(--color-text-subtle)] mb-1">y</label>
                  <input
                    type="number"
                    value={pt.y}
                    onChange={(e) => updatePoint(idx, 'y', e.target.value)}
                    className="input-field font-mono py-2"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removePoint(idx)}
                disabled={points.length <= 2}
                className="p-2 rounded-lg hover:bg-rose-500/10 text-[var(--color-text-subtle)] hover:text-rose-400 transition-colors disabled:opacity-30"
                aria-label="Eliminar punto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPoint}
          className="mt-3 btn-secondary text-xs py-2"
        >
          <Plus className="w-3.5 h-3.5" /> Agregar punto
        </button>

        <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
          <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Evaluar P(x) en</label>
          <input
            type="number"
            value={xEval}
            onChange={(e) => setXEval(e.target.value)}
            className="input-field max-w-xs font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button type="button" onClick={handleSolve} className="btn-primary">
            <Play className="w-4 h-4" /> Interpolar
          </button>
          <button type="button" onClick={handleReset} className="btn-secondary">
            <RotateCcw className="w-4 h-4" /> Reiniciar
          </button>
        </div>
      </motion.section>

      {result && (
        <ResultsTabs
          defaultTab="result"
          tabs={[
            {
              id: 'result',
              label: 'Resultado',
              icon: CheckCircle2,
              content: (
                <div className="p-5">
                  <LagrangeResult result={result} />
                </div>
              ),
            },
            {
              id: 'steps',
              label: 'Paso a paso',
              icon: ListOrdered,
              content: (
                <div className="p-5">
                  <StepByStep steps={result.steps} methodType="lagrange" embedded />
                </div>
              ),
            },
            {
              id: 'table',
              label: 'Tabla',
              icon: Table,
              content: <DataTable points={result.points} />,
            },
            {
              id: 'chart',
              label: 'Gráfica',
              icon: LineChart,
              content: plotData ? (
                <InteractivePlot data={plotData} title="Lagrange" yTitle="P(x)" embedded />
              ) : null,
            },
          ]}
        />
      )}
    </div>
  );
}
