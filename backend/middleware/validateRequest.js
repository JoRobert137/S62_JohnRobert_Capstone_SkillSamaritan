const validateRequest = (validator) => {
  return (req, res, next) => {
    if (typeof validator !== "function") {
      return next();
    }

    const validationResult = validator(req);

    if (!validationResult || validationResult.isValid !== false) {
      return next();
    }

    const statusCode = validationResult.error?.statusCode || 400;
    const message = validationResult.error?.message || "Bad request";

    return res.status(statusCode).json({ message });
  };
};

module.exports = validateRequest;
