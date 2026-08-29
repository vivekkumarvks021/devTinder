const User = require("../models/user");
const { AppError } = require("../utils/app-error");

async function updateProfile(userId, input) {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: input,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    throw new AppError(404, "User not found");
  }

  return updatedUser;
}

module.exports = { updateProfile };
