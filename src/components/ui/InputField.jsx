/**
 * Campo de entrada reutilizable para formularios de métodos.
 */
export default function InputField({ label, value, onChange, type = 'text', mono = false }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input-field ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}
