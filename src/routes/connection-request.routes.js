const express = require("express");

const {
  reviewRequest,
  sendRequest,
} = require("../controllers/connection-request.controller");

const { requireAuth } = require("../middlewares/auth.middleware");

const { validate } = require("../middlewares/validate.middleware");

const {
  reviewConnectionRequestParamsSchema,
  sendConnectionRequestParamsSchema,
} = require("../validations/connection-request.validation");

const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
  "/send/:status/:toUserId",
  requireAuth,
  validate(sendConnectionRequestParamsSchema, "params"),
  sendRequest,
);

connectionRequestRouter.post(
  "/review/:status/:requestId",
  requireAuth,
  validate(reviewConnectionRequestParamsSchema, "params"),
  reviewRequest,
);

module.exports = connectionRequestRouter;
