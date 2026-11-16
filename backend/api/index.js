require("dotenv").config();

const connectDB = require("../src/config/db");
const app = require("../src/app");

// Kick off the connection on cold start; per-request handler awaits it.
connectDB().catch(() => {
  // Error is logged inside connectDB; the handler retries per request.
});

module.exports = async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    if (!res.headersSent) {
      res.status(503).json({ message: "Service temporarily unavailable" });
    }
    return;
  }
  return app(req, res);
};
