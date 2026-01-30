const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://sanket_thakkar:10mmIMvNqUwnENjk@cluster0.ujlxv8u.mongodb.net/day-5');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // app crash if DB fails
  }
};

module.exports = connectDB;