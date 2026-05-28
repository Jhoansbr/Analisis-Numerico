/**
 * Renders LaTeX with KaTeX (display / inline).
 */
import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function renderTex(tex, displayMode) {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    strict: 'ignore',
    trust: true,
  });
}

export default function MathFormula({ tex, block = false, className = '' }) {
  const html = useMemo(() => {
    if (!tex?.trim()) return null;
    try {
      return renderTex(tex.trim(), block);
    } catch {
      return null;
    }
  }, [tex, block]);

  if (!html) {
    return (
      <span className={`text-slate-500 text-sm italic ${className}`} role="math">
        Fórmula no disponible
      </span>
    );
  }

  if (block) {
    return (
      <div
        className={`math-block overflow-x-auto py-1 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
        role="math"
      />
    );
  }

  return (
    <span
      className={`math-inline ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      role="math"
    />
  );
}
