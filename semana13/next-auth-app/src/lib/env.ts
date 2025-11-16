// Validación simple de variables de entorno
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  
  if (!value) {
    throw new Error(`Variable de entorno faltante: ${key}`);
  }
  
  return value;
}

// Exportar variables validadas
export const env = {
  // NextAuth
  nextAuthUrl: getEnvVar('NEXTAUTH_URL'),
  nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),
  
  // OAuth Providers
  googleClientId: getEnvVar('GOOGLE_CLIENT_ID'),
  googleClientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
  githubClientId: getEnvVar('GITHUB_CLIENT_ID'),
  githubClientSecret: getEnvVar('GITHUB_CLIENT_SECRET'),
  
  // Security Settings
  maxLoginAttempts: parseInt(getEnvVar('MAX_LOGIN_ATTEMPTS', '5')),
  lockoutTimeMinutes: parseInt(getEnvVar('LOCKOUT_TIME_MINUTES', '15')),
  rateLimitRequests: parseInt(getEnvVar('RATE_LIMIT_REQUESTS', '10')),
  rateLimitWindowMinutes: parseInt(getEnvVar('RATE_LIMIT_WINDOW_MINUTES', '1')),
};
