import mongoose, { connect } from "mongoose";

// FUNCTION TO CONNECT TO MONGODB

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB Connected!");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Connection Error:", err);
    });

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("❌ MongoDB catch error:", error.message);
  }
};

