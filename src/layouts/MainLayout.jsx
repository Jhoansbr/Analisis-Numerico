/**
 * Layout principal con barra lateral y navegación.
 */
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Menu, X, GitBranch, Target, TrendingDown, RefreshCw, Spline, AreaChart, Sigma, Info } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Inicio', icon: Home },
  { path: '/bisection', label: 'Bisección', icon: GitBranch },
  { path: '/newton', label: 'Newton-Raphson', icon: Target },
  { path: '/secant', label: 'Secante', icon: TrendingDown },
  { path: '/fixed-point', label: 'Punto fijo', icon: RefreshCw },
  { path: '/lagrange', label: 'Lagrange', icon: Spline },
  { path: '/simpson38', label: 'Simpson 3/8', icon: AreaChart },
  { path: '/about', label: 'Acerca de', icon: Info },
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)]/92 backdrop-blur-md fixed h-full z-30">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 28 }}
              className="fixed inset-y-0 left-0 w-64 bg-[var(--color-surface)]/95 border-r border-[var(--color-border)] z-50 lg:hidden"
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 h-16 border-b border-[var(--color-border)] bg-[var(--color-bg)]/75 backdrop-blur-md flex items-center px-4 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/[0.05] mr-2"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5 text-[var(--color-text-muted)]" />
          </button>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] truncate min-w-0">
            {getCurrentPageName(location.pathname)}
          </p>
        </header>

        <main className="flex-1 p-3 sm:p-5 lg:p-6 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>

        <footer className="border-t border-[var(--color-border)] px-4 py-4 text-center">
          <p className="text-xs text-[var(--color-text-subtle)]">
            NumLab · Métodos numéricos · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}

function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            <Sigma className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--color-text)] font-display">NumLab</p>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.05] lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        <p className="text-[10px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-widest px-3 py-2">
          Métodos
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/25'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-black/[0.03] border border-transparent'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

    </div>
  );
}

function getCurrentPageName(pathname) {
  const map = {
    '/': 'Inicio',
    '/bisection': 'Método de bisección',
    '/newton': 'Newton-Raphson',
    '/secant': 'Método de la secante',
    '/fixed-point': 'Método de punto fijo',
    '/lagrange': 'Interpolación de Lagrange',
    '/simpson38': 'Regla de Simpson 3/8',
    '/about': 'Acerca de',
  };
  return map[pathname] || 'NumLab';
}
