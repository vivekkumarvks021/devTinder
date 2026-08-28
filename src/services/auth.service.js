const bcrypt = require("bcrypt");

const User = require("../models/user");
const { AppError } = require("../utils/app-error");

const PASSWORD_SALT_ROUNDS = 12;

async function signupUser(input) {
  const existingUser = await User.exists({
    email: input.email,
  });

  if (existingUser) {
    throw new AppError(409, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(
    input.password,
    PASSWORD_SALT_ROUNDS,
  );

  const user = await User.create({
    ...input,
    password: hashedPassword,
  });

  const userObject = user.toObject();

  // Password ko API response se remove kar rahe hain.
  const { password, ...safeUser } = userObject;

  return safeUser;
}

module.exports = { signupUser };
