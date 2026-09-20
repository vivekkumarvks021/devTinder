const { ConnectionRequest } = require("../models/connection-request");

const User = require("../models/user");
const { AppError } = require("../utils/app-error");
const USER_SAFE_DATA = "firstName lastName";

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

const getPendingRequests = async (loggedInUserId) => {
  const pendingRequest = await ConnectionRequest.find({
    toUserId: loggedInUserId,
    status: "interested",
  })
    .select(["fromUserId"])
    .populate("fromUserId", "firstName");

  return pendingRequest;
};

const getConnections = async (loggedInUserId) => {
  const connections = await ConnectionRequest.find({
    $or: [{ toUserId: loggedInUserId }, { fromUserId: loggedInUserId }],
    status: "accepted",
  })
    .select("fromUserId toUserId")
    .populate("fromUserId", "firstName")
    .populate("toUserId", "firstName");

  return connections;
};

const getFeeds = async (loggedInUserId, skip, limit) => {
  // find which one to not include
  const alreadyConnected = await ConnectionRequest.find({
    $or: [{ toUserId: loggedInUserId }, { fromUserId: loggedInUserId }],
  }).select("toUserId fromUserId");

  const excludeUserIds = new Set([loggedInUserId.toString()]);

  alreadyConnected.map((request) => {
    excludeUserIds.add(request.toUserId.toString());
    excludeUserIds.add(request.fromUserId.toString());
  });

  const feed = await User.find({
    _id: { $nin: Array.from(excludeUserIds) },
  })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);

  return feed;
};

module.exports = {
  sendConnectionRequest,
  reviewConnectionRequest,
  getPendingRequests,
  getConnections,
  getFeeds,
};
