const { signupUser, loginUser } = require("../services/auth.service");
const { setAuthCookie, clearAuthCookie } = require("../utils/auth-cookie.js");
const { generateToken } = require("../utils/jwt.js");

async function signup(request, response, next) {
  try {
    const user = await signupUser(request.body);

    const token = generateToken(user._id.toString());
    setAuthCookie(response, token);

    return response.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(request, response, next) {
  try {
    const user = await loginUser(request.body);

    const token = generateToken(user._id.toString());
    setAuthCookie(response, token);

    response.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

function getCurrentUser(request, response) {
  return response.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: {
      user: request.user,
    },
  });
}

function logout(_request, response) {
  clearAuthCookie(response);

  response.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

module.exports = { signup, login, getCurrentUser, logout };
