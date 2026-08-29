const { updateProfile } = require("../services/profile.service");
const { AppError } = require("../utils/app-error");

function viewProfile(request, response, next) {
  if (!request.user) {
    return next(new AppError(401, "Authentication required"));
  }

  return response.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: {
      user: request.user,
    },
  });
}

async function editProfile(request, response, next) {
  try {
    if (!request.user) {
      throw new AppError(401, "Authentication required");
    }

    const updatedUser = await updateProfile(
      request.user._id.toString(),
      request.body,
    );

    return response.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  viewProfile,
  editProfile,
};
