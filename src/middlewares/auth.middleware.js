const User = require("../models/user");

const { AUTH_COOKIE_NAME } = require("../utils/auth-cookie");

const { AppError } = require("../utils/app-error");
const { verifyToken } = require("../utils/jwt");

async function requireAuth(request, _response, next) {
  try {
    const token = request.cookies?.[AUTH_COOKIE_NAME];

    if (typeof token !== "string" || !token) {
      throw new AppError(401, "Authentication required");
    }

    const payload = verifyToken(token);

    const user = await User.findById(payload.userId);

    if (!user) {
      throw new AppError(
        401,
        "User associated with this token no longer exists",
      );
    }

    request.user = user;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAuth };
