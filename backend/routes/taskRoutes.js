const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

const authenticateToken = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { createTaskValidation } = require("../utils/validationSchemas");

// CREATE TASK (protected)
// POST /api/tasks
router.post("/", authenticateToken, createTaskValidation, validateRequest, taskController.createTask);

// GET ALL TASKS (public feed)
// GET /api/tasks
router.get("/", taskController.getAllTasks);

// GET SINGLE TASK (public)
// GET /api/tasks/:id
router.get("/:id", taskController.getTaskById);

// ACCEPT TASK (protected)
// POST /api/tasks/:id/accept
router.post("/:id/accept", authenticateToken, taskController.acceptTask);

// COMPLETE TASK (protected)
// POST /api/tasks/:id/complete
router.post("/:id/complete", authenticateToken, taskController.completeTask);

module.exports = router;
