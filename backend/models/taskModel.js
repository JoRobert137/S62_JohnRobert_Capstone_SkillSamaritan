const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    skillsRequired: {
      type: [String],
      default: [],
    },

    points: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["open", "accepted", "completed"],
      default: "open",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent creator from accepting their own task
taskSchema.pre("save", function (next) {
  if (this.acceptedBy && this.createdBy.equals(this.acceptedBy)) {
    return next(new Error("Task creator cannot accept their own task"));
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);