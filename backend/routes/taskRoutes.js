const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRole");
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

// GET TASK COMMENTS (public)
// GET /api/tasks/:id/comments
router.get("/:id/comments", taskController.getTaskComments);

// ADD TASK COMMENT (protected)
// POST /api/tasks/:id/comment
router.post("/:id/comment", authenticateToken, taskController.addTaskComment);

// DELETE TASK (admin only)
// DELETE /api/tasks/:id
router.delete("/:id", authenticateToken, authorizeRoles("admin"), taskController.deleteTask);

// ACCEPT TASK (protected)
// POST /api/tasks/:id/accept
router.post("/:id/accept", authenticateToken, taskController.acceptTask);

// COMPLETE TASK (protected)
// POST /api/tasks/:id/complete
router.post("/:id/complete", authenticateToken, taskController.completeTask);

// CONFIRM TASK COMPLETION (protected)
// POST /api/tasks/:id/confirm
router.post("/:id/confirm", authenticateToken, taskController.confirmTaskCompletion);

module.exports = router;
