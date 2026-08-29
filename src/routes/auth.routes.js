const express = require("express");

const {
  signup,
  login,
  getCurrentUser,
  logout,
} = require("../controllers/auth.controller");
const { validate } = require("../middlewares/validate.middleware");
const { signupSchema, loginSchema } = require("../validations/auth.validation");
const { requireAuth } = require("../middlewares/auth.middleware");

const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signup);

authRouter.post("/login", validate(loginSchema), login);

authRouter.get("/me", requireAuth, getCurrentUser);

authRouter.post("/logout", logout);

module.exports = authRouter;
