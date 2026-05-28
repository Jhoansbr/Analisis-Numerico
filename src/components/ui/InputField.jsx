/**
 * Campo de entrada reutilizable para formularios de métodos.
 */
export default function InputField({ label, value, onChange, type = 'text', placeholder, hint, mono = false }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-field ${mono ? 'font-mono' : ''}`}
      />
      {hint && <p className="mt-1 text-[10px] text-[var(--color-text-subtle)]">{hint}</p>}
    </div>
  );
}
