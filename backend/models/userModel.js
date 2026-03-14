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
    pointsBalance: {
      type: Number,
      default: 100,
      min: [0, "Points balance cannot be negative"],
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

module.exports = mongoose.model("User", userSchema);