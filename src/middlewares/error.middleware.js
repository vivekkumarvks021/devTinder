const { AppError } = require("../utils/app-error");

function isDuplicateKeyError(error) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

function errorHandler(error, _request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // MongoDB duplicate unique-index error
  if (isDuplicateKeyError(error)) {
    return response.status(409).json({
      success: false,
      message: "Email is already registered",
    });
  }

  console.error(error);

  return response.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

module.exports = { errorHandler };
