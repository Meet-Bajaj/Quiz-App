const mongoose = require("mongoose");

let connectionPromise = null;

function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        connectionPromise = null;
        console.error("MongoDB connection failed");
        console.error(err.message);
        throw err;
      });
  }

  return connectionPromise;
}

module.exports = connectDB;
