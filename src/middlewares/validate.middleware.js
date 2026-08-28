function validate(schema) {
  if (!schema) {
    throw new Error(
      "Validation schema is missing. Check schema export/import.",
    );
  }

  return (request, response, next) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      return response.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    request.body = result.data;

    next();
  };
}

module.exports = { validate };
