const express = require("express");

const {
  editProfile,
  viewProfile,
} = require("../controllers/profile.controller");

const { requireAuth } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");

const { updateProfileSchema } = require("../validations/profile.validation");

const profileRouter = express.Router();

profileRouter.get("/view", requireAuth, viewProfile);

profileRouter.patch(
  "/edit",
  requireAuth,
  validate(updateProfileSchema),
  editProfile,
);

module.exports = profileRouter;
