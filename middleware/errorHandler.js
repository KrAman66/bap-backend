module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const payload = {
    error: {
      message: err.message || "Internal Server Error",
      ...(err.details && { details: err.details }),
    },
  };
  if (process.env.NODE_ENV !== "production") {
    payload.error.stack = err.stack;
  }
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);
  res.status(status).json(payload);
};
