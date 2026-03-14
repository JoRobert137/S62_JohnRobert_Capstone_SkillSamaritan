const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 400
      ? "Bad request"
      : statusCode === 401
        ? "Unauthorized"
        : "Server error";

  return res.status(statusCode).json({ message });
};

module.exports = errorHandler;
