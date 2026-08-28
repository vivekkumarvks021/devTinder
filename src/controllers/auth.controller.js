const { signupUser } = require("../services/auth.service");

async function signup(request, response, next) {
  try {
    const user = await signupUser(request.body);

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

module.exports = { signup };
