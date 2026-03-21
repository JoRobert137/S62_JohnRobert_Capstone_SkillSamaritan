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
      enum: ["open", "accepted", "pending_verification", "completed"],
      default: "open",
    },
    completedAt: {
      type: Date,
      default: null,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ createdBy: 1, createdAt: -1 });
taskSchema.index({ acceptedBy: 1, status: 1 });

// Prevent creator from accepting their own task
taskSchema.pre("save", function (next) {
  if (this.acceptedBy && this.createdBy.equals(this.acceptedBy)) {
    return next(new Error("Task creator cannot accept their own task"));
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);