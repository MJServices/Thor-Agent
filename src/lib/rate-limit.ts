// In-memory rate limiting utility
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configurations
const RATE_LIMITS = {
  chat: { limit: 20, windowMs: 60 * 1000 }, // 20 requests per minute
  image: { limit: 5, windowMs: 60 * 1000 }, // 5 requests per minute
  admin: { limit: 100, windowMs: 60 * 1000 }, // 100 requests per minute
};

export async function checkRateLimit(
  identifier: string,
  endpoint: string
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const config = RATE_LIMITS[endpoint as keyof typeof RATE_LIMITS];
  if (!config) {
    // If no config found, allow the request
    return { allowed: true, remaining: Infinity, resetAt: new Date() };
  }

  const key = `${identifier}:${endpoint}`;
  const now = Date.now();
  const windowMs = config.windowMs;
  const limit = config.limit;

  const record = rateLimitStore.get(key);

  // If no record exists or the window has expired, create a new one
  if (!record || record.resetTime < now) {
    const newRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, newRecord);
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: new Date(newRecord.resetTime),
    };
  }

  // If the limit has been reached, deny the request
  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(record.resetTime),
    };
  }

  // Increment the count and allow the request
  record.count++;
  rateLimitStore.set(key, record);
  return {
    allowed: true,
    remaining: limit - record.count,
    resetAt: new Date(record.resetTime),
  };
}

// Clean up expired entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, record] of entries) {
    if (record.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Run cleanup every minute

export function resetRateLimit(identifier: string, endpoint: string) {
  const key = `${identifier}:${endpoint}`;
  rateLimitStore.delete(key);
}

export { RATE_LIMITS };
