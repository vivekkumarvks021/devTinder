const { ConnectionRequest } = require("../models/connection-request");

const User = require("../models/user");
const { AppError } = require("../utils/app-error");

function isDuplicateKeyError(error) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

async function sendConnectionRequest(fromUserId, input) {
  const { status, toUserId } = input;

  if (fromUserId === toUserId) {
    throw new AppError(400, "You cannot send a connection request to yourself");
  }

  const targetUserExists = await User.exists({
    _id: toUserId,
  });

  if (!targetUserExists) {
    throw new AppError(404, "Target user not found");
  }

  const existingRequest = await ConnectionRequest.findOne({
    $or: [
      {
        fromUserId,
        toUserId,
      },
      {
        fromUserId: toUserId,
        toUserId: fromUserId,
      },
    ],
  });

  if (existingRequest) {
    throw new AppError(
      409,
      "A connection interaction already exists between these users",
    );
  }

  try {
    return await ConnectionRequest.create({
      fromUserId,
      toUserId,
      status,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new AppError(409, "Connection request already exists");
    }

    throw error;
  }
}

async function reviewConnectionRequest(loggedInUserId, input) {
  const { requestId, status } = input;

  const updatedRequest = await ConnectionRequest.findOneAndUpdate(
    {
      _id: requestId,

      // Sirf request receiver review kar sakta hai
      toUserId: loggedInUserId,

      // Sirf pending interested request review hogi
      status: "interested",
    },
    {
      $set: {
        status,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!updatedRequest) {
    throw new AppError(
      404,
      "Connection request not found or not eligible for review",
    );
  }

  return updatedRequest;
}

module.exports = {
  sendConnectionRequest,
  reviewConnectionRequest,
};
