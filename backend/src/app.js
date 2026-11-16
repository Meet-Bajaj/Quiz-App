
const express = require("express");
const cors = require("cors");
const sessionMiddleware = require("./config/session");

const authRoutes = require("./routes/auth");
const quizzes = require("./routes/quizzes");
const participant = require("./routes/participant");
const settingsRoutes = require("./routes/settings");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(sessionMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizzes);
app.use("/api/participant", participant);
app.use("/api/settings", settingsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    backend: true,
    corsAllowed: allowedOrigins,
    message: "Backend is running properly.",
  });
});

module.exports = app;
