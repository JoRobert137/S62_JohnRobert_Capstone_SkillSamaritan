const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    points: {
      type: Number,
      default: 0,
      min: [0, "Points cannot be negative"],
    },
    earnedPoints: {
      type: Number,
      default: 0,
      min: [0, "Earned points cannot be negative"],
    },
    tasksPosted: {
      type: Number,
      default: 0,
      min: [0, "Tasks posted count cannot be negative"],
    },
    tasksCompleted: {
      type: Number,
      default: 0,
      min: [0, "Tasks completed count cannot be negative"],
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ points: -1 });
userSchema.index({ earnedPoints: -1 });

module.exports = mongoose.model("User", userSchema);