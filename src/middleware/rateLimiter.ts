import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,

  standardHeaders: true,
  legacyHeaders: false,

  statusCode: 429,

  skip: (req) => req.path === "/health" || req.path === "/ready",

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});
