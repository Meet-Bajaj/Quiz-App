require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const sessionMiddleware = require("./config/session");

const authRoutes = require("./routes/auth");
const quizzes = require("./routes/quizzes");
const participant = require("./routes/participant");
const settingsRoutes = require("./routes/settings");

const app = express();

// Required behind Vercel's reverse proxy so express-session sees
// X-Forwarded-Proto: https and can issue Secure cookies in production.
app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  console.warn(
    "WARNING: CLIENT_URL is not set. Cross-origin browser requests will be blocked by CORS."
  );
}

const corsOptions = {
  origin(origin, callback) {
    // No Origin header: same-origin, curl, health checks, server-to-server.
    if (!origin) return callback(null, true);

    const normalized = origin.replace(/\/+$/, "");
    if (allowedOrigins.includes(normalized)) return callback(null, true);

    // Not allowed: omit Access-Control-Allow-Origin so the browser blocks cleanly.
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 600,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(sessionMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizzes);
app.use("/api/participant", participant);
app.use("/api/settings", settingsRoutes);

const healthHandler = (req, res) => {
  res.status(200).json({
    status: "OK",
    backend: true,
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    corsAllowed: allowedOrigins,
    message: "Backend is running properly.",
  });
};

app.get("/", healthHandler);
app.get("/api/health", healthHandler);

// JSON 404 instead of Express HTML error page
app.use((req, res) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
