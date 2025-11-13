const Task = require("../models/taskModel");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, skillsRequired, points } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const task = new Task({
      title,
      description,
      skillsRequired: skillsRequired || [],
      points: points || 0,
      createdBy: req.user._id,
    });

    await task.save();

    res.status(201).json({
      message: "Task posted successfully",
      task,
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

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    if (task.status !== "open") {
      return res.status(400).json({ message: "Task already accepted or completed." });
    }

    task.acceptedBy = req.user._id;
    task.status = "accepted";

    await task.save();

    res.status(200).json({
      message: "Task accepted successfully",
      task,
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

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    if (task.status !== "accepted") {
      return res.status(400).json({ message: "Task must be accepted before completion." });
    }

    if (task.acceptedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to complete this task." });
    }

    task.status = "completed";
    await task.save();

    res.status(200).json({
      message: "Task completed successfully",
      task,
    });
  } catch (error) {
    console.error("Complete Task Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
