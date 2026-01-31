/**
 * Custom logger middleware - logs HTTP method, URL, and timestamp for each request
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, originalUrl } = req;
  console.log(`[${timestamp}] ${method} ${originalUrl}`);
  next();
};

module.exports = logger;
