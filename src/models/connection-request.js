const mongoose = require("mongoose");

const CONNECTION_STATUSES = ["interested", "ignored", "accepted", "rejected"];

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: CONNECTION_STATUSES,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = {
  ConnectionRequest,
  CONNECTION_STATUSES,
};
