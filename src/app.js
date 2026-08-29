const express = require("express");
const authRouter = require("./routes/auth.routes");
const { errorHandler } = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const profileRouter = require("./routes/profile.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Health-check route
app.get("/", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "DevTinder API is running",
  });
});

// Auth routes
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

// Error middleware always routes ke baad
app.use(errorHandler);

module.exports = app;
