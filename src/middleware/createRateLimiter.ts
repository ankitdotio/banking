// middleware/createRateLimiter.ts

import rateLimit from 'express-rate-limit'

export function createRateLimiter(windowMs: number, limit: number) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
  })
}
