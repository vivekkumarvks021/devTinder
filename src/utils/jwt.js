const jwt = require("jsonwebtoken");

const { AppError } = require("./app-error");

const TOKEN_EXPIRY = "7d";

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwtSecret;
}

function generateToken(userId) {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: TOKEN_EXPIRY,
  });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (typeof decoded === "string" || typeof decoded.userId !== "string") {
      throw new Error("Invalid token payload");
    }

    return decoded;
  } catch {
    throw new AppError(401, "Invalid or expired authentication token");
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
