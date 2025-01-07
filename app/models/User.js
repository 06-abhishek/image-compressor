import mongoose from "mongoose";

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    profilePic: { type: String },
    createdAt: { type: String },
    lastLogin: { type: String }, // Track the last login time
    userUploads: { type: Array }, // All images that user uploaded
    userCompressionData: { type: Array }, // All images that user compressed/downloaded
    lastActive: { type: String }, // Track the last activity time
    activityLogs: [
      {
        action: String, // What action was performed
        timestamp: String, // When the action happened
        details: String, // Optional extra details about the action
      },
    ],
  },
  { timestamps: true }
);

// Create the model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
