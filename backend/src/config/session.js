
const session = require("express-session");
const MongoStore = require("connect-mongo");

const isProduction = process.env.NODE_ENV === "production";
const secret = process.env.SESSION_SECRET;

if (!secret) {
  if (isProduction) {
    throw new Error(
      "SESSION_SECRET is required in production. Set it in your Vercel project environment variables."
    );
  }
  console.warn("SESSION_SECRET not set - using development-only secret.");
}

module.exports = session({
  secret: secret || "development-only-secret",
  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: "projectSessions",
    collectionName: "sessions",
    ttl: 60 * 60 * 24,
    autoRemove: "native",
  }),

  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  },
});
