const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskById,
  acceptTask,
  completeTask,
} = require("../controllers/taskController");

const authenticateToken = require("../middleware/auth");

// CREATE TASK (protected)
router.post("/", authenticateToken, createTask);

// GET ALL TASKS (public feed)
router.get("/", getAllTasks);

// GET SINGLE TASK
router.get("/:id", getTaskById);

// ACCEPT TASK (protected)
router.put("/accept/:id", authenticateToken, acceptTask);

// COMPLETE TASK (protected)
router.put("/complete/:id", authenticateToken, completeTask);

module.exports = router;
