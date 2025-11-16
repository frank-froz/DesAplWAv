const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export const recordFailedAttempt = (identifier: string) => {
  const now = Date.now();
  const attempt = failedAttempts.get(identifier);

  if (attempt) {
    if (now - attempt.lastAttempt > LOCKOUT_TIME) {
      // Reset after lockout time
      failedAttempts.set(identifier, { count: 1, lastAttempt: now });
    } else {
      attempt.count += 1;
      attempt.lastAttempt = now;
    }
  } else {
    failedAttempts.set(identifier, { count: 1, lastAttempt: now });
  }
};

export const isLockedOut = (identifier: string): boolean => {
  const attempt = failedAttempts.get(identifier);
  if (!attempt) return false;

  const now = Date.now();
  if (attempt.count >= MAX_ATTEMPTS && now - attempt.lastAttempt < LOCKOUT_TIME) {
    return true;
  }

  // Reset if lockout time has passed
  if (now - attempt.lastAttempt > LOCKOUT_TIME) {
    failedAttempts.delete(identifier);
    return false;
  }

  return false;
};

export const getRemainingLockoutTime = (identifier: string): number => {
  const attempt = failedAttempts.get(identifier);
  if (!attempt || attempt.count < MAX_ATTEMPTS) return 0;

  const now = Date.now();
  const elapsed = now - attempt.lastAttempt;
  const remaining = LOCKOUT_TIME - elapsed;

  return remaining > 0 ? Math.ceil(remaining / 60000) : 0; // Retorna minutos
};

export const resetAttempts = (identifier: string) => {
  failedAttempts.delete(identifier);
};