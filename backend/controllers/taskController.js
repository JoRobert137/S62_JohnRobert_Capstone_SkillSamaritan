const Task = require("../models/taskModel");
const User = require("../models/userModel");
const {
  validateCreation,
  validateAcceptance,
  validateCompletion,
  getValidTransitions,
} = require("../utils/taskValidation");
const {
  canUserPerformAction,
  hasSufficientPoints,
  isTaskCreator,
  isTaskHelper,
  formatAuthorizationError,
  formatPointsError,
  getTaskStatusDescription,
} = require("../utils/taskHelpers");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, skillsRequired, points } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const validation = validateCreation({ title, description, points }, user);
    if (!validation.isValid) {
      return res.status(validation.error.statusCode).json(validation.error);
    }

    const taskPoints = parseInt(points, 10);
    const pointsCheck = hasSufficientPoints(user, taskPoints);
    if (!pointsCheck.hasSufficient) {
      const errorResponse = formatPointsError(pointsCheck);
      return res.status(errorResponse.statusCode).json(errorResponse);
    }

    const task = new Task({
      title,
      description,
      skillsRequired: skillsRequired || [],
      points: taskPoints,
      createdBy: req.user._id,
      status: "open",
    });

    await task.save();

    user.tasksPosted += 1;
    await user.save();

    res.status(201).json({
      message: "Task posted successfully",
      task,
      userStats: {
        tasksPosted: user.tasksPosted,
        points: user.points,
        isCreator: isTaskCreator(user, task),
      },
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET ALL TASKS (PUBLIC FEED)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("createdBy", "name email skills")
      .populate("acceptedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET SINGLE TASK
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("acceptedBy", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    console.error("Get Task Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ACCEPT TASK
exports.acceptTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const task = await Task.findById(id);

    const validation = validateAcceptance(task, userId);
    if (!validation.isValid) {
      return res.status(validation.error.statusCode).json(validation.error);
    }

    const authCheck = canUserPerformAction(req.user, task, "accept");
    if (!authCheck.isAuthorized) {
      const errorResponse = formatAuthorizationError(authCheck, "accept");
      return res.status(errorResponse.statusCode).json(errorResponse);
    }

    const updateResult = await Task.updateOne(
      {
        _id: id,
        acceptedBy: null,
        status: "open"
      },
      {
        acceptedBy: userId,
        status: "accepted"
      }
    );

    if (updateResult.matchedCount === 0) {
      const currentTask = await Task.findById(id);
      
      return res.status(400).json({
        message: "Cannot accept this task. It may have been accepted by another user or is no longer available.",
        currentStatus: currentTask?.status,
        statusDescription: getTaskStatusDescription(currentTask?.status),
        acceptedBy: currentTask?.acceptedBy,
      });
    }

    const updatedTask = await Task.findById(id)
      .populate("createdBy", "name email")
      .populate("acceptedBy", "name email");

    res.status(200).json({
      message: "Task accepted successfully!",
      task: updatedTask,
      userStats: {
        isHelper: isTaskHelper(req.user, updatedTask),
      },
    });
  } catch (error) {
    console.error("Accept Task Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// COMPLETE TASK
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = req.user._id;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
        taskId: id,
      });
    }

    if (task.completedAt) {
      return res.status(400).json({
        message: "This task has already been completed.",
        completedAt: task.completedAt,
        error: "TASK_ALREADY_COMPLETED",
        idempotent: true,
      });
    }

    if (task.status !== "accepted") {
      return res.status(400).json({
        message: `Cannot complete task. Task status is "${task.status}". Only "accepted" tasks can be completed.`,
        currentStatus: task.status,
        error: "INVALID_TASK_STATUS",
      });
    }

    if (!task.createdBy.equals(creatorId)) {
      return res.status(403).json({
        message: "Only the task creator can mark this task as completed.",
        error: "UNAUTHORIZED_COMPLETION",
      });
    }

    if (!task.acceptedBy) {
      return res.status(400).json({
        message: "Cannot complete task without an assigned helper.",
        error: "NO_HELPER_ASSIGNED",
      });
    }

    const creator = await User.findById(creatorId);

    if (!creator) {
      return res.status(401).json({
        message: "Your account was not found. Cannot proceed with task completion.",
        error: "CREATOR_NOT_FOUND",
      });
    }

    const helper = await User.findById(task.acceptedBy);

    if (!helper) {
      console.error(
        `Helper user ${task.acceptedBy} not found for task completion. Task: ${id}`
      );

      return res.status(400).json({
        message:
          "Cannot complete task: The helper who accepted this task is no longer available.",
        error: "HELPER_NOT_FOUND",
        helperId: task.acceptedBy.toString(),
        suggestion:
          "Please contact support. Your task and points remain safe and will be reviewed by an administrator.",
      });
    }

    const pointsCheck = hasSufficientPoints(creator, task.points);
    if (!pointsCheck.hasSufficient) {
      return res.status(400).json({
        message: `Cannot complete task. Insufficient points balance. You have ${pointsCheck.available} points but need ${pointsCheck.required} to complete this task.`,
        error: "INSUFFICIENT_POINTS",
        available: pointsCheck.available,
        required: pointsCheck.required,
        deficit: pointsCheck.deficit,
        suggestion: `You need ${pointsCheck.deficit} more points. Please complete other tasks to earn additional points.`,
      });
    }

    const session = await Task.startSession();
    session.startTransaction();

    try {
      const transactionTask = await Task.findById(id).session(session);
      const transactionCreator = await User.findById(creatorId).session(session);
      const transactionHelper = await User.findById(task.acceptedBy).session(
        session
      );

      if (!transactionTask || transactionTask.completedAt) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Task was completed by another request. Please refresh.",
          error: "RACE_CONDITION_DETECTED",
        });
      }

      if (!transactionCreator || !transactionHelper) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "User data inconsistency detected. Transaction aborted.",
          error: "DATA_INCONSISTENCY",
          suggestion: "Please try again or contact support if this persists.",
        });
      }

      const pointsToTransfer = transactionTask.points;
      transactionCreator.points -= pointsToTransfer;
      transactionHelper.points += pointsToTransfer;
      transactionHelper.tasksCompleted += 1;

      transactionTask.status = "completed";
      transactionTask.completedAt = new Date();

      await transactionCreator.save({ session });
      await transactionHelper.save({ session });
      await transactionTask.save({ session });

      await session.commitTransaction();


      await transactionTask
        .populate("createdBy", "name email")
        .populate("acceptedBy", "name email");

      res.status(200).json({
        message: "Task completed successfully! Points transferred.",
        task: transactionTask,
        pointsTransferred: {
          from: transactionCreator.name,
          to: transactionHelper.name,
          amount: pointsToTransfer,
        },
        updatedStats: {
          creatorPoints: transactionCreator.points,
          helperPoints: transactionHelper.points,
          helperTasksCompleted: transactionHelper.tasksCompleted,
        },
      });
    } catch (transactionError) {
      await session.abortTransaction();
      console.error("Transaction error during task completion:", transactionError);

      return res.status(500).json({
        message: "Transaction failed. No points were transferred.",
        error: "TRANSACTION_FAILED",
        suggestion: "Please try again or contact support if this persists.",
      });
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Complete Task Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid task ID format.",
        error: "INVALID_TASK_ID",
      });
    }

    if (error.name === "MongoError" || error.name === "MongoNetworkError") {
      return res.status(503).json({
        message:
          "Database error. Please try again later.",
        error: "DATABASE_ERROR",
      });
    }

    res.status(500).json({
      message:
        "An unexpected error occurred while completing the task.",
      error: "INTERNAL_SERVER_ERROR",
      suggestion: "Please try again or contact support if this persists.",
    });
  }
};
