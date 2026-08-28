const express = require("express");

const { signup } = require("../controllers/auth.controller");
const { validate } = require("../middlewares/validate.middleware");
const { signupSchema } = require("../validations/auth.validation");

const authRouter = express.Router();

console.log("signupSchema:", signupSchema);

authRouter.post("/signup", validate(signupSchema), signup);

module.exports = authRouter;
