import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectToDatabase() {
  if (mongoose.connections[0].readyState) {
    // If already connected, return
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    console.log("Error while connecting to DB: ", err);
    throw new Error("Failed to connect with DB");
  }
}
