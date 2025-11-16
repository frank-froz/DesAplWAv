// Validación de contraseñas con requisitos básicos
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  // Mínimo 8 caracteres
  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres');
  }

  // Al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe incluir al menos una mayúscula');
  }

  // Al menos un número
  if (!/[0-9]/.test(password)) {
    errors.push('Debe incluir al menos un número');
  }

  // Al menos un símbolo
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Debe incluir al menos un símbolo (!@#$%^&*...)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const passwordRequirements = [
  'Mínimo 8 caracteres',
  'Al menos una mayúscula',
  'Al menos un número',
  'Al menos un símbolo (!@#$%^&*...)',
];
