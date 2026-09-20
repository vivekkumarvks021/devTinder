const express = require("express");
const { requireAuth } = require("../middlewares/auth.middleware");
const {
  requestReceived,
  connections,
  getFeed,
} = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.get("/requests/received", requireAuth, requestReceived);

userRouter.get("/connections", requireAuth, connections);

userRouter.get("/feed", requireAuth, getFeed);

module.exports = { userRouter };
