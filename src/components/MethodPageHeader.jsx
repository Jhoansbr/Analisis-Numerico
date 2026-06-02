/**
 * Encabezado reutilizable en páginas de método.
 */
export default function MethodPageHeader({ methodInfo }) {
  const Icon = methodInfo.icon;
  const bg = methodInfo.colorHex ?? '#2563eb';

  return (
    <header className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
      <div
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
        style={{ backgroundColor: bg }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-display font-bold leading-tight">{methodInfo.name}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 leading-relaxed">{methodInfo.shortDesc}</p>
      </div>
    </header>
  );
}
