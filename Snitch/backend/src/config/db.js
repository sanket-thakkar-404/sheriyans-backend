import mongoose from "mongoose";
import config from "./dotenv.config.js";

const connectToDb = async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Stop the application if database connection fails
  }
};

export default connectToDb;