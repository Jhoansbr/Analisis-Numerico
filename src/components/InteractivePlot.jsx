/**
 * Gráfica interactiva con Plotly.
 */
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LineChart } from 'lucide-react';

export default function InteractivePlot({ data, title = 'Gráfica', xTitle = 'x', yTitle = 'f(x)', embedded = false }) {
  const plotRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0 || !plotRef.current) return;

    import('plotly.js/dist/plotly.js').then((Plotly) => {
      const plotlyLib = Plotly.default || Plotly;

      const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(12, 18, 32, 0.9)',
        font: { family: 'DM Sans, sans-serif', color: '#94a3b8', size: 12 },
        title: { text: title, font: { size: 15, color: '#e2e8f0', family: 'Source Serif 4, serif' }, x: 0.05 },
        xaxis: {
          title: xTitle,
          gridcolor: 'rgba(255,255,255,0.05)',
          zerolinecolor: 'rgba(255,255,255,0.12)',
          tickfont: { size: 11 },
          linecolor: 'rgba(255,255,255,0.1)',
        },
        yaxis: {
          title: yTitle,
          gridcolor: 'rgba(255,255,255,0.05)',
          zerolinecolor: 'rgba(255,255,255,0.12)',
          tickfont: { size: 11 },
          linecolor: 'rgba(255,255,255,0.1)',
        },
        margin: { l: 56, r: 24, t: 48, b: 48 },
        hovermode: 'closest',
        showlegend: data.length > 1,
        legend: { bgcolor: 'rgba(0,0,0,0)', font: { color: '#94a3b8' } },
        autosize: true,
      };

      plotlyLib.newPlot(plotRef.current, data, layout, {
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        displaylogo: false,
        responsive: true,
      });
    });

    return () => {
      if (plotRef.current) {
        import('plotly.js/dist/plotly.js').then((Plotly) => {
          const plotlyLib = Plotly.default || Plotly;
          plotlyLib.purge(plotRef.current);
        });
      }
    };
  }, [data, title, xTitle, yTitle]);

  if (!data || data.length === 0) return null;

  const chart = <div ref={plotRef} className="w-full" style={{ height: '400px' }} />;

  if (embedded) {
    return <div className="p-4">{chart}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="section-card overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-[var(--color-border)]">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/12 flex items-center justify-center">
          <LineChart className="w-5 h-5 text-emerald-400" />
        </div>
        <h2 className="text-lg font-display font-semibold">Gráfica</h2>
      </div>
      <div className="p-4">{chart}</div>
    </motion.div>
  );
}
