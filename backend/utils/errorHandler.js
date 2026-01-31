/**
 * Centralized error-handling middleware
 * Provides proper HTTP status codes and meaningful JSON error messages
 */
const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error:`, err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    statusCode,
  });
};

module.exports = errorHandler;
