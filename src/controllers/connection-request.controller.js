const {
  reviewConnectionRequest,
  sendConnectionRequest,
} = require("../services/connection-request.service");

const { AppError } = require("../utils/app-error");

async function sendRequest(request, response, next) {
  try {
    if (!request.user) {
      throw new AppError(401, "Authentication required");
    }

    const connectionRequest = await sendConnectionRequest(
      request.user._id.toString(),
      request.params,
    );

    return response.status(201).json({
      success: true,
      message:
        request.params.status === "interested"
          ? "Interest sent successfully"
          : "Profile ignored successfully",
      data: {
        connectionRequest,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function reviewRequest(request, response, next) {
  try {
    if (!request.user) {
      throw new AppError(401, "Authentication required");
    }

    const connectionRequest = await reviewConnectionRequest(
      request.user._id.toString(),
      request.params,
    );

    return response.status(200).json({
      success: true,
      message:
        request.params.status === "accepted"
          ? "Connection request accepted successfully"
          : "Connection request rejected successfully",
      data: {
        connectionRequest,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendRequest,
  reviewRequest,
};
