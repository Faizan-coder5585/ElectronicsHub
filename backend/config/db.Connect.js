const mongoose = require("mongoose");
require('dotenv').config();

const uri = process.env.DATABASE_URL;
const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;