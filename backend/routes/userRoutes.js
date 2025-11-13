const express = require("express");
const router = express.Router();
const { getAllUsers, updateUser } = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");

// GET ALL USERS
router.get("/", authenticateToken, getAllUsers);

// UPDATE EXISTING USER
router.put("/:id", authenticateToken, updateUser);

module.exports = router;
