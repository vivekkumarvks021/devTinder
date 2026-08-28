require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/database");

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`DevTinder server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
