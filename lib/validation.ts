// Validazioni minime lato server per i form pubblici.

export function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function nonEmpty(v: unknown, min = 1, max = 5000): v is string {
  return typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
}

// Normalizza e taglia una stringa entro un limite di caratteri.
export function clean(v: unknown, max = 2000): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}
