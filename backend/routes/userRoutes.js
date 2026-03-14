const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");

// GET ALL USERS
router.get("/", authenticateToken, userController.getAllUsers);

// UPDATE EXISTING USER
router.put("/:id", authenticateToken, userController.updateUser);

module.exports = router;
