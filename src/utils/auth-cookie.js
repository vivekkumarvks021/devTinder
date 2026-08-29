const AUTH_COOKIE_NAME = "authToken";

function getAuthCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
}

function setAuthCookie(response, token) {
  response.cookie(AUTH_COOKIE_NAME, token, {
    ...getAuthCookieOptions(),
    maxAge: SEVEN_DAYS_IN_MILLISECONDS,
  });
}

function clearAuthCookie(response) {
  response.clearCookie(AUTH_COOKIE_NAME, getAuthCookieOptions());
}

module.exports = {
  AUTH_COOKIE_NAME,
  setAuthCookie,
  clearAuthCookie,
};
