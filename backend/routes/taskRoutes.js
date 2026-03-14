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
// POST /api/tasks
router.post("/", authenticateToken, createTask);

// GET ALL TASKS (public feed)
// GET /api/tasks
router.get("/", getAllTasks);

// GET SINGLE TASK (public)
// GET /api/tasks/:id
router.get("/:id", getTaskById);

// ACCEPT TASK (protected)
// POST /api/tasks/:id/accept
router.post("/:id/accept", authenticateToken, acceptTask);

// COMPLETE TASK (protected)
// POST /api/tasks/:id/complete
router.post("/:id/complete", authenticateToken, completeTask);

module.exports = router;
