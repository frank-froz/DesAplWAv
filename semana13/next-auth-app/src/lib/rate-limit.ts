import { env } from './env';

// Rate limiting simple por IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingRequests?: number;
  resetIn?: number;
} {
  const now = Date.now();
  const windowMs = env.rateLimitWindowMinutes * 60 * 1000;
  const maxRequests = env.rateLimitRequests;

  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // Nueva ventana de tiempo
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { 
      allowed: true, 
      remainingRequests: maxRequests - 1 
    };
  }

  if (record.count >= maxRequests) {
    // Límite alcanzado
    const resetIn = Math.ceil((record.resetTime - now) / 1000);
    return { 
      allowed: false, 
      resetIn 
    };
  }

  // Incrementar contador
  record.count++;
  return { 
    allowed: true, 
    remainingRequests: maxRequests - record.count 
  };
}
