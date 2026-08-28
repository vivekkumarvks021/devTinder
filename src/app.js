const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello from Home Route");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
