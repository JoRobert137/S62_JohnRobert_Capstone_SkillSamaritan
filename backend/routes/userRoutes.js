const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { updateUserValidation } = require("../utils/validationSchemas");

// GET ALL USERS
router.get("/", authenticateToken, userController.getAllUsers);

// GET LEADERBOARD (TOP USERS BY POINTS)
router.get("/leaderboard", authenticateToken, userController.getLeaderboard);

// GET SINGLE USER BY ID
router.get("/:id", authenticateToken, userController.getUserById);

// UPDATE EXISTING USER
router.put("/:id", authenticateToken, updateUserValidation, validateRequest, userController.updateUser);

module.exports = router;
