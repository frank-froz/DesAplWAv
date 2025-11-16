import validator from 'validator';

// Sanitización simple de inputs del usuario
export function sanitizeEmail(email: string): string {
  return validator.normalizeEmail(email) || '';
}

export function sanitizeString(input: string): string {
  // Escapar caracteres HTML peligrosos
  return validator.escape(input.trim());
}

export function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}
