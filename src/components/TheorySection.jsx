/**
 * Sección teórica colapsable con fórmulas KaTeX.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, CheckCircle, XCircle, Target, Clock, Video, Play } from 'lucide-react';
import MathFormula from './MathFormula';

export default function TheorySection({ theory }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="section-card overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-500/12 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="text-lg font-display font-semibold">Fundamento teórico</h2>
        </div>
        <ChevronDown className={`w-5 h-5 text-[var(--color-text-subtle)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-[var(--color-border)] pt-5">
              <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Definición</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{theory.definition}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Objetivo</h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{theory.objective}</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Cuándo usarlo</h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{theory.when}</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-sky-500/6 border border-sky-500/20">
                <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-3 text-center">Fórmula principal</h3>
                <MathFormula tex={theory.formula} block />
                {theory.errorFormula && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 text-center">
                      Error relativo
                    </h4>
                    <MathFormula tex={theory.errorFormula} block />
                  </div>
                )}
              </div>

              {theory.advantages && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/6 border border-emerald-500/20">
                    <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">Ventajas</h3>
                    <ul className="space-y-2">
                      {theory.advantages.map((adv, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          {adv}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-500/6 border border-rose-500/20">
                    <h3 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3">Desventajas</h3>
                    <ul className="space-y-2">
                      {theory.disadvantages.map((dis, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                          <XCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                          {dis}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {theory.videos && theory.videos.length > 0 && (
                <div className="p-4 rounded-xl bg-violet-500/6 border border-violet-500/20 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-4 h-4 text-violet-400" />
                    <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Material de apoyo (Videos)</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {theory.videos.map((video, idx) => {
                      const isYouTube = video.type === 'youtube' || !video.type; // fallback for backwards compatibility
                      const linkUrl = isYouTube ? `https://youtu.be/${video.id}` : video.url;
                      
                      return (
                        <a 
                          key={idx}
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-col gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-violet-500/50 hover:bg-violet-500/5 transition-all hover:-translate-y-1 shadow-sm"
                        >
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-violet-950/30 border border-white/5 flex items-center justify-center">
                            {isYouTube ? (
                              <img 
                                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                                alt={video.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                              />
                            ) : (
                              <Video className="w-12 h-12 text-violet-400/30 group-hover:text-violet-400/60 transition-colors duration-300 absolute" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors duration-300">
                              <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                              </div>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-[var(--color-text-secondary)] group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                            {video.title}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
