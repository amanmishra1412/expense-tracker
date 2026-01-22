const env = require("./env");
const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB Connection Error");
    console.error(error.message);

    process.exit(1);
  }
};
